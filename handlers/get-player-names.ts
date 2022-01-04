import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createGetPlayerNamesRequest as getRequest } from '../common/request';
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
    const response = await getPlayerNames(event);
    return success(response);
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error?.errors) : serverError();
}

async function getPlayerNames(event: APIGatewayProxyEvent) {
  const { groupId } = await getRequest(event);

  console.log({ request: { groupId } });

  const db = await getDatabase();
  const cursor = await db
    .collection('players')
    .find({ groupId })
    .project({ name: 1, _id: 0 });

  const players = await cursor.toArray();
  return players.map((p) => p.name);
}
