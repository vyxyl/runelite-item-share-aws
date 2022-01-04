import {
  GIMStorage,
  Player,
  RetrievePlayerNamesRequest,
  RetrievePlayerRequest,
  SaveGIMStorageRequest,
  SavePlayerRequest,
  RetrieveGIMStorageRequest,
  getPlayerEvent,
  getPlayerNamesEvent,
  savePlayerData,
  saveGIMStorageData,
  savePlayerEvent,
  saveGIMStorageEvent,
  getGIMStorageEvent,
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

  const player: Player = JSON.parse(event.body);
  await savePlayerData.validate(player, options);

  return { groupId: params.groupId, playerName: params.playerName, player };
}

export async function createGetGIMStorageRequest(
  event: any
): Promise<RetrieveGIMStorageRequest> {
  await getGIMStorageEvent.validate(event, options);
  const params = event.queryStringParameters;

  return { groupId: params.groupId };
}

export async function createSaveGIMStorageRequest(
  event: any
): Promise<SaveGIMStorageRequest> {
  await saveGIMStorageEvent.validate(event, options);
  const params = event.queryStringParameters;

  const storage: GIMStorage = JSON.parse(event.body);
  await saveGIMStorageData.validate(storage, options);

  return {
    groupId: params.groupId,
    updatedDate: storage.updatedDate,
    items: storage.items,
  };
}

export async function createGetPlayerRequest(
  event: any
): Promise<RetrievePlayerRequest> {
  await getPlayerEvent.validate(event, options);
  const params = event.queryStringParameters;

  return { groupId: params.groupId, playerName: params.playerName };
}

export async function createGetPlayerNamesRequest(
  event: any
): Promise<RetrievePlayerNamesRequest> {
  await getPlayerNamesEvent.validate(event, options);
  const params = event.queryStringParameters;

  return { groupId: params.groupId };
}
