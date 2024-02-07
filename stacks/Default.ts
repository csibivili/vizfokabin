import {
  StackContext,
  NextjsSite,
  Table,
  Function,
  Queue,
  WebSocketApi,
} from "sst/constructs"

export function Default({ stack, app }: StackContext) {
  const bookingsTable = new Table(stack, "Bookings", {
    fields: {
      year_month: "string",
      day: "number",
    },
    primaryIndex: { partitionKey: "year_month", sortKey: "day" },
  })

  const customersTable = new Table(stack, "Customers", {
    fields: {
      bookingId: "string",
    },
    primaryIndex: { partitionKey: "bookingId" },
  })

  const wsApi = new WebSocketApi(stack, "ws", {
    defaults: {
      function: {
        bind: [customersTable],
      },
    },
    customDomain:
      stack.stage === "prod"
        ? { domainName: "ws.vizfokabin.com", hostedZone: "vizfokabin.com" }
        : undefined,
    routes: {
      $connect: "packages/functions/ws/connect.main",
      $disconnect: "packages/functions/ws/disconnect.main",
    },
  })

  const bookFunction = new Function(stack, "Book", {
    runtime: "nodejs20.x",
    handler: "packages/functions/book.handler",
    bind: [bookingsTable, customersTable, wsApi],
  })

  const queue = new Queue(stack, "BookingsQueue", {
    consumer: bookFunction,
    cdk: {
      queue: {
        fifo: true,
      },
    },
  })

  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    customDomain: {
      domainName: "vizfokabin.com",
      domainAlias: "www.vizfokabin.com",
    },
    bind: [queue],
    environment: {
      NEXT_PUBLIC_WS_URL: wsApi.url,
    },
  })

  if (stack.stage !== "prod") {
    app.setDefaultRemovalPolicy("destroy")
  }

  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
    BookFunction: bookFunction.functionName,
    WebSocketApiUrl: wsApi.customDomainUrl || wsApi.url,
  })
}
