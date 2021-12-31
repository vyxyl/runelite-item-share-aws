import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createGetPlayerRequest as getRequest } from '../common/request';
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

  try {
    const response = await getPlayer(event);
    return success(response);
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error) : serverError();
}

async function getPlayer(event: APIGatewayProxyEvent): Promise<any> {
  const { groupId, playerName } = await getRequest(event);

  console.log({ request: { groupId, playerName } });

  const db = await getDatabase();
  return await db.collection('players').findOne({ groupId, name: playerName });
}
