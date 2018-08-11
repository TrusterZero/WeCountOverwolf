
export enum SocketEvents {
  startCooldown = 'startCooldown',
  createMatch = 'createMatch',
  matchCreated = 'matchCreated',
  sumUsed = 'sumUsed',
  requestError = 'error',
}

export enum RequestErrorCodes {
  notFound = 404,
  forbidden = 403,
  unauthorized = 401,
  unhandled = 1111,
}

export interface RequestError {
  status: RequestErrorCodes;
}

export interface CreationRequest {
  summonerId: number;
}

export interface Payload {
  roomId: number;
  data: any;
}

export interface CooldownActivationData {
  spellId: string;
  timeStamp: number; // unix timestamp data type
}
