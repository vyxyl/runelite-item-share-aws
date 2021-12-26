import { Handler, Context } from 'aws-lambda';
import { getDatabase } from '../common/mongodb';
import { getGroupId, getPlayer } from '../common/request';
import { badRequest, serverError, success } from '../common/response';

export const handler: Handler = async (event: any, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const groupId = getGroupId(event);
    const player = getPlayer(event);

    if (groupId && player) {
      await savePlayer(groupId, player);
      return success({ groupId, name: player.name });
    } else if (!groupId) {
      return badRequest('Group ID is invalid');
    } else if (!player) {
      return badRequest('Player is invalid');
    } else {
      return badRequest('Unable to parse request');
    }
  } catch (error) {
    console.log({ error });
    return serverError();
  }
};

async function savePlayer(groupId, player) {
  const saveData = {
    bank: player.bank,
    equipment: player.equipment,
    inventory: player.inventory,
    updatedDate: new Date(),
  };

  const db = await getDatabase();
  await db
    .collection('players')
    .updateOne(
      { groupId, name: player.name },
      { $set: saveData },
      { upsert: true }
    );
}
