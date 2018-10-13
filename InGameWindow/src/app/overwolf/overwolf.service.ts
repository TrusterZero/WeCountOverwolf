import {SocketService} from '../socket/socket.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {
  Feature,
  MatchState, NewEvent,
  NewEventName, NewEventResultSet, OverwolfKeyEvent,
  OverwolfWindow, ShowWindowHotkey,
  Status,
  Update, WindowMessage, WindowMessageType, WindowName,
  WindowResult
} from './overwolf.interfaces';


declare const overwolf; // Overwolf uses a build in js file

const windows = overwolf.windows;
const CTRL_KEYCODE = '162';
const SPACE_KEYCODE = '32';

export class OverwolfService {
  activateHotkeys = false;

  initialMatchState: MatchState = {
    matchActive: false,
    summonerName: null,
    region: null,
    summonerId: null
  };
  matchState$: BehaviorSubject<MatchState> = new BehaviorSubject<MatchState>(this.initialMatchState);


  ctrlPressed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  shitPressed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showWindowHotkeyState$ = combineLatest(this.ctrlPressed$, this.shitPressed$);
  inGameWindow: OverwolfWindow;

  constructor() {
    this.listenToMessages();
    this.setHotkeyListeners();
    this.setInGameWindow();
    this.showWindowHotkeyState$.subscribe((result) => this.toggleWindow(result));
  }

  closeThisWindow() {
    this.closeWindow(this.inGameWindow);
  }


  private listenToMessages(): void {
    windows.onMessageReceived.addListener((windowMessage: WindowMessage) => {
      console.log('message received');
        this.matchState$.next(windowMessage.content);
    });
  }

  private setInGameWindow(): void {
    windows.obtainDeclaredWindow(WindowName.inGameWindow, (result: WindowResult) => {
      result.window ? this.inGameWindow = result.window : null;
      windows.changePosition(this.inGameWindow.id, 0, 443);
      this.showWindow(this.inGameWindow);
    });
  }

  public dragMove(window: OverwolfWindow) {
    windows.dragMove(window.id, (status) => {
      console.log(status);
    });

  }

  public setHotkeyListeners(): void {
    overwolf.games.inputTracking.onKeyDown.addListener((event: OverwolfKeyEvent) => this.handleKeyDown(event));
    overwolf.games.inputTracking.onKeyUp.addListener((event: OverwolfKeyEvent) => this.handleKeyUp(event));
  }

  private toggleWindow(result: boolean[]): void {
    if (result[0] && result[1]) {
      this.showWindow(this.inGameWindow);
    } else {
      if (this.inGameWindow) {
        this.hideWindow(this.inGameWindow);
      }
    }
  }

  private handleKeyDown(event: OverwolfKeyEvent): void {
    if (this.activateHotkeys) {
      this.updateShowWindowHotkeyState(true, event);
    }
  }

  private handleKeyUp(event: OverwolfKeyEvent): void {
    if (this.activateHotkeys) {
      this.updateShowWindowHotkeyState(false, event);
    }
  }

  /**
   *
   * @param isPressed: If button is pressed or released
   * @param event
   */
  private updateShowWindowHotkeyState(isPressed: boolean, event: OverwolfKeyEvent): void {
    if (event.key === CTRL_KEYCODE) {
      this.ctrlPressed$.next(isPressed);
    } else if (event.key === SPACE_KEYCODE) {
      this.shitPressed$.next(isPressed);
    }
  }



  public hideWindow(window: OverwolfWindow): void {
    windows.hide(window.id, () => {
    });
  }

  private closeWindow(window: OverwolfWindow) {
    if (window) {
      windows.close(window.id);
    }
  }

  public showWindow(window: OverwolfWindow): void {
    windows.restore(window.id, () => {
    });
  }
}






