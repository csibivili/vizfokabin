import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Table } from "sst/node/table"

export const main: APIGatewayProxyHandler = async (event) => {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  const { bookingId } = event.queryStringParameters as Record<string, string>
  const { connectionId } = event.requestContext
  const update = new UpdateCommand({
    TableName: Table.Customers.tableName,
    Key: {
      bookingId,
    },
    UpdateExpression:
      "SET connectionId = :connectionId, updatedAt = :updatedAt, createdAt = :createdAt",
    ExpressionAttributeValues: {
      ":connectionId": connectionId,
      ":updatedAt": new Date().toISOString(),
      ":createdAt": new Date().toISOString(),
    },
  })
  await db.send(update)
  return { statusCode: 200, body: "connected" }
}
