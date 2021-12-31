import { Handler, Context } from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createGetPlayerNamesRequest as getRequest } from '../common/request';
import {
  ApiResponse,
  badRequest,
  serverError,
  success,
} from '../common/response';

export const handler: Handler = async (
  event: any,
  context: Context
): Promise<ApiResponse> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const response = await getPlayerNames(event);
    return success(response);
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error) : serverError();
}

async function getPlayerNames(event: any) {
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
