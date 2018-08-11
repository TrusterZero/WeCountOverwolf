import { Injectable } from '@angular/core';
import { Match } from './match.component';
import { SocketService } from '../socket.service';
import { Subject } from 'rxjs';


@Injectable()
export class MatchService {
    // Kan heel deze service niet weg ???????
    // de match component kan ook direct gekoppelc worden aan de socket service

    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService) {

      socketService.connectedMatch
          .subscribe((match: Match) => {
              this.matchData.next(match);
          });
    }
}
