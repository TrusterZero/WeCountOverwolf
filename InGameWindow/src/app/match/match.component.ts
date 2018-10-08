import {Component, ChangeDetectorRef, OnChanges} from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { MatchService } from './match.service';
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

export class MatchComponent implements OnChanges {
  match: Match = null;
  summoners: Summoner[] = [];
  useWeCount = false;


  constructor(private matchService: MatchService, private overwolfService: OverwolfService, private changeDetection: ChangeDetectorRef) {
    matchService.matchData.subscribe((match: Match) => this.checkMatch(match));
  }

  checkMatch(match: Match): void {
    if (!match) {
      this.clearMatch();
    } else {
      this.setMatch(match);
    }
    this.changeDetection.detectChanges();
  }

  clearMatch(): void {
    this.match = null;
    this.summoners = [];
    this.useWeCount = false;
    this.overwolfService.activateHotkeys = false;
    this.changeDetection.detectChanges();
  }

  setMatch(match: Match): void {
    this.match = match;
    this.summoners = match.summoners;
    this.changeDetection.detectChanges();
  }

  runWeCount(willRun: boolean): void {
    this.overwolfService.hideWindow();
    if (willRun) {
      this.overwolfService.activateHotkeys = true;
      this.useWeCount = true;
    }
    this.changeDetection.detectChanges();
  }

  ngOnChanges() {
    this.changeDetection.detectChanges();
  }

}
