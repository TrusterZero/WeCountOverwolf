import { Injectable } from "../../../node_modules/@angular/core";
import { Match } from "./match.component";
import { SocketService } from "../socket.service";
import { Subject } from "../../../node_modules/rxjs";


@Injectable()
export class MatchService {
    
    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService) {
        // TODO: doesn't check if connection exists yet
        // TODO: doesn't provide a way to check if connected yet

        socketService.connect()
            .subscribe(() => this.initializeMatch);
    }

  /**
   * TODO: feedme en damn wat zijn die enums toch lekker
   */
  private initializeMatch() {
    this.socketService.message('match', { test: 'test' });

    this.socketService.listen('matchReturn', (match: Match) => {
      this.matchData.next(match);
    });
  }
}
