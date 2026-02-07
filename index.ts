import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get("path") || "./www";
const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";
const domainName = config.get("domainName"); // e.g., "example.com" or "www.example.com"
const hostedZoneId = config.get("hostedZoneId"); // Optional: Route53 hosted zone ID if you want to specify it

function getOriginPath(folderPath: string): pulumi.Output<string> {
    return pulumi.all([folderPath]).apply(([folderPath]) => {
        const subPath = folderPath.replace(/^\.\//, "").replace(/\/$/, "");
        return subPath ? `/${subPath}` : "";
    });
}

// Create an S3 bucket and configure it as a website.
const bucket = new aws.s3.Bucket("bucket");

const bucketWebsite = new aws.s3.BucketWebsiteConfiguration(`${config.name}-bucket-website`, {
    bucket: bucket.bucket,
    // S3 suffix and error document key must be just the filename, not a path
    // The originPath in CloudFront handles the subdirectory routing
    indexDocument: {suffix: indexDocument},
    errorDocument: {key: errorDocument},
});

// Configure public ACL block on the new S3 bucket
const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(`${config.name}-public-access-block`, {
    bucket: bucket.bucket,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
});

// Create a bucket policy to allow public read access
const bucketPolicy = new aws.s3.BucketPolicy(`${config.name}-bucket-policy`, {
    bucket: bucket.bucket,
    policy: pulumi.all([bucket.bucket]).apply(([bucketName]) => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${bucketName}/*`,
            },
        ],
    })),
}, { dependsOn: [publicAccessBlock] });

// Use a synced folder to manage the files of the website.
// Note: With ObjectWriter ownership, ACLs are disabled, so we use "private" ACL and rely on bucket policy for public access
const bucketFolder = new synced_folder.S3BucketFolder(`${config.name}-bucket-folder`, {
    path: path,
    bucketName: bucket.bucket,
    acl: "private",
}, { dependsOn: [publicAccessBlock, bucketPolicy]});

// Set up custom domain if provided
let certificateArn: pulumi.Output<string> | undefined;
let zoneIdOutput: pulumi.Output<string> | undefined;
let domainValidationOptions: aws.acm.CertificateValidation | undefined;

if (domainName) {
    // Extract the root domain (e.g., "example.com" from "www.example.com")
    const rootDomain = domainName.replace(/^[^.]+\./, "");
    // Route53 hosted zone names require a trailing dot
    const rootDomainWithDot = rootDomain.endsWith(".") ? rootDomain : `${rootDomain}.`;
    
    // Look up the Route53 hosted zone
    // If hostedZoneId is provided, use it; otherwise, look up by domain name
    if (hostedZoneId) {
        zoneIdOutput = pulumi.output(hostedZoneId);
    } else {
        // Look up the hosted zone by domain name
        // Route53 stores domain names with a trailing dot
        const zoneLookupPromise = aws.route53.getZone({ name: rootDomainWithDot }, { async: true });
        zoneIdOutput = pulumi.output(zoneLookupPromise).apply(z => z.zoneId);
    }

    // Request an ACM certificate in us-east-1 (required for CloudFront)
    // Note: We need to use a provider for us-east-1 since CloudFront requires certificates from that region
    const usEast1Provider = new aws.Provider("us-east-1", {
        region: "us-east-1",
    });

    const certificate = new aws.acm.Certificate("certificate", {
        domainName: domainName,
        validationMethod: "DNS",
    }, { provider: usEast1Provider });

    // Get the DNS validation record from the certificate
    const certificateValidationDomain = certificate.domainValidationOptions.apply(
        (options) => options[0].resourceRecordName
    );
    const certificateValidationRecord = certificate.domainValidationOptions.apply(
        (options) => options[0].resourceRecordValue
    );

    // Create Route53 record for certificate validation
    // allowOverwrite: true allows Pulumi to manage existing records
    const certificateValidationRecordResource = new aws.route53.Record("certificate-validation", {
        zoneId: zoneIdOutput!,
        name: certificateValidationDomain,
        type: "CNAME",
        records: [certificateValidationRecord],
        ttl: 60,
        allowOverwrite: true,
    });

    // Validate the certificate
    domainValidationOptions = new aws.acm.CertificateValidation("certificate-validation", {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certificateValidationRecordResource.fqdn],
    }, { provider: usEast1Provider });

    certificateArn = domainValidationOptions.certificateArn;
}

// Create a CloudFront CDN to distribute and cache the website.
const cdn = new aws.cloudfront.Distribution("cdn", {
    enabled: true,
    aliases: domainName ? [domainName] : undefined,
    origins: [{
        originId: bucket.arn,
        domainName: bucketWebsite.websiteEndpoint,
        originPath: getOriginPath(path),
        customOriginConfig: {
            originProtocolPolicy: "http-only",
            httpPort: 80,
            httpsPort: 443,
            originSslProtocols: ["TLSv1.2"],
        },
    }],
    defaultRootObject: indexDocument,
    defaultCacheBehavior: {
        targetOriginId: bucket.arn,
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: [
            "GET",
            "HEAD",
            "OPTIONS",
        ],
        cachedMethods: [
            "GET",
            "HEAD",
            "OPTIONS",
        ],
        defaultTtl: 600,
        maxTtl: 600,
        minTtl: 600,
        forwardedValues: {
            queryString: true,
            cookies: {
                forward: "all",
            },
        },
    },
    priceClass: "PriceClass_100",
    customErrorResponses: [{
        errorCode: 404,
        responseCode: 200,
        responsePagePath: pulumi.all([errorDocument]).apply(([doc]) => `/${doc}`),
        errorCachingMinTtl: 0,
    }],
    restrictions: {
        geoRestriction: {
            restrictionType: "none",
        },
    },
    viewerCertificate: certificateArn ? {
        acmCertificateArn: certificateArn,
        sslSupportMethod: "sni-only",
        minimumProtocolVersion: "TLSv1.2_2021",
    } : {
        cloudfrontDefaultCertificate: true,
    },
}, { 
    dependsOn: domainValidationOptions 
        ? [bucketFolder, domainValidationOptions] 
        : [bucketFolder] 
});

// Create Route53 records pointing to CloudFront distribution if domain is configured
if (domainName && zoneIdOutput) {
    // Create A record (alias) pointing to CloudFront
    new aws.route53.Record("domain-a-record", {
        zoneId: zoneIdOutput,
        name: domainName,
        type: "A",
        aliases: [{
            name: cdn.domainName,
            zoneId: cdn.hostedZoneId,
            evaluateTargetHealth: false,
        }],
    });

    // Create AAAA record (IPv6 alias) pointing to CloudFront
    new aws.route53.Record("domain-aaaa-record", {
        zoneId: zoneIdOutput,
        name: domainName,
        type: "AAAA",
        aliases: [{
            name: cdn.domainName,
            zoneId: cdn.hostedZoneId,
            evaluateTargetHealth: false,
        }],
    });
}

// Export the URLs and hostnames of the bucket and distribution.
export const originURL = pulumi.interpolate`http://${bucketWebsite.websiteEndpoint}`;
export const originHostname = bucketWebsite.websiteEndpoint;
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
export const cdnHostname = cdn.domainName;
export const customDomainURL = domainName ? pulumi.interpolate`https://${domainName}` : undefined;
export const customDomain = domainName;
