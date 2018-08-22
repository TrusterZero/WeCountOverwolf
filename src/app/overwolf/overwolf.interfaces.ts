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
    isVisible: true;
    Parent: null;
}

export interface Update {
    feature: string;
    info: any;
}

export interface GameModeInfo {
    gameMode: string;
}

export interface MatchState {
  summonerId: number;
  region: string;
  matchActive: boolean;
}
