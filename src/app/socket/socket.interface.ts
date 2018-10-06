export enum SocketEvent {
  startCooldown = 'startCooldown',
  createMatch = 'createMatch',
  matchCreated = 'matchCreated',
  sumUsed = 'sumUsed',
  requestError = 'error'
}

export enum Source {
  pc =  0,
  mobile = 1
}

export enum ErrorCode {
  notFound = 404,
  forbidden = 403,
  unauthorized = 401,
  unhandled = 0,
  noSummoners= 1
}

export interface RequestError {
  status: ErrorCode;
}

export interface CreationRequest {
  summonerName?: string;
  summonerId?: number;
  region: string;
}

export interface Payload {
  source?: Source;
  roomId: number;
  data: any;
}

export interface CooldownActivationData {
  spellId: string;
  timeStamp: number; // unix timestamp data type
}
