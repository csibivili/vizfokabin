import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi"
import { WebSocketApi } from "sst/node/websocket-api"

const client = new ApiGatewayManagementApiClient({
  region: "eu-central-1",
  endpoint: WebSocketApi.ws.httpsUrl,
})

export const sendMessage = async (connectionId: string, message: string) => {
  const input = {
    Data: message,
    ConnectionId: connectionId,
  }
  const command = new PostToConnectionCommand(input)
  await client.send(command)
}
