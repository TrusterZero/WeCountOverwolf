import { Injectable } from '@angular/core';
import {ErrorCode, RequestError} from '../socket/socket.interface';
import {Subject} from 'rxjs';
import { ErrorMessage, Message} from './message.interface';


@Injectable({
  providedIn: 'root'
})

export class MessageService {
  messageStream$: Subject<Message> = new Subject<Message>();
  constructor() { }

  public startLoading(): void {
    const message: Message  = {
      text: 'loading...',
      loading: true,
      action: null,
      actionText: null,
    };
    this.messageStream$.next(message);
  }

  public stopLoading(): void {
    this.messageStream$.next();
  }

  public displayError(error: RequestError, action: () => void ): void {
    console.log('in error', error)
  const message: Message  = {
    text: error.message,
    loading: false,
    action: action,
    actionText: 'Retry'
  };
    this.messageStream$.next(message);
  }

  showMessage(messageText: string) {
    const message: Message = {
      text: messageText,
      loading: false,
      action: () => {},
      actionText: null
    };

    this.messageStream$.next(message);
  }
}
