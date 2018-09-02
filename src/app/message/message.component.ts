import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MessageService} from './message.service';
import {Message } from './message.interface';
import {Button} from "selenium-webdriver";




@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  initialMessage: Message = {
    text: null,
    action: () => this.resetMessage(),
    actionText: 'OK',
    loading: false
  };

  message: Message = this.initialMessage;

  constructor(private messageService: MessageService, private changeDetection: ChangeDetectorRef) {
    messageService.messageStream$.subscribe((message: Message) => {
      if (!message) {
        this.resetMessage();
      }

      this.message = message;
      changeDetection.detectChanges();
    } );
  }

  private resetMessage(): void {
    this.message = this.initialMessage;
    this.changeDetection.detectChanges();
  }

  private runAction(): void {
    if (this.message.action) {
      this.message.action();
    }
    this.resetMessage();
  }

  ngOnInit() { }
}
