import { SocketService } from '../socket.service';
import { BehaviorSubject } from 'rxjs';
import {Features, MatchState, Update} from './overwolf.interfaces';
import {SocketEvents, CreationRequest} from '../socket.interface';
declare const overwolf; // Overwolf uses a build in js file


const requiredFeatures: string[] = Object.keys(Features)
                                      .map(feature => Features[feature]); // type of events we listen to
const overwolfEvents = overwolf.games.events;

export class OverwolfService {

    summonerId: string;
    socketService: SocketService = new SocketService();
    matchStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

    this.setFeatures();

    this.matchStarted
      .subscribe((isStarted: boolean) => {

        if (isStarted) {
          this.gameStart(Number(this.summonerId));
        }
      });

      // Check if match is already started
      overwolfEvents.getInfo( (info) => {

        this.summonerId = info.res.summoner_info.id;
        const matchState: MatchState = {
          matchStarted: info.res.game_info.matchStarted,
          matchOutcome: ''
        };

        this.setMatchState(matchState);
      });


    overwolfEvents.onInfoUpdates2
      .addListener( (infoUpdateChange: Update) => {

        if (!this.summonerId) {
            this.updateSummoner();
        }

        if (infoUpdateChange.feature === Features.matchState) {
          this.setMatchState(infoUpdateChange.info['game_info'] as MatchState);
        }
      });

  }

  /**
   *
   *  Starts the game by asking the server for the match data
   *
   * @param summonerId
   */
  private gameStart(summonerId: number): void {
        this.socketService.message(SocketEvents.createMatch, { summonerId: summonerId } as CreationRequest);
        console.log('request send');
  }

  /**
   *
   * Set the event types we react to
   *
   *
   */
  private setFeatures(): void {

      overwolfEvents.setRequiredFeatures(requiredFeatures, (info) => {
          if (info.status === 'error') {
              // check info.status possible values
              console.log(info.reason);
              return;
          }
      });
  }

  /**
   *
   * Switches state between in and out of game
   *
   * @param matchState
   */
  private setMatchState(matchState: MatchState): void {

      this.matchStarted.next(matchState.matchStarted === 'true');
  }

  /**
   *
   * Sets the summoner Id with this Id we find the Match the player is in
   *
   */
  private updateSummoner(): void {
    overwolfEvents.getInfo((info) => {
      if (info) {
        this.summonerId = info.res.summoner_info.id;
      }
    });
  }

}
