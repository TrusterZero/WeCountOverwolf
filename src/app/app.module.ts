import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SummonerComponent } from './summoner/summoner.component';
import { SpellComponent } from './spell/spell.component';
import { ChampionComponent } from './champion/champion.component';
import { SocketService } from './socket.service';
import { MatchComponent } from './match/match.component';
import { MatchService } from './match/match.service';

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
  providers: [SocketService, MatchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
