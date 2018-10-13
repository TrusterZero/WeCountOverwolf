import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'example-starter',
  templateUrl: './example-starter.component.html',
  styleUrls: ['./example-starter.component.scss']
})
export class ExampleStarterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  navToTutorial() {
    console.log('click')
    // go to tutorial
  }
}
