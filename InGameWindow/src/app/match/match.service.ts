import {Injectable} from '@angular/core';
import {Match} from './match.component';
import {SocketService} from '../socket/socket.service';
import {Subject} from 'rxjs';
import {CreationRequest, ErrorCode, SocketEvent} from '../socket/socket.interface';
import {OverwolfService} from '../overwolf/overwolf.service';
import {MatchState} from '../overwolf/overwolf.interfaces';
import {MessageService} from '../message/message.service';


@Injectable()
export class MatchService {

    matchData: Subject<Match> = new Subject<Match>();

    constructor(private socketService: SocketService,
                private overwolf: OverwolfService,
                private messageService: MessageService) {

      socketService.listen( SocketEvent.matchCreated, (match: Match ) => {
        messageService.stopLoading();

        this.matchData.next( match );
      });

      overwolf.matchState$.subscribe(( matchState: MatchState ) => {
        console.log(matchState)
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
  public startMatch(matchState: MatchState): void {
    this.messageService.startLoading();
    this.overwolf.showWindow(this.overwolf.inGameWindow);
    console.log(matchState);
    this.socketService.send(SocketEvent.createMatch, {
      summonerName: '',
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
