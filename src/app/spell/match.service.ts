import { Injectable, EventEmitter } from "@angular/core";
import { Match } from "../match/match.component";
import { SocketService } from "../socket.service";
import { Observable, Subject, BehaviorSubject } from "rxjs";


@Injectable()
export class MatchService {
    private match: Match;
    matchData: Subject<Match> = new BehaviorSubject<Match>(this.match);

    constructor(private socketService: SocketService) {
        // TODO: doesn't check if connection exists yet
        // TODO: doesn't provide a way to check if connected yet
        socketService.connect()
            .subscribe(this.initializeMatch);

        socketService.message('match', { test: 'test' });

        socketService.listen('matchReturn', (match: Match) => {
            console.log(match)
            this.matchData.next(match)
        })
    }

    private initializeMatch() {

    }

}
