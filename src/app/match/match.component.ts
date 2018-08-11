import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { MatchService } from './match.service';
import { Subject } from 'rxjs';

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

  constructor(private matchService: MatchService, private changeDetection: ChangeDetectorRef) {
    matchService.matchData.subscribe((match: Match) => {
      console.log(match)
      if (!match) {
        return;
      }

      this.match = match;
      this.summoners = match.summoners;
      this.changeDetection.detectChanges();
    });
  }
}
