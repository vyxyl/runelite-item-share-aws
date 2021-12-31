import * as yup from 'yup';
import { GROUP_ID_REGEX } from './request';

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

export interface RetrievePlayerRequest {
  groupId: string;
  playerName: string;
}

export interface RetrievePlayerNamesRequest {
  groupId: string;
}

const groupId = yup.string().matches(GROUP_ID_REGEX).required();
const playerName = yup.string().max(25).required();

export const savePlayerData = yup.object().shape({
  bank: yup
    .array(yup.number())
    .max(1100 * 2)
    .required(),

  equipment: yup
    .array(yup.number())
    .max(11 * 3)
    .required(),

  inventory: yup
    .array(yup.number())
    .max(28 * 2)
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
