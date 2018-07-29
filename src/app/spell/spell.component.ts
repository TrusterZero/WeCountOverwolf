import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { SocketService } from '../socket.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export interface CooldownActivationData {
  //Summoner: Summoner;
  spellId: number;
  timeStamp: number; //unix timestamp datatype
}

@Component({
  selector: 'spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss']
})

export class SpellComponent implements OnInit, OnDestroy {
  //ik twijfel over een nieuwe ID vorm die bestaat uit een combinatie van summonerId en spellId
  @Input() id: number;
  @Input() name: string;
  @Input() image: string;
  @Input() cooldown: number;

  private destroyer$: Subject<void> = new Subject<void>();
    
  onCooldown = false;
  countdown = 0;

  constructor(private socketService: SocketService) {
    
    socketService.listen("sumUsed", (data: CooldownActivationData) => {
      if (this.id !== data.spellId) {
        return;
      }

      this.onCooldown = true;

      interval(1000)
        .pipe(
          takeUntil(this.destroyer$)
        )
        .subscribe(() => this.countdown--);
    })
  }

  ngOnInit() {
    this.countdown = this.cooldown;
  }

  ngOnDestroy() {
    this.destroyer$.next();
  }

  startCooldown() {
    const cooldownActivationData: CooldownActivationData = {
      spellId: this.id,
      timeStamp: Date.now()
    };

    
     this.socketService.message("startCooldown",cooldownActivationData);
  }

}

