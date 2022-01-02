import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { createSavePlayerRequest as getRequest } from '../common/request';
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
    await savePlayer(event);
    return success();
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error: any) {
  console.log({ error });
  return error?.errors ? badRequest(error?.errors) : serverError();
}

async function savePlayer(event: APIGatewayProxyEvent) {
  const { groupId, playerName, player } = await getRequest(event);
  const { bank, equipment, inventory } = player;

  console.log({ request: { groupId, playerName, player } });

  const data = {
    bank,
    equipment,
    inventory,
    updatedDate: new Date(),
  };

  const db = await getDatabase();
  await db
    .collection('players')
    .updateOne({ groupId, name: playerName }, { $set: data }, { upsert: true });
}
