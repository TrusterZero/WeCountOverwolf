import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Subject} from 'rxjs';
import {Match} from './match/match.component';
import {Payload, RequestError, RequestErrorCodes, SocketEvents} from './socket.interface';
import Socket = SocketIOClient.Socket;

const SERVER_URL = 'http://127.0.0.1:3000/';
const socket: Socket = socketIo(SERVER_URL);

@Injectable()
export class SocketService {

  connectedMatch: Subject<Match> = new Subject<Match>(); // kan deze global ???
  private roomId: number;

  constructor() {

    this.listen(SocketEvents.matchCreated, (match: Match) => {

      this.roomId = match.id;
      this.connectedMatch.next( match ); // gebeurd voor elke instantie
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
    // not fully implemented yet
    switch (socketError.status) {
      case RequestErrorCodes.unauthorized: console.log(socketError);
        break;
      case RequestErrorCodes.forbidden: console.log(socketError);
        break;
      case RequestErrorCodes.notFound: console.log(socketError);
        break;
      default: console.log(socketError);
    }
  }
}

