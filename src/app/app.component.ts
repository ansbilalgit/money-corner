import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { GlobalService } from './services/global.service';
// import { map, partialRight, pick, filter } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Component({
  selector: 'mct',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  strVal: any = '';
  searchData: any = [];
  // searchInfoSub: Subscription;
  getSearchDataSub: Subscription;
  searchFocused: Boolean = true;

  constructor(private http: HttpClient,public router: Router, public globalService: GlobalService, public dataService: DataService, private renderer: Renderer2) { }
  @ViewChild('navbarToggler', { static: false }) navbarToggler: ElementRef;

  ngOnInit() {
    // this.getSearchData();
    this.getAllStocks();
    this.router.events.subscribe((evt) => {
      this.searchFocused = false;
      this.strVal = '';
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
      if (this.navbarToggler.nativeElement.classList.value === "navbar-toggle") {
        this.navbarToggler.nativeElement.click();
      }
      this.globalService.currRoute = evt.url.split("/")[1];
    });
  }

  public getAllStocks() {
    this.getSearchDataSub = this.dataService.getAllStocks().subscribe((res: any) => {
      this.globalService.loaderState = false;
      this.globalService.isSearchLoaded = false;
      if (res !== null && res[0]) {
        this.globalService.allStocksData = res;
        if (res.length === 0) {
          this.globalService.allStocksData = [];
        }
      }
    });
  }

  public initSerach(str) {
    this.searchFocused = true;
    this.strVal = str;
    this.searchData = [];
    if (str === '') {
      this.searchData = [];
      return;
    }
    this.searchData = this.globalService.filterStocks(str);
    this.dataService.getSearchInfo(str).pipe(take(1)).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.searchData = res;
      }
      if (res.length === 0) {
        this.searchData = [];
      }
    })
  }

  getSearchData() {
    if (this.globalService.allStocksData.length > 0) {
      return false;
    }
    this.globalService.isSearchLoaded = false;
    this.getSearchDataSub = this.dataService.getSearchData().subscribe((res: any) => {
      this.globalService.loaderState = false;
      this.globalService.isSearchLoaded = false;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        // this.globalService.allStocksData = map(res, partialRight(pick, ['symbol', 'name']));
        this.globalService.allStocksData = res;
        if (res.length === 0) {
          this.globalService.allStocksData = [];
        }
      }
    });
  }

  // @HostListener('window:scroll', ['$event'])
  // scrollHandler(event) {
  // console.log("event.target.offsetHeight event.target.scrollTop event.target.scrollHeight", event.target.offsetHeight, event.target.scrollTop, event.target.scrollHeight);
  // if ((event.target.offsetHeight + event.target.scrollTop) + 150 >= event.target.scrollHeight) {
  //   console.log("End");
  // } else {
  //   this.footerState = false;
  // }
  // if (event.target.scrollTop == 0) {
  //   // console.log("Start");
  //   this.footerState = true;
  // }
  // }

  ngOnDestroy() {
    if (this.getSearchDataSub) {
      this.getSearchDataSub.unsubscribe();
    }
  }
}

