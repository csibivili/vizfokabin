import { StackContext, NextjsSite, Table, Function } from "sst/constructs"

export function Default({ stack }: StackContext) {
  const table = new Table(stack, "Bookings", {
    fields: {
      year_month: "string",
      day: "number",
    },
    primaryIndex: { partitionKey: "year_month", sortKey: "day" },
  })

  const bookFunction = new Function(stack, "Book", {
    runtime: "nodejs20.x",
    handler: "packages/functions/book.handler",
    functionName: "Book",
    bind: [table],
  })

  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    customDomain: {
      domainName: "vizfokabin.com",
      domainAlias: "www.vizfokabin.com",
    },
    bind: [bookFunction],
  })

  stack.addOutputs({
    SiteUrl: site.url,
    BookFunction: bookFunction.functionName,
  })
}
