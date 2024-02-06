import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node';

const lambdaClient = new LambdaClient({ region: 'eu-central-1' });

export interface LambdaHandlerProps {
  headers?: unknown;
  body?: unknown;
}

export interface InvokeLambdaProps {
  functionName: string;
  invocationType?: 'Event' | 'RequestResponse';
}

export const invokeLambda = async ({
  functionName,
  headers,
  body,
  invocationType = 'RequestResponse',
}: InvokeLambdaProps & LambdaHandlerProps): Promise<any> => {
  const invokeCommand = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: invocationType,
    LogType: 'Tail',
    Payload: fromUtf8(
      JSON.stringify({
        body,
        headers
      })
    )
  });
  const { Payload } = await lambdaClient.send(invokeCommand);

  if (invocationType === 'Event') {
    return undefined;
  }

  return JSON.parse(toUtf8(Payload as Uint8Array));
};
