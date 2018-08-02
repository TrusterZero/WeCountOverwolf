enum Features {

    matchState = 'matchState',
    summonerInfo = 'summoner_info',
    gameMode = 'gameMode'
}

interface Update {

    feature: string;
    info: Object;
}

interface SummonerInfo {

    id: string;
    region: string;
    name: string;
    champion: string;
}

interface GameModeInfo {

    gameMode: string;
}

interface MatchState {

    matchStarted: string;
    matchOutcome: string;
}