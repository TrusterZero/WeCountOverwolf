export enum Features {

    matchState = 'matchState',
    summonerInfo = 'summoner_info',
    gameMode = 'gameMode'
}

export interface Update {

    feature: string;
    info: Object;
}

export interface SummonerInfo {

    id: string;
    region: string;
    name: string;
    champion: string;
}

export interface GameModeInfo {

    gameMode: string;
}

export interface MatchState {

    matchStarted: string;
    matchOutcome: string;
}
