import {Component, ChangeDetectorRef, OnChanges, OnInit} from '@angular/core';
import {Summoner} from '../summoner/summoner.component';

export interface Match {
  id: number;
  summoners: Summoner[];
}

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})

export class MatchComponent implements OnChanges, OnInit {
  match: Match = null;
  summoners: Summoner[] = [];


  constructor(private changeDetection: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.checkMatch(tutorialData);
  }
  checkMatch(match: Match): void {
    console.log(match);
    this.setMatch(match);
    this.changeDetection.detectChanges();
  }


  setMatch(match: Match): void {
    this.match = match;
    this.summoners = match.summoners;
    this.changeDetection.detectChanges();
  }


  ngOnChanges() {
    this.changeDetection.detectChanges();
  }

}

const tutorialData: Match = {
  id: 3792143891,
  summoners: [{
    hasCDR: true,
    id: 73807830,
    champion: {
      id: 201,
      name: 'Braum',
      image: 'Braum.png'
    },
    spell1: {
      id: 7380783014,
      name: 'Ignite',
      image: 'SummonerDot.png',
      cooldown: 199.5
    }, spell2: {
      id: 738078304,
      name: 'Flash',
      image: 'SummonerFlash.png',
      cooldown: 285
    }
  }, {
    hasCDR: false,
    id: 116518296,
    champion: {
      name: 'Teemo',
      image: 'Teemo.png',
      id: 145
    },
    spell1: {
      id: 1165182967, name: 'Heal',
      image: 'SummonerHeal.png',
      cooldown: 240
    }, spell2: {
      id: 1165182964, name: 'Flash',
      image: 'SummonerFlash.png',
      cooldown: 300
    }
  }, {
    hasCDR: true, id: 51721162, champion: {
      id: 99, name: 'Lux',
      image: 'Lux.png'
    },
    spell1: {
      id: 5172116221, name: 'Barrier',
      image: 'SummonerBarrier.png',
      cooldown: 171
    },
    spell2: {
      id: 517211624,
      name: 'Flash',
      image: 'SummonerFlash.png',
      cooldown: 285
    }
  },
    {
      hasCDR: false, id: 88106973, champion: {
        id: 121,
        name: 'Kha\'Zix',
        image: 'Khazix.png'
      }, spell1:
        {
          id: 881069734,
          name: 'Flash',
          image: 'SummonerFlash.png',
          cooldown: 300
        }
      ,
      spell2: {
        id: 8810697311,
        name: 'Smite',
        image: 'SummonerSmite.png',
        cooldown: 75
      }
    },
    {
      hasCDR: false,
      id: 70302649,
      champion:
        {
          id: 6,
          name: 'Urgot',
          image: 'Urgot.png'
        },
      spell1: {
        id: 703026494,
        name: 'Flash',
        image: 'SummonerFlash.png',
        cooldown: 300
      }
      ,
      spell2: {
        id: 7030264912,
        name: 'Teleport',
        image: 'SummonerTeleport.png',
        cooldown: 300
      }
    }]
};
