import {Component, OnInit, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {CooldownActivationData, SocketEvents} from '../socket/socket.interface';


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

  constructor(private socketService: SocketService, private changeDetection: ChangeDetectorRef) {

    socketService.listen(SocketEvents.sumUsed, (data: CooldownActivationData) => {

      if (this.spellId !== data.spellId) {

        return;
      }

      const stopCooldown$: Subject<void> = new Subject<void>();

      interval(1000)
        .pipe(
          takeUntil(this.destroyer$),
          takeUntil(stopCooldown$) // run until countdown hits 0
        )
        .subscribe(() => {
          this.countdown--;
          changeDetection.detectChanges();
          if (this.countdown === 0) {
            stopCooldown$.next();
            this.resetCountdown();
          }
        });
    });
  }

  /**
   *
   * Starts the cooldown for all players in the users team
   * via socket.io connection
   *
   */
  startCooldown() {
    if (this.countdown !== this.cooldown) {
      return;
    }

    const cooldownActivationData: CooldownActivationData = {

      spellId: this.spellId,
      timeStamp: Date.now(),
    };

    this.socketService.message(SocketEvents.startCooldown, cooldownActivationData);

    // we start counting down immediately to trigger the state change and
    // which is acceptable because there is most likely already a human response delay of at least a second
    // this.countdown--;
  }

  /**
   *
   *  Returns countdown to its original state
   *
   */
  private resetCountdown(): void {
    this.countdown = this.cooldown;
    this.changeDetection.detectChanges();
  }

  ngOnInit() {
    this.resetCountdown();
  }

  ngOnDestroy() {
    this.destroyer$.next();
  }
}

