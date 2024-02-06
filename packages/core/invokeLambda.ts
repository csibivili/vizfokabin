import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda"
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node"

const lambdaClient = new LambdaClient({ region: "eu-central-1" })

export interface LambdaHandlerProps<T extends Record<string, unknown>> {
  body: T
}

interface InvokeLambdaProps {
  functionName: string
}

export const invokeLambda = async <T extends Record<string, unknown>>({
  functionName,
  body,
}: InvokeLambdaProps & LambdaHandlerProps<T>): Promise<
  Record<string, unknown> & { status: number }
> => {
  const invokeCommand = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: fromUtf8(JSON.stringify({ body })),
  })
  const { Payload } = await lambdaClient.send(invokeCommand)

  return JSON.parse(toUtf8(Payload as Uint8Array))
}
