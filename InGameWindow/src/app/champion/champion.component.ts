import { Component, Input } from '@angular/core';

@Component({
  selector: 'champion',
  templateUrl: './champion.component.html',
  styleUrls: ['./champion.component.scss']
})
export class ChampionComponent {
  @Input() id: number;
  @Input() name: string;
  @Input() image: string;

  constructor() { }


}
