import { SocketService } from "./socket.service";

declare const overwolf;
const requiredFeatures: string[] = ['matchState', 'summoner_info', 'gameMode'];

interface information {
    data: Object;
}

interface infoUpdate {
    feature: string;
    info: information;
}

export class OverwolfService {

    socketService: SocketService = new SocketService()

    constructor() {

        this.setFeatures();

        overwolf.games.events.onInfoUpdates2.addListener((infoUpdateChange) => {
            console.log(infoUpdateChange);
            switch(infoUpdateChange.feature) {
                case "summoner_info": console.log(infoUpdateChange.summoner_info)
            }
        })

        //test for connection
        overwolf.profile.getCurrentUser((user) => {
            console.log(user.userId);
        })
    }

    gameStart(summonerId: string) {
        this.socketService.message('match', { summonerId: summonerId });
    }

    setFeatures() {
        overwolf.games.events.setRequiredFeatures(requiredFeatures, (info) => {
            if(info.status === 'error') {
                //check info.status possible values
                console.log(info.reason);
                return;
            }
            console.log(JSON.stringify(info));
        })
    }

}