export enum Feature {
    matchState = 'matchState',
    death = 'death',
    respawn = 'respawn',
    abilities = 'abilities',
    kill = 'kill',
    assist = 'assist',
    gold = 'gold',
    minions = 'minions',
    summonerInfo = 'summoner_info',
    gameMode = 'gameMode',
    teams = 'teams',
    level = 'level',
    announcer = 'announcer'
}

export enum Hotkey {
  showWindow = 'showWindow',
}

export enum Status {
  error = 'error',
  success = 'success'
}

export interface OverwolfKeyEvent {
  key: string;
  onGame: boolean;
}

export interface ShowWindowHotkey {
  ctrlPressed: boolean;
  spacePressed: boolean;
}

export interface NewEventResultSet {
  events: NewEvent[];
}

export interface NewEvent {
  name: string;
  data: any;
}
// TODO ADD ALL POSSIBLE EVENTS
export enum NewEventName {
  matchEnd = 'matchEnd',
}

export interface WindowResult {
  status: string;
  window: OverwolfWindow;
}

export interface OverwolfWindow {
    id: string;
    name: string;
    width: number;
    height: number;
    top: number;
    left: number;
    isVisible: boolean;
    Parent: OverwolfWindow;
}

export interface Update {
    summoner_info: SummonerInfo;
    game_info: GameInfo;
}
interface SummonerInfo {
  id: number;
  region: string;
}

interface GameInfo {
  matchStarted: boolean;
}
export interface GameModeInfo {
    gameMode: string;
}

export interface MatchState {
  summonerId: number;
  region: string;
  matchActive: boolean;
}
