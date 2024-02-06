import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Table } from "sst/node/table"

export const main: APIGatewayProxyHandler = async (event) => {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const { connectionId } = event.requestContext
  const update = new UpdateCommand({
    TableName: Table.Connections.tableName,
    Key: {
      id: connectionId,
    },
  })
  await db.send(update)
  return { statusCode: 200, body: "Connected" }
}
