import {Component, OnInit, Input, OnDestroy, ChangeDetectorRef, OnChanges} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss']
})

export class SpellComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id: string;
  @Input() name: string;
  @Input() image: string;
  @Input() cooldown: number;
  @Input() summonerId: number;

  private destroyer$: Subject<void> = new Subject<void>();
  countdown = 0;


  constructor(private changeDetection: ChangeDetectorRef) {



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

    const stopCooldown$: Subject<void> = new Subject<void>();

    interval(1000)
      .pipe(
        takeUntil(this.destroyer$),
        takeUntil(stopCooldown$) // run until countdown hits 0
      )
      .subscribe(() => {
        this.countdown--;
        this.changeDetection.detectChanges();
        if (this.countdown <= 0) {
          stopCooldown$.next();
          this.resetCountdown();
        }
      });

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

  ngOnChanges(): void {
    this.changeDetection.detectChanges();
  }
}

