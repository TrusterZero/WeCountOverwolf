import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
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

export class MatchComponent {
  match: Match = null;
  summoners: Summoner[] = [];
  useWeCount = false;


  constructor(private matchService: MatchService, private overwolfService: OverwolfService, private changeDetection: ChangeDetectorRef) {
    matchService.matchData.subscribe((match: Match) => this.checkMatch(match));
  }

  checkMatch(match: Match): void {
    console.log('match checked and is ', match)
    console.log(!match)
    if (!match) {
      this.clearMatch();
    }else {
      this.setMatch(match);
    }
  }

  clearMatch(): void {
    console.log('clearing match')
    this.match = null;
    this.summoners = [];
    this.useWeCount = false;
    this.overwolfService.clearHotkeyListeners();
    this.changeDetection.detectChanges();
    console.log(this)
  }

  setMatch(match: Match): void {
    console.log('setting this match:', match)
    this.match = match;
    this.summoners = match.summoners;
    this.changeDetection.detectChanges();
  }

  runWeCount(willRun: boolean): void {
    console.log('accepted run')
    this.overwolfService.hideWindow();
    if (willRun) {
      this.overwolfService.setHotkeyListeners();
      this.useWeCount = true;
    }
  }

}
