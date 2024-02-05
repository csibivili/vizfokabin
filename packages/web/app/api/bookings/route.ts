import { type NextRequest, NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

export const dynamic = "force-dynamic" // defaults to auto
export async function POST(request: NextRequest) {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const res = await request.json()
  console.log(res);
  // TODO: validate if date is available
  // const update = new UpdateCommand({
  //   TableName: Table.Bookings.tableName,
  //   Key: {
  //     year_month: "2024_01",
  //     day: 1,
  //   },
  //   UpdateExpression: "SET email = :email",
  //   ExpressionAttributeValues: {
  //     ":email": "test@test.com",
  //   },
  // });
  // await db.send(update);
  return new NextResponse(JSON.stringify({ message: "Hello" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  })
}
