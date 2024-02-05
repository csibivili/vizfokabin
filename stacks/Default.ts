import { StackContext, NextjsSite, Table } from "sst/constructs"

export function Default({ stack }: StackContext) {
  const table = new Table(stack, "Bookings", {
    fields: {
      year_month: "string",
      day: "number",
    },
    primaryIndex: { partitionKey: "year_month", sortKey: "day" },
  })

  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    customDomain: {
      domainName: "vizfokabin.com",
      domainAlias: "www.vizfokabin.com",
    },
    bind: [table],
  })

  stack.addOutputs({
    SiteUrl: site.url,
  })
}
