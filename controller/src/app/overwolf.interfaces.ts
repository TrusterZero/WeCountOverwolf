import {BehaviorSubject} from 'rxjs';

export enum Feature {
    matchState = 'matchState',
    death = 'death',
    respawn = 'respawn',
    abilities = 'abilities',
    kill = 'kill',
    assist = 'assist',
    gold = 'gold',
    minions = 'minions',
    summonerInfo = 'summoner_info',
    gameMode = 'gameMode',
    teams = 'teams',
    level = 'level',
    announcer = 'announcer'
}

export enum Hotkey {
  showWindow = 'showWindow',
}

export enum Status {
  error = 'error',
  success = 'success'
}

export interface OverwolfKeyEvent {
  key: string;
  onGame: boolean;
}

export interface ShowWindowHotkey {
  ctrlPressed: boolean;
  spacePressed: boolean;
}

export interface NewEventResultSet {
  events: NewEvent[];
}

export interface NewEvent {
  name: string;
  data: any;
}
// TODO ADD ALL POSSIBLE EVENTS
export enum NewEventName {
  matchEnd = 'matchEnd',
}

export enum WindowState {
  minimized = 'minimized',
  maximized = 'maximized',
  closed = 'closed',
  opened = 'opened'
}

export interface CurrentWindowStates {
  inGame: WindowState;
  desktop: WindowState;
}

export interface WindowUpdate {
  app_id: string;
  window_id: string;
  window_name: string;
  window_state: WindowState;
  window_previous_state: WindowState;
}

export interface WindowResult {
  status: string;
  window: OverwolfWindow;
}

export interface OverwolfWindow {
    id: string;
    name: string;
    width: number;
    height: number;
    top: number;
    left: number;
    isVisible: boolean;
    Parent: OverwolfWindow;
    isRestored?: BehaviorSubject<boolean>;
}

export enum WindowName {
  inGameWindow = 'inGameWindow',
  desktopWindow = 'desktopWindow',
  controller = 'controller'
}

export enum WindowMessageId {
  matchState = 'matchState'
}

export interface Update {
    summoner_info: SummonerInfo;
    game_info: GameInfo;
}
interface SummonerInfo {
  id: number;
  name: string;
  region: string;
}

interface GameInfo {
  matchStarted: boolean;
}
export interface GameModeInfo {
    gameMode: string;
}

export interface MatchState {
  summonerId: number;
  summonerName: string;
  region: string;
  matchActive: boolean;
}
export interface Game {
  isInFocus: boolean;
  isRunning: boolean;
  allowsVideoCapture: boolean;
  title: string;
  id: number;
  width: number;
  height: number;
  logicalWidth: number;
  logicalHeight: number;
  renderers: string[];
  detectedRenderer: string;
  executionPath: string;
  sessionId: string;
  commandLine: string;
}

export interface GameInfoChangeData {
  gameInfo: Game;
  resolutionChanged: boolean;
  focusChanged: boolean;
  runningChanged: boolean;
  gameChanged: boolean;
}


