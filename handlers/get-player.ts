import { Handler, Context } from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { getGroupId, getPlayerName } from '../common/request';
import { badRequest, serverError, success } from '../common/response';

export const handler: Handler = async (event: any, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const groupId = getGroupId(event);
    const name = getPlayerName(event);

    if (groupId && name) {
      const player = await getPlayer(groupId, name);
      return success(player);
    } else if (!groupId) {
      return badRequest('Group ID is invalid');
    } else if (!name) {
      return badRequest('Player name is invalid');
    } else {
      return badRequest('Unable to parse request');
    }
  } catch (error) {
    console.log({ error });
    return serverError();
  }
};

async function getPlayer(groupId, name): Promise<any> {
  const db = await getDatabase();
  return await db.collection('players').findOne({ groupId, name });
}
