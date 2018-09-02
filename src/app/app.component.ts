import { Component } from '@angular/core';
import { SocketService } from './socket/socket.service';
import { OverwolfService } from './overwolf/overwolf.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private socket: SocketService) {
    this.socket.connect();
  }
}
