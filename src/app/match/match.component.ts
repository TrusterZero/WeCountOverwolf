import { Component, OnInit, Input } from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { MatchService } from './match.service';
import { Subject } from 'rxjs/index';

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
  summoners: Subject<Summoner[]> = new Subject<Summoner[]>();

  constructor(private matchService: MatchService) {
    matchService.matchData.subscribe((match: Match) => {
      if (!match) {
        return;
      }

      this.match = match;
      this.summoners.next(match.summoners);
    });
  }
}
