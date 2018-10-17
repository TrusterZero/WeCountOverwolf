import {Injectable} from '@angular/core';
import {
  CurrentWindowStates,
  Feature,
  GameInfoChangeData,
  MatchState,
  NewEvent,
  NewEventName,
  NewEventResultSet,
  OverwolfWindow,
  Status,
  Update,
  WindowMessageId,
  WindowName,
  WindowResult,
  WindowState,
  WindowUpdate
} from './overwolf.interfaces';
import {BehaviorSubject, interval, Subject, timer} from 'rxjs';

import {takeUntil} from 'rxjs/operators';


declare const overwolf; // Overwolf uses a build in js file

const LOL_GAME_ID = 54261;
const overwolfEvents = overwolf.games.events;
const windows = overwolf.windows;


@Injectable({
  providedIn: 'root'
})
export class WindowService {

  initialWindowStates: CurrentWindowStates = {
    inGame: WindowState.closed,
    desktop: WindowState.closed
  };

  initialMatchState: MatchState = {
    matchActive: false,
    summonerName: null,
    region: null,
    summonerId: null
  };

  inGameWindow: OverwolfWindow;
  desktopWindow: OverwolfWindow;
  controller: OverwolfWindow;
  featuresSet = false;
  stopRequestingFeatures$: Subject<void> = new Subject<void>();
  windowStates$: BehaviorSubject<CurrentWindowStates> = new BehaviorSubject<CurrentWindowStates>(this.initialWindowStates);
  matchState$: BehaviorSubject<MatchState> = new BehaviorSubject<MatchState>(this.initialMatchState);

  constructor() {

    windows.onMainWindowRestored.addListener(() => this.onReopening());
    this.setWindows();
    this.watchGameLaunch();
    this.listenWindowState();
    this.handleOverwolfEvents();
    this.matchState$.subscribe((matchState: MatchState) => {
      if (matchState.matchActive) {
        this.setInGameWindow(() => this.restoreWindow(this.inGameWindow, () => {
          timer(8000).subscribe(() => this.sendMatchState(matchState));
        }));
      }
    });
  }

  private usingFeatures: Feature[] = [
    Feature.matchState,
    Feature.summonerInfo,
    Feature.gameMode
  ];

  private onReopening() {
    const currentMatchState = this.matchState$.getValue();
    const currentWindowStates = this.windowStates$.getValue();

    if (currentMatchState.matchActive && currentWindowStates.inGame === WindowState.closed) {
      this.restoreWindow(this.inGameWindow, () => {
        timer(8000).subscribe(() => this.sendMatchState(currentMatchState));
      });
    } else if (!currentMatchState.matchActive && currentWindowStates.desktop) {
      this.restoreWindow(this.desktopWindow);
    }
  }

  private handleOverwolfEvents(): void {
    overwolfEvents.getInfo((info: any) => {
      this.updateInfo(info);
      // if there is no game running open the desktop window
      if (!this.checkEventSource(info)) {
        this.restoreWindow(this.desktopWindow);
      }
    });
    overwolfEvents.onInfoUpdates2.addListener((info: any) => this.updateInfo(info));
    overwolfEvents.onNewEvents.addListener((resultSet: NewEventResultSet) => this.handleNewEvents(resultSet.events));
  }

  private setWindows(): void {
    this.setDesktopWindow();
    this.setControllerWindow();
    this.windowStates$.subscribe((currentWindowStates: CurrentWindowStates) => {
      console.log(currentWindowStates);
      if (currentWindowStates.inGame === WindowState.closed && currentWindowStates.desktop === WindowState.closed) {
        this.closeWindow(this.controller);
      }
    });
  }

  listenWindowState() {
    windows.onStateChanged.addListener((state: WindowUpdate) => {
      const currentWindowStates = this.windowStates$.getValue();
      if (this.inGameWindow && state.window_id === this.inGameWindow.id) {
        currentWindowStates.inGame = state.window_state;
        this.windowStates$.next(currentWindowStates);
      } else if (state.window_id === this.desktopWindow.id) {
        if (state.window_id === this.desktopWindow.id) {
          currentWindowStates.desktop = state.window_state;
          this.windowStates$.next(currentWindowStates);
        }
      }
    });
  }


  /**
   *
   * Set the event types we react to
   *
   */
  private setFeatures(): void {
    overwolfEvents.setRequiredFeatures(this.usingFeatures, (info) => {
      if (info.status === Status.error) {
        console.log(info.reason);
        return;
      } else {
        this.featuresSet = true;
        this.stopRequestingFeatures$.next();
      }
    });
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

  private updateInfo(info: any): void {
    const result: Update = this.checkEventSource(info);

    if (!result) {
      return;
    }
    console.log('info passed test');
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
   * Check if info was send from GetInfo
   *
   * @param info
   */
  private fromGetInfo(info: any): boolean {

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

  private setControllerWindow(): void {
    windows.obtainDeclaredWindow(WindowName.controller, (result: WindowResult) => {
      result.window ? this.controller = result.window : null;
    });
  }

  private setDesktopWindow(): void {
    windows.obtainDeclaredWindow(WindowName.desktopWindow, (result: WindowResult) => {
      result.window ? this.desktopWindow = result.window : null;
      this.desktopWindow.isRestored = new BehaviorSubject<boolean>(false);
    });
  }

  private setInGameWindow(callback?: () => void): void {
    windows.obtainDeclaredWindow(WindowName.inGameWindow, (result: WindowResult) => {
      result.window ? this.inGameWindow = result.window : null;
      windows.changePosition(this.inGameWindow.id, 0, 443);
      if (callback) {
        callback();
      }
    });
  }

  public restoreWindow(window: OverwolfWindow, callback?: () => void): void {
    if (!callback) {
      callback = () => {
      };
    }
    // @ts-ignore
    windows.restore(window.id, (reply) => callback(reply));
  }

  private closeWindow(window: OverwolfWindow) {
    if (window) {
      windows.close(window.id);
    }
  }

  private sendMatchState(matchState: MatchState): void {
    this.sendWindowMessage(this.inGameWindow, WindowMessageId.matchState, matchState, (reply) => {
      console.log(reply);
    });
  }

  private sendWindowMessage(window: OverwolfWindow, messageId: WindowMessageId, messageContent: any, callback: (reply) => void) {
    windows.sendMessage(window.id, messageId, messageContent, (reply) => callback(reply));
  }

  private watchGameLaunch() {
    overwolf.games.getRunningGameInfo((gameInfo: GameInfoChangeData) => {
      if (this.leagueIsRunning(gameInfo)) {
        this.setFeatures();
      }
    });
    overwolf.games.onGameInfoUpdated.addListener((gameInfoChangeData: GameInfoChangeData) => {
      const isRunning = this.leagueIsRunning(gameInfoChangeData);

      if (isRunning && !this.featuresSet) {
        interval(3000)
          .pipe(takeUntil(this.stopRequestingFeatures$))
          .subscribe(() => this.setFeatures());
      } else if (!isRunning) {
        this.featuresSet = false;
        this.stopRequestingFeatures$.next();
        this.closeWindow(this.inGameWindow);
      }
    });
  }

  private leagueIsRunning(gameInfoChangeData: GameInfoChangeData): boolean {
    if (gameInfoChangeData.gameInfo === null) {
      return false;
    }
    return gameInfoChangeData.gameInfo.id === LOL_GAME_ID && gameInfoChangeData.gameInfo.isRunning;
  }
}
