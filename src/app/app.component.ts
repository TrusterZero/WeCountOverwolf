import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { Summoner } from './summoner/summoner.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  socket = new SocketService();

  
  constructor(){
    console.log("yoooooo!")
  }
}
