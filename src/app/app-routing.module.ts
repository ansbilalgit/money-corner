import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompareComponent } from './components/compare/compare.component';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { MarketsComponent } from './components/markets/markets.component';
import { RegisterComponent } from './components/register/register.component';
// import { NewMarketComponent } from './components/new-market/new-market.component';
// import { ScreenerComponent } from './components/screener/screener.component';
import { SearchComponent } from './components/search/search.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { CalendarComponent } from './components/calendar/calendar.component';

const routes: Routes = [
  { path: 'home', component: SearchComponent },
  { path: 'search', component: SearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'stock/:id', component: MarketsComponent, pathMatch: 'full' },
  { path: 'calendar', component: CalendarComponent },
  // { path: 'new-stock/:id', component: NewMarketComponent, pathMatch: 'full' },
  // { path: 'screener', component: ScreenerComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
