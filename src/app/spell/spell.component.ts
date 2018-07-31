import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export interface CooldownActivationData {
  spellId: string;
  timeStamp: number; //unix timestamp datatype
}

@Component({
  selector: 'spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss']
})

export class SpellComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() name: string;
  @Input() image: string;
  @Input() cooldown: number;
  @Input() summonerId: number;

  private destroyer$: Subject<void> = new Subject<void>();

  countdown = 0;

  get spellId(): string {
    return `${this.id}-${this.summonerId}`;
  }

  constructor(private socketService: SocketService) {

    // todo want to buy enum!
    socketService.listen("sumUsed", (data: CooldownActivationData) => {
      if (this.spellId !== data.spellId) {
        return;
      }

      const stopCooldown$: Subject<void> = new Subject<void>();

      interval(1000)
        .pipe(
          takeUntil(this.destroyer$),
          takeUntil(stopCooldown$)
        )
        .subscribe(() => {
          this.countdown--;

          if (this.countdown === 0) {
            stopCooldown$.next();
            this.resetCooldown();
          }
        });
    });
  }

  ngOnInit() {
    this.cooldown = 5;
    this.resetCooldown();
  }

  ngOnDestroy() {
    this.destroyer$.next();
  }

  /**
   * TODO FEEDME
   */
  startCooldown() {
    if (this.countdown !== this.cooldown) {
      return;
    }

    const cooldownActivationData: CooldownActivationData = {
      spellId: this.spellId,
      timeStamp: Date.now()
    };

    this.socketService.message("startCooldown",cooldownActivationData);

    // we start counting down immediately to trigger the state change and
    // which is acceptable because there is most likely already a human response delay of at least a second
    this.countdown--;
  }

  private resetCooldown(): void {
    this.countdown = this.cooldown;
  }
}

