import { Injectable, EventEmitter } from "../../../node_modules/@angular/core";
import { Match } from "./match.component";
import { SocketService } from "../socket.service";
import { Observable, Subject, BehaviorSubject } from "../../../node_modules/rxjs";


@Injectable()
export class MatchService {

    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService) {
        // TODO: doesn't check if connection exists yet
        // TODO: doesn't provide a way to check if connected yet
        socketService.connect()
            .subscribe(this.initializeMatch);

        socketService.message('match', { test: 'test' });

        socketService.listen('matchReturn', (match: Match) => {
            this.matchData.next(match);
        });
    }

    private initializeMatch() {

    }

}
