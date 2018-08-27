import { Injectable } from '@angular/core';
import { Match } from './match.component';
import { SocketService } from '../socket/socket.service';
import { Subject } from 'rxjs';
import {SocketEvents} from '../socket/socket.interface';
import {OverwolfService} from '../overwolf/overwolf.service';
import {MatchState} from '../overwolf/overwolf.interfaces';


@Injectable()
export class MatchService {

    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService, private overwolf: OverwolfService) {
      socketService.listen( SocketEvents.matchCreated, ( match: Match ) => {
        this.matchData.next( match );
      });

      overwolf.matchState$.subscribe(( matchState: MatchState ) => {
        console.log(matchState)
        if ( !matchState.matchActive ) {
          this.matchData.next();
        }
      });
    }
}
