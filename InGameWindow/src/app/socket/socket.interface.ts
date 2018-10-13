export enum SocketEvent {
  startCooldown = 'startCooldown',
  createMatch = 'createMatch',
  matchCreated = 'matchCreated',
  sumUsed = 'sumUsed',
  requestError = 'requestError',
  connectionError = 'connect_error'
}

export enum Source {
  pc = 0,
  mobile = 1
}

export enum ErrorCode {
  notFound = 404,
  matchNotFound = 4041,
  summonerNotfound = 4042,
  forbidden = 403,
  unauthorized = 401,
  rateLimitExceeded = 429,
  unhandled = 0,
  noSummoners= 1,
  wrongGameMode= 2
}

export enum RequestErrorMessage {
  summonerNotFound = 'Can\'t find your summonername, please re-login',
  matchNotFound = 'Wait until the loading screen pops up, then we will be ready',
  wrongGameMode = 'We Count can\'t be used in this gamemode',
  noSummoners = 'No enemies found in this match',
  invalidData = 'Something is wrong with the data!',
  generic = 'Error occured please try again later'
}

export interface RequestError {
  status: ErrorCode;
  message: RequestErrorMessage;
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
