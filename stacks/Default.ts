import { StackContext, NextjsSite } from "sst/constructs";

export function Default({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    customDomain: {
      domainName: "vizfokabin.com",
      domainAlias: "www.vizfokabin.com",
    }
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
