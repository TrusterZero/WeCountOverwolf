import {SocketService} from '../socket/socket.service';
import {BehaviorSubject, interval, Subject} from 'rxjs';
import {
  Feature,
  Hotkey,
  MatchState, NewEvent,
  NewEventName, NewEventResultSet, OverwolfKeyEvent,
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
  ];

  constructor(private socketService: SocketService) {
    this.setFeatures();
    this.setWindow();
    this.handleOverwolfEvents();
    this.matchState$.subscribe((matchState: MatchState) => this.checkMatchState(matchState));
    this.showWindowHotkeyState$.subscribe((hotKeyState: ShowWindowHotkey) => this.toggleWindow(hotKeyState));
  }

  private setWindow(): void {
    overwolf.windows.getCurrentWindow((result: WindowResult) => {
      this.setMainWindow(result.window);
    });
  }

  private handleOverwolfEvents(): void {
    overwolfEvents.getInfo((info: any) => this.updateInfo(info));
    overwolfEvents.onInfoUpdates2.addListener((info: any) => this.updateInfo(info));
    overwolfEvents.onNewEvents.addListener((resultSet: NewEventResultSet) => this.handleNewEvents(resultSet.events));
    overwolf.games.inputTracking.onKeyDown.addListener((event: OverwolfKeyEvent) => this.handleKeyDown(event));
    overwolf.games.inputTracking.onKeyUp.addListener((event: OverwolfKeyEvent) => this.handleKeyUp(event));
  }

  private setMainWindow(window: OverwolfWindow): void {

    if (!window) {
      return;
    }

    this.mainWindow = window;
  }

  private toggleWindow(hotKeyState: ShowWindowHotkey): void {
    if (hotKeyState.ctrlPressed && hotKeyState.spacePressed) {
      this.showWindow();
    }else {
      if (this.mainWindow) {
        this.hideWindow();
      }
    }
  }

  private updateInfo(info: any): void {
      const result: Update = this.checkEventSource(info);

      if ( !result) {
        return;
      }

      const currentMatchState: MatchState = this.matchState$.getValue();

      if (this.hasSummonerId(result)) {
        currentMatchState.summonerId = result.summoner_info.id;
      }
      if (this.hasSummonerRegion(result)) {
        currentMatchState.region = result.summoner_info.region;
      }
      if (this.hasMatchInfo(result)) {
        currentMatchState.matchActive = result.game_info.matchStarted;
      }
      this.matchState$.next(currentMatchState);
  }

  private handleNewEvents(events: NewEvent[]): void {
    for (const event of events) {
      switch (event.name) {
        case NewEventName.matchEnd:
          this.endMatch();
          break;
      }
    }
  }

  private checkMatchState(matchState: MatchState): void {
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
  private startMatch(matchState: MatchState): void {

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
    const currentMatchState = this.matchState$.getValue();
    currentMatchState.matchActive = false;
    // TODO ask socketServer to Disconnect from the gameRoom
    this.matchState$.next(currentMatchState);
  }

  private handleKeyDown(event: OverwolfKeyEvent): void {
    this.updateShowWindowHotkeyState(true, event);
  }

  private handleKeyUp(event: OverwolfKeyEvent): void {
    this.updateShowWindowHotkeyState(false, event);
  }

  private updateShowWindowHotkeyState(isPressed: boolean, event: OverwolfKeyEvent): void {
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
  private hideWindow(): void {
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

  /**
   *
   * Check if the info was send from InfoUpdates2 or GetInfo functions
   *
   * @param info
   */
  private checkEventSource(info: any): Update {
    if (this.fromInfoUpdates(info)) {
      return info.info;
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
  private fromInfoUpdates(info: any): boolean {
    // TODO ASK dit is geen goeie check enige wat vast staat is dat info updates geen res heeft
    if (info.feature) {
      return true;
    }
  }

  /**
   *
   * Check if info was send from GetInfo
   *
   * @param info
   */
  private fromGetInfo(info: any): boolean  {

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
  private hasMatchInfo(result: Update): boolean {

    if (result.game_info && result.game_info.matchStarted) {
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
  private hasSummonerInfo(result: Update): boolean {

    if (result.summoner_info) {
      return true;
    }
    return false;

  }

  private hasSummonerId(result: Update): boolean {
    if (this.hasSummonerInfo(result)) {
      if (result.summoner_info.id) {
        return true;
      }
    }
  }

  private hasSummonerRegion(result: Update): boolean {
    if (this.hasSummonerInfo(result)) {
      if (result.summoner_info.region) {
        return true;
      }
    }
  }
}
