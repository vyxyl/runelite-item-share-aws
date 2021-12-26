import { Handler, Context } from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { getGroupId, getPlayerName } from '../common/request';
import { badRequest, serverError, success } from '../common/response';

export const handler: Handler = async (event: any, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const groupId = getGroupId(event);
    const playerName = getPlayerName(event);

    if (groupId && playerName) {
      const player = await getPlayer(groupId, playerName);
      return success(player);
    } else if (!groupId) {
      return badRequest('Group ID is invalid');
    } else if (!playerName) {
      return badRequest('Player Name is invalid');
    } else {
      return badRequest('Unable to parse request');
    }
  } catch (error) {
    console.log({ error });
    return serverError();
  }
};

async function getPlayer(groupId, playerName): Promise<any> {
  const db = await getDatabase();
  return await db.collection('players').findOne({ groupId, name: playerName });
}
