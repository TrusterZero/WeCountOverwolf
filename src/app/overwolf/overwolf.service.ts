import {SocketService} from '../socket/socket.service';
import {BehaviorSubject} from 'rxjs';
import {
  Feature,
  MatchState, NewEvent,
  NewEventName, NewEventResultSet, OverwolfKeyEvent,
  OverwolfWindow, ShowWindowHotkey,
  Status,
  Update,
  WindowResult
} from './overwolf.interfaces';
import {CreationRequest, SocketEvents} from '../socket/socket.interface';

declare const overwolf; // Overwolf uses a build in js file

const overwolfEvents = overwolf.games.events;
const CTRL_KEYCODE = '162';
const SPACE_KEYCODE = '32';

// todo any's bestaan niet
export class OverwolfService {

  initialShowWindowState: ShowWindowHotkey = {
    ctrlPressed: false,
    spacePressed: false
  };
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
    this.showWindowHotkeyState$.subscribe((hotKeyState: ShowWindowHotkey) => this.toggleWindow(hotKeyState));
  }

  private setWindow(): void {
    overwolf.windows.getCurrentWindow((result: WindowResult) => {
      this.setMainWindow(result.window);
      this.showWindow();
    });
  }

  private handleOverwolfEvents(): void {
    overwolfEvents.getInfo((info: any) => this.updateInfo(info));
    overwolfEvents.onInfoUpdates2.addListener((info: any) => this.updateInfo(info));
    overwolfEvents.onNewEvents.addListener((resultSet: NewEventResultSet) => this.handleNewEvents(resultSet.events));
  }

  public clearHotkeyListeners(): void {
    console.log('hotkey cleared');
    overwolf.games.inputTracking.onKeyDown.removeListener(() => this.handleKeyDown);
    overwolf.games.inputTracking.onKeyUp.removeListener(() => this.handleKeyUp);
  }

  public setHotkeyListeners(): void {
    console.log('hotkey set');
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

      this.matchState$.next(
        this.editMatchState(this.matchState$.getValue(), result));
  }

  private editMatchState(matchState: MatchState, result: Update): MatchState {
    if (this.hasSummonerId(result)) {
      matchState.summonerId = result.summoner_info.id;
    }
    if (this.hasSummonerRegion(result)) {
      matchState.region = result.summoner_info.region;
    }
    if (this.hasMatchInfo(result)) {
      matchState.matchActive = result.game_info.matchStarted;
    }

    return matchState;
  }

  private handleNewEvents(events: NewEvent[]): void {
    for (const event of events) {
      switch (event.name) {
        case NewEventName.matchEnd:
          const newMatchState: MatchState = this.matchState$.getValue();
          newMatchState.matchActive = false;
          this.matchState$.next(newMatchState);
          break;
      }
    }
  }

  private handleKeyDown(event: OverwolfKeyEvent): void {
    this.updateShowWindowHotkeyState(true, event);
  }

  private handleKeyUp(event: OverwolfKeyEvent): void {
    this.updateShowWindowHotkeyState(false, event);
  }

  /**
   *
   * @param isPressed: If button is pressed or released
   * @param event
   */
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
  public hideWindow(): void {
    overwolf.windows.hide(this.mainWindow.id, () => {});
  }

  /**
   *
   * Shows the main window and hides it after 2 seconds using hideWindow method
   * @param arg
   */
  public showWindow(): void {
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
   * Check if data contains summoner info
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
