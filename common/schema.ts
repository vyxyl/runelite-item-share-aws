import * as yup from 'yup';
import { GROUP_ID_REGEX } from './request';

export interface GIMStorage {
  updatedDate: Date;
  items: number[];
}

export interface Player {
  bank: number[];
  inventory: number[];
  equipment: number[];
}

export interface SavePlayerRequest {
  groupId: string;
  playerName: string;
  player: Player;
}

export interface RetrieveGIMStorageRequest {
  groupId: string;
}

export interface SaveGIMStorageRequest {
  groupId: string;
  updatedDate: Date;
  items: number[];
}

export interface RetrievePlayerRequest {
  groupId: string;
  playerName: string;
}

export interface RetrievePlayerNamesRequest {
  groupId: string;
}

const groupId = yup.string().matches(GROUP_ID_REGEX).required();
const playerName = yup.string().max(25).required();

export const saveGIMStorageData = yup
  .object()
  .shape({
    updatedDate: yup.date().required(),
    items: yup
      .array(yup.number())
      .max(1100 * 2)
      .required(),
  })
  .required();

export const savePlayerData = yup.object().shape({
  bank: yup
    .object()
    .shape({
      items: yup
        .array(yup.number())
        .max(1100 * 2)
        .required(),
    })
    .required(),

  equipment: yup
    .object()
    .shape({
      items: yup
        .array(yup.number())
        .max(11 * 3)
        .required(),
    })
    .required(),

  inventory: yup
    .object()
    .shape({
      items: yup
        .array(yup.number())
        .max(28 * 2)
        .required(),
    })
    .required(),
});

export const getPlayerNamesEvent = yup.object().shape({
  queryStringParameters: yup.object().shape({ groupId }).required(),
});

export const getPlayerEvent = yup.object().shape({
  queryStringParameters: yup.object().shape({ groupId, playerName }).required(),
});

export const savePlayerEvent = yup.object().shape({
  body: yup.string().required(),
  queryStringParameters: yup.object().shape({ groupId, playerName }).required(),
});
export const getGIMStorageEvent = yup.object().shape({
  queryStringParameters: yup.object().shape({ groupId }).required(),
});

export const saveGIMStorageEvent = yup.object().shape({
  body: yup.string().required(),
  queryStringParameters: yup.object().shape({ groupId }).required(),
});
