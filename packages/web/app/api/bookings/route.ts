import { type NextRequest, NextResponse } from "next/server"

import { invokeLambda } from "../../../../core/invokeLambda"

export const dynamic = "force-dynamic" // defaults to auto
export async function POST(request: NextRequest) {
  const response = await invokeLambda({
    functionName: "Book",
    body: {
      message: "Hello",
    }
  })
  console.log(response)
  return new NextResponse(JSON.stringify({ message: "Hello" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  })
}
