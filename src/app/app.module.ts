import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SummonerComponent } from './summoner/summoner.component';
import { SpellComponent } from './spell/spell.component';
import { ChampionComponent } from './champion/champion.component';
import { SocketService } from './socket/socket.service';
import { MatchComponent } from './match/match.component';
import { MatchService } from './match/match.service';
import {OverwolfService} from './overwolf/overwolf.service';

@NgModule({
  declarations: [
    AppComponent,
    SummonerComponent,
    SpellComponent,
    ChampionComponent,
    MatchComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketService, MatchService, OverwolfService],
  bootstrap: [AppComponent]
})
export class AppModule { }
