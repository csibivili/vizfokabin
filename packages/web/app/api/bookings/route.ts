import { type NextRequest, NextResponse } from "next/server"
import { Queue } from "sst/node/queue"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
import { v4 as uuidv4 } from "uuid"

const client = new SQSClient({ region: "eu-central-1" })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const id = uuidv4()
  const command = new SendMessageCommand({
    QueueUrl: Queue.BookingsQueue.queueUrl,
    MessageBody: JSON.stringify({ ...body, bookingId: id }),
    MessageGroupId: "bookings",
    MessageDeduplicationId: id,
  })
  await client.send(command)

  return new NextResponse(JSON.stringify({ bookingId: id }), {
    status: 200,
  })
}
