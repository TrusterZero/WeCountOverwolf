import {SocketService} from '../socket/socket.service';
import {BehaviorSubject, interval, Subject} from 'rxjs';
import {
  Feature,
  Hotkey,
  MatchState,
  NewEvent, OverwolfKeyEvent,
  OverwolfWindow, ShowWindowHotkey,
  Status,
  Update,
  WindowResult
} from './overwolf.interfaces';
import {CreationRequest, SocketEvents} from '../socket/socket.interface';
import {HostListener} from "@angular/core";
import {current} from "../../../node_modules/codelyzer/util/syntaxKind";


declare const overwolf; // Overwolf uses a build in js file

const overwolfEvents = overwolf.games.events;
const VISIBLE_WINDOW_TIME = 3000;
const CTRL_KEYCODE = '162';
const SPACE_KEYCODE = '32';

// todo any's bestaan niet
export class OverwolfService {

  initialShowWindowState: ShowWindowHotkey = {
    ctrlPressed: false,
    spacePressed: false
  }
  initialMatchState: MatchState = {
    matchActive: false,
    region: null,
    summonerId: null
  };

  showWindowHotkeyState$: BehaviorSubject<ShowWindowHotkey> = new BehaviorSubject<ShowWindowHotkey>(this.initialShowWindowState);
  mainWindow: OverwolfWindow;
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
    this.showWindowHotkeyState$.subscribe((hotKeyState: ShowWindowHotkey) => this.toggleWindow(hotKeyState));
  }

  private setWindow() {
    overwolf.windows.getCurrentWindow((result: WindowResult) => {
      this.setMainWindow(result.window);
    });
  }

  private handleOverwolfEvents() {
    overwolfEvents.getInfo((info: any) => this.updateInfo(info));
    overwolfEvents.onInfoUpdates2.addListener((info: any) => this.updateInfo(info));
    overwolfEvents.onNewEvents.addListener(() => this.handleNewEvents);
    overwolf.games.inputTracking.onKeyDown.addListener((event) => this.handleKeyDown(event));
    overwolf.games.inputTracking.onKeyUp.addListener((event) => this.handleKeyUp(event));
  }

  private toggleWindow(hotKeyState: ShowWindowHotkey) {
    if (hotKeyState.ctrlPressed && hotKeyState.spacePressed) {
      this.showWindow();
    }else {
      if (this.mainWindow) {
        this.hideWindow();
      }
    }
  }

  private setMainWindow(window: OverwolfWindow) {

    if (!window) {
      return;
    }

    this.mainWindow = window;
    console.log(this.mainWindow);
  }

  private updateInfo(info: any) {
      console.log(info);
      const result: Update = this.validateResult(info);

      if ( !result) {
        return;
      }
      const matchState: MatchState = {
        summonerId: result.summoner_info.id,
        region: result.summoner_info.region,
        matchActive: result.game_info.matchStarted
      };
      console.log(matchState);
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
    console.log('match ended')
    const matchState = this.matchState$.getValue();
    matchState.matchActive = false;
    // TODO ask socketServer to Disconnect from the gameRoom
    this.matchState$.next(matchState);
  }

  private handleKeyDown(event: OverwolfKeyEvent) {
    this.updateShowWindowHotkeyState(true, event);
  }

  private handleKeyUp(event: OverwolfKeyEvent) {
    this.updateShowWindowHotkeyState(false, event);
  }

  private updateShowWindowHotkeyState(isPressed, event) {
    const newState = this.showWindowHotkeyState$.getValue();
    if (event.key === CTRL_KEYCODE) {
      newState.ctrlPressed = isPressed;
      this.showWindowHotkeyState$.next(newState);
    } else if (event.key === SPACE_KEYCODE) {
      newState.spacePressed = isPressed;
      this.showWindowHotkeyState$.next(newState);
    }
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
    overwolf.windows.hide(this.mainWindow.id, () => {});
  }

  /**
   *
   * Shows the main window and hides it after 2 seconds using hideWindow method
   * @param arg
   */
  private showWindow(): void {
      overwolf.windows.restore(this.mainWindow.id, () => {});
    }

  private validateResult(info: any): Update {
    const result = this.checkEventSource(info);

    if (!result) {
      return;
    }

    if (!this.hasSummonerInfo(result) || !this.hasGameInfo(result)) {
      return null;
    }
    return result as Update;
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
  private hasGameInfo(result: any): boolean {

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
