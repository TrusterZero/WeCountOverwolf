export enum SocketEvents {
  startCooldown = 'startCooldown',
  createMatch = 'createMatch',
  matchCreated = 'matchCreated',
  sumUsed = 'sumUsed',
  requestError = 'error'
}

export enum ErrorCode {
  notFound = 404,
  forbidden = 403,
  unauthorized = 401,
  noSummoners = 1001,
  wrongGameMode = 1002,
  unhandled = null
}

export interface RequestError {
  status: ErrorCode;
}

export interface CreationRequest {
  summonerId: number;
  region: string;
}

export interface Payload {
  roomId: number;
  data: any;
}

export interface CooldownActivationData {
  spellId: string;
  timeStamp: number; // unix timestamp data type
}


