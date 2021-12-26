import { Handler, Context } from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { getGroupId } from '../common/request';
import { badRequest, serverError, success } from '../common/response';

export const handler: Handler = async (event: any, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const groupId = getGroupId(event);

    if (groupId) {
      const names = await getPlayerNames(groupId);
      return success(names);
    } else if (!groupId) {
      return badRequest('Group ID is invalid');
    } else {
      return badRequest('Unable to parse request');
    }
  } catch (error) {
    console.log({ error });
    return serverError();
  }
};

async function getPlayerNames(groupId) {
  const db = await getDatabase();
  const cursor = await db
    .collection('players')
    .find({ groupId })
    .project({ name: 1, _id: 0 });

  const players = await cursor.toArray();
  return players.map((p) => p.name);
}
