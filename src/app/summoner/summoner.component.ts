import { Component, OnInit, Input } from '@angular/core';


export interface Summoner {
  id: number;
  champion: Champion;
  spell1: Spell;
  spell2: Spell;
  hasCDR: boolean;
}

interface Champion {
  id: number;
  name: string;
  image: string;
}

interface Spell {
  id: number;
  name: string;
  image: string;
  cooldown: number;
}

@Component({
  selector: 'summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss'],
  providers: []
})
export class SummonerComponent implements OnInit {
  @Input() id: number;
  @Input() champion: Champion;
  @Input() spell1: Spell;
  @Input() spell2: Spell;

  constructor() { }

  ngOnInit() {
    console.log('ngOnInit:', this.champion);
  }
}
