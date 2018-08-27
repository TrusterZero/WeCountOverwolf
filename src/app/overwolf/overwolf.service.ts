import {SocketService} from '../socket/socket.service';
import {BehaviorSubject, interval, Subject} from 'rxjs';
import {Feature, WindowResult, OverwolfWindow, MatchState, NewEvent, Status, Hotkey} from './overwolf.interfaces';
import {CreationRequest, SocketEvents} from '../socket/socket.interface';

declare const overwolf; // Overwolf uses a build in js file

const overwolfEvents = overwolf.games.events;

// todo any's bestaan niet
export class OverwolfService {

  mainWindow: OverwolfWindow;
  initialMatchState: MatchState = {
    matchActive: false,
    region: null,
    summonerId: null
  };
  matchState$: BehaviorSubject<MatchState> = new BehaviorSubject<MatchState>(this.initialMatchState);

  private usingFeatures: Feature[] = [
    Feature.matchState,
    Feature.summonerInfo,
    Feature.gameMode
  ];

  constructor(private socketService: SocketService) {
    //  todo: aparte functie voor listeners
    this.setFeatures();
    this.setWindow();
    this.handleOverwolfEvents();
    this.matchState$.subscribe((matchState: MatchState) => this.checkMatchState(matchState));
  }

  private setWindow() {

    overwolf.windows.getCurrentWindow((result: WindowResult) => {
      this.setMainWindow(result.window);
    });
  }

  private handleOverwolfEvents() {
    this.checkEventSource('x');
    overwolfEvents.getInfo(() => this.updateInfo);
    overwolfEvents.onInfoUpdates2.addListener(() => this.updateInfo);
    overwolfEvents.onNewEvents.addListener(() => this.handleNewEvents);
    overwolf.settings.registerHotKey(Hotkey.showWindow, (args) => this.handleHotKey(args));

  }

  private setMainWindow(window: OverwolfWindow) {

    if (!window) {
      return;
    }

    this.mainWindow = window;
  }

  private updateInfo(info: any) {

      const result = this.checkEventSource(info);
      // validating result
      if (!this.hasSummonerInfo(result) || !this.hasGameInfo(result)) {
        return;
      }

      const matchState: MatchState = {
        summonerId: result.summoner_info.id,
        region: result.summoner_info.region,
        matchActive: result.game_info.matchStarted
      };

      this.matchState$.next(matchState);
  }

  private handleNewEvents(events: NewEvent[]) {

    for (const event of events) {
      switch (event) {
        case NewEvent.matchEnd:
          this.endMatch();
          break;
      }
    }
  }

  private checkMatchState(matchState: MatchState) {

    if (matchState.matchActive) {
      this.startMatch(matchState);
    }
  }

  /**
   *
   *  Ask the server to start a match
   *
   * @param region: Region player is in
   * @param summonerId
   */
  private startMatch(matchState: MatchState) {

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
  private endMatch() {
    const matchState = this.matchState$.getValue();
    matchState.matchActive = false;
    // TODO ask socketServer to Disconnect from the gameRoom
    this.matchState$.next(matchState);
  }

  private handleHotKey(args) {

    this.showWindow(args);
    // todo in showWindow een Subject voor hideWindow met een delay van 2000 die je next
    // todo ASK: ik heb denk gedaan wat je wou maar ik weet niet waarom
  }

  /**
   *
   * Set the event types we react to
   *
   */
  private setFeatures(): void {
    // TODO: ff sparren!
    overwolfEvents.setRequiredFeatures(this.usingFeatures, (info) => {
      if (info.status === Status.error) {
        // check info.status possible values
        console.log(info.reason);
        return;
      }
    });
  }

  /**
   *
   * Hides the main window
   */
  private hideWindow() {

    overwolf.windows.hide(this.mainWindow.id, () => {
    });
  }

  /**
   *
   * Shows the main window and hides it after 2 seconds using hideWindow method
   * @param arg
   */
  private showWindow(arg): void {

    const hideWindow$: Subject<void> = new Subject<void>();

    hideWindow$.subscribe(() => {
      interval(2000)
        .subscribe(() => this.hideWindow());
    });

    if (arg.status === Status.success) {
      overwolf.windows.restore(this.mainWindow.id, () => {
        hideWindow$.next();
      });
    }
  }

  /**
   *
   * Check if the info was send from InfoUpdates2 or GetInfo functions
   *
   * @param info
   */
  private checkEventSource(info: any) {

    if (this.fromInfoUpdates(info)) {
      return info;
    } else if (this.fromGetInfo(info)) {
      return info.res;
    } else {
      return null;
    }
  }

  /**
   *
   *  Check if info was send from InfoUpdates2
   *
   * @param info
   */
  private fromInfoUpdates(info: any) {
    // TODO ASK dit is geen goeie check enige wat vast staat is dat info updates geen res heeft
    if (info.res) {
      return false;
    }
  }

  /**
   *
   * Check if info was send from GetInfo
   *
   * @param info
   */
  private fromGetInfo(info: any) {

    if (info.res) {
      return true;
    }
  }

  /**
   *
   * Check if data contains game info
   *
   * @param result
   */
  private hasGameInfo(result): boolean {

    if (result.game_info || result.game_info.matchStarted) {
      return true;
    }
    return false;

  }

  /**
   *
   * Check if datam contains summoner info
   *
   * @param result
   */
  private hasSummonerInfo(result: any): boolean {

    if (result.summoner_info && result.summoner_info.id) {
      return true;
    }
    return false;

  }
}
