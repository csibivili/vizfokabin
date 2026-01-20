import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get("path") || "./www";
const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";

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

// Create a CloudFront CDN to distribute and cache the website.
const cdn = new aws.cloudfront.Distribution("cdn", {
    enabled: true,
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
    viewerCertificate: {
        cloudfrontDefaultCertificate: true,
    },
}, { dependsOn: [bucketFolder] });

// Export the URLs and hostnames of the bucket and distribution.
export const originURL = pulumi.interpolate`http://${bucketWebsite.websiteEndpoint}`;
export const originHostname = bucketWebsite.websiteEndpoint;
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
export const cdnHostname = cdn.domainName;
