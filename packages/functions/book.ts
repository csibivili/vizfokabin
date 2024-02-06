import type { Context, Callback } from 'aws-lambda/handler';

import { LambdaHandlerProps } from '../core/invokeLambda';

export const handler = async (event: LambdaHandlerProps, context: Context, callback: Callback) => { 
  console.log('event', event);
  return {
    statusCode: 200,
    body:{ message: 'Hello' },
  };
};