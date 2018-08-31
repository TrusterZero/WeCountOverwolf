import { Injectable } from '@angular/core';
import { Match } from './match.component';
import { SocketService } from '../socket/socket.service';
import { Subject } from 'rxjs';
import {CreationRequest, SocketEvents} from '../socket/socket.interface';
import {OverwolfService} from '../overwolf/overwolf.service';
import {MatchState} from '../overwolf/overwolf.interfaces';


@Injectable()
export class MatchService {

    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService, private overwolf: OverwolfService) {
      socketService.listen( SocketEvents.matchCreated, ( match: Match ) => {
        console.log('serverdata', match);
        this.matchData.next( match );
      });
      // Deze 2 combineren in 1 observable ???
      overwolf.matchState$.subscribe(( matchState: MatchState ) => {
        console.log('match state changed', matchState);
        if (matchState.matchActive) {
          this.startMatch(matchState);
        } else {
          this.endMatch();
        }
      });
    }

  /**
   *
   *  Ask the server to start a match
   *
   * @param region: Region player is in
   * @param summonerId
   */
  private startMatch(matchState: MatchState): void {
    this.overwolf.showWindow();
    this.socketService.message(SocketEvents.createMatch, {
      summonerId: matchState.summonerId,
      region: matchState.region
    } as CreationRequest);
  }

  /**
   *
   *  Ends the match and requests server to disconnect from the gameroom
   *
   */
  private endMatch(): void {
    this.matchData.next();
    // TODO ask socketServer to Disconnect from the gameRoom
  }
}
