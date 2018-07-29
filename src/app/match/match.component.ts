import { Component, OnInit, Input } from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { MatchService } from './match.service';

export interface Match {
  id: number;
  summoners: Summoner[];
}

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent {
  match: Match;
  summoners: Summoner[] = [];

  constructor(private matchService: MatchService) {

    //ik benn hier direct gesubt aan de behaviorSubject is dat een probleem ?*
    matchService.matchData.subscribe((match) => {
      if (match) {
        this.match = match;
        this.summoners = match.summoners;
      }
    });
  }
}
