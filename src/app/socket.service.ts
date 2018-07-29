import { Injectable, EventEmitter } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable, Subject, BehaviorSubject, of } from "rxjs";
import { Match } from './match/match.component';
import { CooldownActivationData } from './spell/spell.component';
import Socket = SocketIOClient.Socket;

const SERVER_URL = 'http://127.0.0.1:3000/';

@Injectable()
export class SocketService {
  private socket: Socket;
  private connectedSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  connect(): Observable<boolean> {
    this.socket = socketIo(SERVER_URL);

    this.socket.on('connect', () => {
      console.log('Connected');
      this.connectedSubject.next(true);
    });

    return this.connectedSubject.asObservable();
  }

  message(type: string, payload: any) {
    this.socket.emit(type, payload);
  }
  
  listen<T>(type: string, callback: (data: T) => void) {
    this.socket.on(type, callback);    
  }
  // matchReturned:EventEmitter<Match> = new EventEmitter<Match>();
  // sumUsed:EventEmitter<CooldownActivationData> = new EventEmitter<CooldownActivationData>();

  // constructor() {


  //   this.socket.on('connect', () => {
  //     console.log('Connected');
  //     this.socket.emit('match', {test: 'test'});
  //   });

  //   this.socket.on('matchReturn', (data) => {
  //     console.log("match returned"); 
  //     this.matchReturned.emit(<Match>data);
  //   });

  //   this.socket.on('sumUsed', (data:CooldownActivationData) => {
  //     this.sumUsed.emit(data);
  //   })
  // }

  // public startCooldown(cooldownActivationData:CooldownActivationData):void {
  //   this.socket.emit("startCooldown",cooldownActivationData)
  // }
  // public send(message: any): void {
  //   console.log('Sending message:', message);
  //   this.socket.emit('test', message);
  // }

  // public onMessage(): Observable<any> {
  //   return new Observable<any>(observer => {
  //     this.socket.on('message', (data: any) => observer.next(data));
  //   });
  // }
}



