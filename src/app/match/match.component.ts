import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { MatchService } from './match.service';
import { Subject } from 'rxjs';
import {OverwolfService} from '../overwolf/overwolf.service';

export interface Match {
  id: number;
  summoners: Summoner[];
}

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})

export class MatchComponent {
  match: Match = null;
  summoners: Summoner[] = [];

  constructor(private matchService: MatchService, private changeDetection: ChangeDetectorRef) {
    matchService.matchData.subscribe((match: Match) => {

      if (!match) {
        this.match = null;
        this.summoners = [];
        this.changeDetection.detectChanges();

        return;
      }

      this.match = match;
      this.summoners = match.summoners;
      this.changeDetection.detectChanges();
    });
  }
}
