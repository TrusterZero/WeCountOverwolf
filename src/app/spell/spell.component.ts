import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Summoner } from '../summoner/summoner.component';
import { SocketService } from '../socket.service';
import { interval } from 'rxjs';


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

export class SpellComponent implements OnInit {
  //ik twijfel over een nieuwe ID vorm die bestaat uit een combinatie van summonerId en spellId
  @Input() id: number;
  @Input() name: string;
  @Input() image: string;
  @Input() cooldown: number;
    
  onCooldown = false;
  countdown = 0;

  constructor(private socketService: SocketService) {
    
    socketService.listen("sumUsed",(data: CooldownActivationData) => {
      if (this.id === data.spellId) {
        this.onCooldown = true;
        interval(1000)
          .subscribe(() => this.countdown--);
      }
    })
  }

  ngOnInit() {
    this.countdown = this.cooldown;
  }

  startCooldown() {
    const cooldownActivationData: CooldownActivationData = {
      spellId: this.id,
      timeStamp: Date.now()
    };

    
     this.socketService.message("startCooldown",cooldownActivationData);
  }

}

