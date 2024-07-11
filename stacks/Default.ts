import { StackContext, NextjsSite } from "sst/constructs"

export function Default({ stack, app }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    customDomain: {
      domainName: "vizfokabin.com",
      domainAlias: "www.vizfokabin.com",
    },
    bind: [],
    environment: {},
  })

  if (stack.stage !== "prod") {
    app.setDefaultRemovalPolicy("destroy")
  }

  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
  })
}
