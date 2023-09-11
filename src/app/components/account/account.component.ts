import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { forEach } from 'lodash';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currCall = 0;
  allCallsLoaded = false;
  carouselState = false;
  topGainersState = false;
  topLosersState = false;
  allPortfoliosState = false;
  GlobalIndexInfo: Subscription;
  topGainersInfo: Subscription;
  topLosersInfo: Subscription;
  getPortfoliosSub: Subscription;
  loggedInUserSub: Subscription;
  getPressReleasesSub: Subscription;
  topGainers: any = [];
  topLosers: any = [];
  activitiesList: any = [];
  ////// Owl carousal settings //////
  GlobalIndexData: any = [];
  prices = {};
  pressReleases = [];
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
        items: 2
      },
      400: {
        items: 2
      },
      600: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      },
      1100: {
        items: 6
      },
      1400: {
        items: 7
      },
      1600: {
        items: 9
      }
    },
    nav: true
  }
  constructor(public dataService: DataService,
    public globalService: GlobalService, public router: Router,
    private authService: SocialAuthService
  ) { }

  ngOnInit() {
    this.activitiesList = this.globalService.getAllActivities();
    this.GlobalIndexInfo = this.dataService.getGlobalMarketIndex().subscribe((res: any) => {
      this.carouselState = true;
      res = JSON.parse(res);
      if (res !== null) {
        this.GlobalIndexData = res;
      }
    });

    this.topGainersInfo = this.dataService.getTopGainers().subscribe((res: any) => {
      this.topGainersState = true;
      res = JSON.parse(res);
      if (res !== null) {
        this.topGainers = res;
      }
    });

    this.topLosersInfo = this.dataService.getTopLosers().subscribe((res: any) => {
      this.topLosersState = true;
      res = JSON.parse(res);
      if (res !== null) {
        this.topLosers = res;
      }
    });

    this.loggedInUserSub = this.globalService.userLoggedIn.subscribe(() => {
      this.getAllPortfolios(this.globalService.currUser.email);
    });

    if (this.globalService.currUser.isUserVerified) {
      this.getAllPortfolios(this.globalService.currUser.email);
    }
  }

  public trimMe(value) {
    return value.toFixed(2);
  }

  public getAllPortfolios(email) {
    this.allPortfoliosState = false;
    this.getPortfoliosSub = this.dataService.getPortfolios(email).subscribe((res: any) => {
      this.allPortfoliosState = true;
      if (res !== null && res.portfolio) {
        if (res.portfolio != "") {
          res = JSON.parse(res.portfolio);
          this.globalService.portfolios = res;
          this.generatePrices(res);
          const _self = this;
          forEach(res, function (o) {
            _self.getPressReleases(o.symbol);
          });
        }
      }
    });
  }

  getPressReleases(stockId) {
    this.getPressReleasesSub = this.dataService.getPressReleases(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.pressReleases.push(res[0]);
      }
    });
  }

  public logout() {
    if (this.globalService.currUser.photoUrl !== '') {
      this.authService.signOut();
    }
    this.globalService.clearUser();
    this.router.navigateByUrl('/search');
  }

  isPossitive(value) {
    return value >= 0;
  }

  getDateFromNum(num) {
    return this.globalService.convertDate(num).split(", ")[0];
  }

  public generatePrices(res) {
    let output = 0;
    const allPortfolios = res.length ? res.length : 0;
    const _self = this;
    forEach(res, function (o) {
      _self.getPortfoliosSub = _self.dataService.getProfileInfo(o.symbol).subscribe((res: any) => {
        _self.globalService.loaderState = false;
        if (res !== null) {
          res = JSON.parse(res)[0];
          if (res.price) {
            output = res.price;
          }
        }
        _self.prices[o.symbol] = output;
        _self.currCall++;
        if (allPortfolios == _self.currCall) {
          _self.allCallsLoaded = true;
        }
      });
    });
  }


  generatePrice(oldValue, newValue) {
    let output = '-';
    output = (newValue / oldValue).toFixed(2);
    return output;
  }

  ngOnDestroy() {
    if (this.GlobalIndexInfo) {
      this.GlobalIndexInfo.unsubscribe();
    }
    if (this.topGainersInfo) {
      this.topGainersInfo.unsubscribe();
    }
    if (this.topLosersInfo) {
      this.topLosersInfo.unsubscribe();
    }
    if (this.getPortfoliosSub) {
      this.getPortfoliosSub.unsubscribe();
    }
    if (this.loggedInUserSub) {
      this.loggedInUserSub.unsubscribe();
    }
    if (this.getPressReleasesSub) {
      this.getPressReleasesSub.unsubscribe();
    }
  }

}
