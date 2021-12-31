import {
  getPlayerEvent,
  getPlayerNamesEvent,
  Player,
  RetrievePlayerNamesRequest,
  RetrievePlayerRequest,
  savePlayerData,
  savePlayerEvent,
  SavePlayerRequest,
} from './schema';

const options = {
  abortEarly: true,
  stripUnknown: true,
};

export const GROUP_ID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export async function createSavePlayerRequest(
  event: any
): Promise<SavePlayerRequest> {
  await savePlayerEvent.validate(event, options);
  const params = event.queryStringParameters;

  const groupId = params.groupId;
  const playerName = params.playerName;
  const player: Player = JSON.parse(event.body);

  await savePlayerData.validate(player, options);

  return { groupId, playerName, player };
}

export async function createGetPlayerRequest(
  event: any
): Promise<RetrievePlayerRequest> {
  await getPlayerEvent.validate(event, options);
  const params = event.queryStringParameters;

  return {
    groupId: params.groupId,
    playerName: params.playerName,
  };
}

export async function createGetPlayerNamesRequest(
  event: any
): Promise<RetrievePlayerNamesRequest> {
  await getPlayerNamesEvent.validate(event, options);
  const params = event.queryStringParameters;

  return { groupId: params.groupId };
}
