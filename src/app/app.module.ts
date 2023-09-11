import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MarketsComponent } from './components/markets/markets.component';
import { DataService } from './services/data.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GlobalService } from './services/global.service';
import { HttpClientModule } from '@angular/common/http';
import { MiniChartComponent } from './components/mini-chart/mini-chart.component';
import { SearchComponent } from './components/search/search.component';
import { CompareComponent } from './components/compare/compare.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NewMarketComponent } from './components/new-market/new-market.component';
// import { ScreenerComponent } from './components/screener/screener.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DataTablesModule } from 'angular-datatables';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountComponent } from './components/account/account.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { SimpleLineChartComponent } from './components/charts/simple-line-chart/simple-line-chart.component';
import { PieBarChartComponent } from './components/charts/pie-bar-chart/pie-bar-chart.component';
import { PieLineChartComponent } from './components/charts/pie-line-chart/pie-line-chart.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CountryFilterPipe } from './pipes/country-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MarketsComponent,
    MiniChartComponent,
    SearchComponent,
    CompareComponent,
    // NewMarketComponent,
    // ScreenerComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    SimpleLineChartComponent,
    PieBarChartComponent,
    PieLineChartComponent,
    DisclaimerComponent,
    ContactUsComponent,
    CalendarComponent,
    CountryFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    CarouselModule,
    DataTablesModule,
    SocialLoginModule,
    NgxPaginationModule
  ],
  providers: [ThemeService, DataService, GlobalService, { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1005734410464-rf2q4kpevsop8o722rfpbo1regdhq1k6.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('287374883185658')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
