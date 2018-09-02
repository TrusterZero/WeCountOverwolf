import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Match} from '../match/match.component';
import {CreationRequest, Payload, RequestError, SocketEvents} from './socket.interface';
import {Credentials} from "../credentials";
import {MessageService} from "../message/message.service";
import {OverwolfService} from "../overwolf/overwolf.service";
import Socket = SocketIOClient.Socket;

const SERVER_URL = Credentials.IP;
const socket: Socket = socketIo(SERVER_URL);

@Injectable()
export class SocketService {

  private roomId: number;

  constructor(private messageService: MessageService,
              private overwolf: OverwolfService) {

    this.listen(SocketEvents.matchCreated, (match: Match) => {

      this.roomId = match.id;
    });
  }

  /**
   *Connects to the server
   */
  connect(): void {
    socket.on('connect', () => {
      console.log('connected');
    });
    this.listen(SocketEvents.requestError, (socketError) => { this.handleSocketError(socketError as RequestError); });
  }

  /**
   *
   * Sends SocketEvents to the server
   *
   *
   * @param type SocketEvent that will be sent out
   * @param data
   */
  message(type: SocketEvents, data: any): void {
    const payload: Payload = {
      roomId: this.roomId,
      data: data,
    };

    socket.emit(type, payload);
  }

  /**
   *
   * Listens to SocketEvents triggered by the server
   *
   * @param type: SocketEvent that will be listened to
   * @param callback: method run when that SocketEvent is triggered
   */
  listen<T>(type: SocketEvents, callback: (data: T) => void) {
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
      .displayError(socketError.status,
        () => this.retryMatch());
  }

  private retryMatch() {
    const matchState = this.overwolf.matchState$.getValue();

    this.message(SocketEvents.createMatch, {
      summonerId: matchState.summonerId,
      region: matchState.region
    } as CreationRequest);
  }
}

