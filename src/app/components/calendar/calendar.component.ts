import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { Countries } from './countries';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  fromDate: any = '';
  toDate: any = '';
  country: any = '';
  EconomicLists: any = [];
  DivideEndLists: any = [];
  IPOLists: any = [];
  EarningsLists: any = [];
  StockSplitLists: any = [];
  CountriesLists: any = Countries;
  itemsPerPage: any = 10;
  economicPage: any = 1;
  divideendPage: any = 1;
  ipoPage: any = 1;
  earningsPage: any = 1;
  stockSplitPage: any = 1;
  constructor(private http: DataService){
    this.CountriesLists = this.CountriesLists.sort(this.compare);
    this.country = 'AU';
    this.loadData();
  }

  ngOnInit() {
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  loadData(){
    let fromDate = this.fromDate;
    if(!fromDate && !this.toDate){
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      fromDate = this.formatDate(firstDay);
    }
    this.http.getCalendar("economic_calendar?from=" + fromDate + "&to=" + this.toDate + "&apikey=" + environment.apiKey).subscribe((response)=>{
      this.EconomicLists = response;
    })
    this.http.getCalendar("stock_dividend_calendar?from=" + fromDate + "&to=" + this.toDate + "&apikey=" + environment.apiKey).subscribe((response)=>{
      this.DivideEndLists = response;
    })
    this.http.getCalendar("ipo_calendar?from=" + fromDate + "&to=" + this.toDate + "&apikey=" + environment.apiKey).subscribe((response)=>{
      this.IPOLists = response;
    })
    this.http.getCalendar("earning_calendar?from=" + fromDate + "&to=" + this.toDate + "&apikey=" + environment.apiKey).subscribe((response)=>{
      this.EarningsLists = response;
    })
    this.http.getCalendar("stock_split_calendar?from=" + fromDate + "&to=" + this.toDate + "&apikey=" + environment.apiKey).subscribe((response)=>{
      this.StockSplitLists = response;
    }) 
  }

  compare( a: any, b: any ) {
    if ( a.Code < b.Code ){
      return -1;
    }
    if ( a.Code > b.Code ){
      return 1;
    }
    return 0;
  }

  scroll(el){
    el.scrollIntoView(true);
  }
}

