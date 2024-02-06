import {
  StackContext,
  NextjsSite,
  Table,
  Function,
  Queue,
  WebSocketApi
} from "sst/constructs"

export function Default({ stack }: StackContext) {
  const bookingsTable = new Table(stack, "Bookings", {
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
    bind: [bookingsTable],
  })

  const queue = new Queue(stack, "BookingsQueue", {
    consumer: bookFunction,
    cdk: {
      queue: {
        fifo: true,
      }
    }
  })

  const connectionsTable = new Table(stack, "Connections", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const wsApi = new WebSocketApi(stack, "ws", {
    defaults: {
      function: {
        bind: [connectionsTable],
      },
    },
    customDomain: "ws.vizfokabin.com",
    routes: {
      $connect: "packages/functions/ws/connect.main",
      $disconnect: "packages/functions/ws/disconnect.main",
      sendmessage: "packages/functions/ws/sendMessage.main",
    },
  });

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

  stack.addOutputs({
    SiteUrl: site.url,
    BookFunction: bookFunction.functionName,
    WebSocketApiUrl: wsApi.url,
  })
}
