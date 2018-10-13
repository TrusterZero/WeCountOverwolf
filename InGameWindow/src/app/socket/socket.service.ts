import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Match} from '../match/match.component';
import {CreationRequest, Payload, RequestError, SocketEvent, Source} from './socket.interface';
import {Credentials} from '../credentials';
import {MessageService} from '../message/message.service';
import {OverwolfService} from '../overwolf/overwolf.service';
import Socket = SocketIOClient.Socket;

const SERVER_URL = Credentials.IP;
const socket: Socket = socketIo(SERVER_URL);

@Injectable()
export class SocketService {

  private roomId: number;

  constructor(private messageService: MessageService,
              private overwolf: OverwolfService) {
    this.setListeners();
  }

  /**
   *Connects to the server
   */
  connect(): void {
    socket.on('connect', () => {
      console.log('connected');
    });
  }

  private setListeners() {
    this.listen(SocketEvent.connectionError, () => {
      this.messageService.showMessage('Please check internet connection');
    });
    this.listen(SocketEvent.matchCreated, (match: Match) => {
      this.roomId = match.id;
    });
    this.listen(SocketEvent.requestError, (socketError: RequestError) => {
      this.handleSocketError(socketError);
    });
  }
  /**
   *
   * Sends SocketEvent to the server
   *
   *
   * @param type SocketEvent that will be sent out
   * @param data
   */
  send(type: SocketEvent, data: any): void {
    const payload: Payload = {
      source: Source.pc,
      roomId: this.roomId,
      data: data,
    };

    socket.emit(type, payload);
  }

  /**
   *
   * Listens to SocketEvent triggered by the server
   *
   * @param type: SocketEvent that will be listened to
   * @param callback: method run when that SocketEvent is triggered
   */
  listen<T>(type: SocketEvent, callback: (data: T) => void) {
    socket.on(type, callback);
  }


  /**
   *
   * Handles errors that are thrown during the request for match data
   *
   * @param socketError: Error thrown
   */
  private handleSocketError(socketError: RequestError): void {
    this.messageService
      .displayError(socketError,
        () => this.retryMatch());
  }

  private retryMatch() {
    const matchState = this.overwolf.matchState$.getValue();

    this.send(SocketEvent.createMatch, {
      summonerId: matchState.summonerId,
      summonerName: '',
      region: matchState.region
    } as CreationRequest);
  }
}

