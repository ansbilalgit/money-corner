import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  carouselState: boolean = false;
  topGainersState: boolean = false;
  topLosersState: boolean = false;
  stockNewsState: boolean = false;
  searchInfoSub: Subscription;
  strVal: any = '';
  searchData: any = [];
  searchActionItems: any = [];
  topGainers: any = [];
  topLosers: any = [];
  GlobalIndexData: any = [];
  stockData: any = [];
  dataFired: any = false;
  searchFired: any = false;
  currTime: any = new Date();

  topGainersInfo: Subscription;
  topLosersInfo: Subscription;
  GlobalIndexInfo: Subscription;
  stockNews: Subscription;

  constructor(public dataService: DataService,
    public globalService: GlobalService) { }

  ngOnInit() {
    this.topGainersInfo = this.dataService.getTopGainers().subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null) {
        this.topGainers = res;
      }
      this.topGainersState = true;
    });

    this.topLosersInfo = this.dataService.getTopLosers().subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null) {
        this.topLosers = res;
      }
      this.topLosersState = true;
    });

    this.GlobalIndexInfo = this.dataService.getGlobalMarketIndex().subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null) {
        this.GlobalIndexData = res;
      }
      this.carouselState = true;
    });

    this.stockNews = this.dataService.getStockNews().subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null) {
        this.stockData = res;
      }
      this.stockNewsState = true;
    });
  }

  isPossitive(value) {
    return value >= 0;
  }

  public initSerach(str) {
    this.dataFired = false;
    this.searchFired = false;
    this.strVal = str;
    this.searchActionItems = [];
    if (str === '') {
      this.searchData = [];
      return;
    }
    this.searchData = this.globalService.filterStocks(str);
    this.dataFired = true;
    this.searchFired = false;
    this.dataService.getSearchInfo(str).pipe(take(1)).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.searchData = res;
      }
      if (res.length === 0) {
        this.searchData = [];
      }
      this.dataFired = true;
      this.searchFired = false;
    })
    const nowTime:any = new Date();
    console.log(str + ": " + (nowTime - this.currTime));
    this.currTime = nowTime;
    var value = (nowTime - this.currTime) < 500;
    console.log("final value", value);
    console.log("searchInfoSub", this.searchInfoSub);
    console.log("time", (nowTime - this.currTime) < 500);
    if (value && this.searchInfoSub) {
      this.searchInfoSub.unsubscribe();
    }
  }

  public onSerach() {
    this.dataFired = false;
    this.searchFired = false;
    const str = this.strVal;
    this.searchData = [];
    if (str === '') {
      this.searchActionItems = [];
      return;
    }
    this.globalService.loaderState = true;
    this.searchInfoSub = this.dataService.getFullSearchInfo(str).subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.searchActionItems = res;
      }
      if (res.length === 0) {
        this.searchActionItems = [];
      }
      this.dataFired = false;
      this.searchFired = true;
    });
  }

  ////// Owl carousal settings //////
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 3000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      600: {
        items: 4
      },
      740: {
        items: 5
      },
      940: {
        items: 6
      },
      1100: {
        items: 7
      },
      1400: {
        items: 8
      },
      1600: {
        items: 9
      }
    },
    nav: true
  }

  public trimMe(value) {
    return value.toFixed(2);
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed

    if (this.searchInfoSub) {
      this.searchInfoSub.unsubscribe();
    }
    if (this.topGainersInfo) {
      this.topGainersInfo.unsubscribe();
    }
    if (this.topLosersInfo) {
      this.topLosersInfo.unsubscribe();
    }
    if (this.GlobalIndexInfo) {
      this.GlobalIndexInfo.unsubscribe();
    }
    if (this.stockNews) {
      this.stockNews.unsubscribe();
    }
  }

}
