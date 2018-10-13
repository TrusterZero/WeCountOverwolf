import { Component } from '@angular/core';
import {WindowService} from './window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'controller';
  constructor(private windowService: WindowService){ }
}
