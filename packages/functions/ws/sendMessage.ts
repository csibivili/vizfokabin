import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Table } from "sst/node/table"
import {
  ScanCommand,
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse(event.body ?? "").data
  const { stage, domainName } = event.requestContext
  const client = new ApiGatewayManagementApiClient({
    region: "eu-central-1",
    endpoint: `https://${domainName}/${stage}`,
  })

  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const command = new ScanCommand({
    TableName: Table.Connections.tableName,
    ProjectionExpression: "id",
  })
  // Get all the connections
  const connections = await db.send(command)

  const promises = connections.Items?.map(async (record) => {
    const id = record.id as string
    try {
      const input = {
        Data: messageData,
        ConnectionId: id,
      }
      const command = new PostToConnectionCommand(input)
      return client.send(command)
    } catch (e: any) {
      if (e.statusCode === 410) {
        // Remove stale connections
        const del = new DeleteCommand({
          TableName: Table.Connections.tableName,
          Key: {
            id,
          },
        })
        return db.send(del)
      }
    }
  })

  if (promises) {
    await Promise.all(promises)
  }
  // Iterate through all the connections

  return { statusCode: 200, body: "Message sent" }
}
