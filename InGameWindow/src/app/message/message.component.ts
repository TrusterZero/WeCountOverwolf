import {ChangeDetectorRef, Component, OnInit , OnChanges} from '@angular/core';
import { MessageService} from './message.service';
import {Message } from './message.interface';




@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnChanges, OnInit  {
  initialMessage: Message = {
    text: null,
    action: null,
    actionText: 'OK',
    loading: false
  };
  message: Message;

  constructor(private messageService: MessageService, private changeDetection: ChangeDetectorRef) {
    this.message = this.initialMessage;
    messageService.messageStream$.subscribe((message: Message) => {
      console.log('got here', message)
      if (!message) {
        this.resetMessage();
        return;
      }
      this.message = message;
      this.changeDetection.detectChanges();
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

  ngOnInit() {

  }

   ngOnChanges() {
      this.changeDetection.detectChanges();
  }
}
