import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ExampleStarterComponent} from './example-starter/example-starter.component';
import {MatchComponent} from './match/match.component';
import {ChampionComponent} from './champion/champion.component';
import {SpellComponent} from './spell/spell.component';
import {SummonerComponent} from './summoner/summoner.component';
import {RouterModule, Routes} from '@angular/router';
import { TutorialComponent } from './tutorial/tutorial.component';
import { SliderComponent } from './slider/slider.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';

const routes: Routes = [
  {path: 'tutorial', component: TutorialComponent},
  {path: 'home', component: ExampleStarterComponent},
  {path: 'index.html', redirectTo: 'home'},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [
    AppComponent,
    ExampleStarterComponent,
    MatchComponent,
    ChampionComponent,
    SpellComponent,
    SummonerComponent,
    TutorialComponent,
    SliderComponent,
  ],
  imports: [
    MatCardModule,
    MatTabsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      routes, { enableTracing: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
