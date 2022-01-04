import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createGetGIMStorageRequest as getRequest } from '../common/request';
import {
  ApiResponse,
  badRequest,
  serverError,
  success,
} from '../common/response';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<ApiResponse> => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log({ event });

  try {
    const response = await getGimStorage(event);
    return success(response);
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error?.errors) : serverError();
}

async function getGimStorage(event: APIGatewayProxyEvent): Promise<any> {
  const { groupId } = await getRequest(event);

  console.log({ request: { groupId } });

  const db = await getDatabase();
  return await db.collection('gim-storage').findOne({ groupId });
}
