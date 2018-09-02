import { Injectable } from '@angular/core';
import {ErrorCode} from '../socket/socket.interface';
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

  public displayError(error: ErrorCode, action: () => void ): void {
  console.log(ErrorMessage[error]);
  const message: Message  = {
    text: ErrorMessage[error],
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
      action: null,
      actionText: null
    };

    this.messageStream$.next(message);
  }
}
