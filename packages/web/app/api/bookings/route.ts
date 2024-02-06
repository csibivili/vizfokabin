import { type NextRequest, NextResponse } from "next/server"

import { invokeLambda } from "../../../../core/invokeLambda"

export async function POST(request: NextRequest) {
  const body = await request.json()
  //TODO: instead of lambda invoke add new item to a sqs queue
  const response = await invokeLambda({
    functionName: "Book",
    body,
  })
  return new NextResponse(JSON.stringify(response), {
    status: response.status,
  })
}
