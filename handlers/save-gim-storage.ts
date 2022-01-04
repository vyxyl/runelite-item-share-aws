import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createSaveGIMStorageRequest as getRequest } from '../common/request';
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
    await saveGIMStorage(event);
    return success();
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error?.errors) : serverError();
}

async function saveGIMStorage(event: APIGatewayProxyEvent) {
  const { groupId, updatedDate, items } = await getRequest(event);

  console.log({ request: { groupId, updatedDate, items } });

  const data = {
    groupId,
    items,
    updatedDate: new Date(),
  };

  const db = await getDatabase();
  await db
    .collection('gim-storage')
    .updateOne({ groupId }, { $set: data }, { upsert: true });
}
