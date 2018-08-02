import { SocketService } from "../socket.service";
import { BehaviorSubject } from "rxjs";

declare const overwolf; //Overwolf uses a build in js file



const requiredFeatures: string[] = Object.keys(Features).map(feature => Features[feature]) //type of events we listen to
const overwolfEvents = overwolf.games.events;



export class OverwolfService {

    socketService: SocketService = new SocketService()
    matchStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {

        this.setFeatures();
        console.log(requiredFeatures)
        overwolfEvents.onInfoUpdates2.addListener((infoUpdateChange: Update) => {
            
            overwolfEvents.getInfo((info) => {
                //console.log(info)
            })
            switch(infoUpdateChange.feature) {
                case "summoner_info": this.updateSummoner(infoUpdateChange.info[Features.summonerInfo] as SummonerInfo), "from switch"
                case "matchState": this.setMatchState(infoUpdateChange.info[Features.matchState] as MatchState)
            }
        })

        this.matchStarted.subscribe((isStarted) => {
            if(isStarted){
                console.log("match started =", isStarted)
                this.gameStart("")
            }
        })
    }

    gameStart(summonerId: string) {
        this.socketService.message('match', { summonerId: summonerId });
    }

    setFeatures() {
        overwolfEvents.setRequiredFeatures(requiredFeatures, (info) => {
            if(info.status === 'error') {
                //check info.status possible values
                console.log(info.reason);
                return;
            }   
        })
    }

    setMatchState(matchState: MatchState){
        this.matchStarted.next(matchState.matchStarted === "True")
    }

    updateSummoner(summoner: SummonerInfo) {

    }

}