import { Component, Inject, NgZone, PLATFORM_ID, OnInit, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data.service';
import { GlobalService } from '../../services/global.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { forEach, reverse, xor, startCase, filter, map, cloneDeep, range, findIndex } from 'lodash';


// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
declare var $: any;

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.css']
})
export class MarketsComponent implements OnInit {
  sideNavToggle = false;
  stockId = '';
  roaceTooltip: any = '';
  themeMode: any = '';
  ratingInfoState = false;
  similarStocksState = false;
  growthDataState = false;
  balSheetStState = false;
  cashFlowStState = false;
  stockNewsState = false;
  secFilingsState = false;
  // themeMode = false;
  // showRevenueEpsChart = false;
  // showDividendChart = false;
  // showBookValueChart = false;
  showPriceChart = false;
  showReturnNetChart = false;
  profileBtnState = false;
  marketCap: any = 0;
  profileState = false;
  profileInfo: any = {
    description: '',
    price: 0,
    changes: 0,
    percentage: 0
  };
  revenueAndEpsInfo: any = {};
  mktCap: any = 0;
  revenueCurrent: any = {
    value: 0,
    curDetect: ''
  };
  oneMonthStockReturns: any = 0;
  sixMonthsStockReturns: any = 0;
  oneYearStockReturns: any = 0;
  threeYearStockReturns: any = 0;
  fiveYearStockReturns: any = 0;
  avgDividendYield: any = 0;
  epsCurrent: any = 0;
  dividendInfo: any = [];
  bookValueInfo: any = [];
  priceChartInfo: any = [];
  returnNetChartInfo: any = [];
  stocks: any = [];
  stockNews: any = [];
  elements1 = ["date", "symbol", "reportedCurrency", "fillingDate", "acceptedDate", "period", "link", "finalLink"];
  pLElements: any = [];
  balSheetElements: any = [];
  cashFlowElements: any = [];
  fsIncomeStTableData: any = [];
  fsBalanceStTableData: any = [];
  fsCashStTableData: any = [];
  fsIncomeStTableKeys: any = [
    { name: "Total Revenue", key: "revenue" },
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Operating Income", key: "operatingIncome" },
    { name: "Net Income", key: "netIncome" }
  ];
  fsBalanceStTableKeys: any = [
    { name: "Total Assets", key: "totalAssets" },
    { name: "Total Liabilities", key: "totalLiabilities" },
    { name: "Total Equity", key: "totalStockholdersEquity" }
  ];
  fsCashStTableKeys: any = [
    { name: "Cash From Operating Activities", key: "netCashProvidedByOperatingActivities" },
    { name: "Cash From Investing Activities", key: "netCashUsedForInvestingActivites" },
    { name: "Cash From Financing Activities", key: "netCashUsedProvidedByFinancingActivities" },
    { name: "Net Change in Cash", key: "netChangeInCash" }
  ];

  keyMetrics: any = {
    marketCap: '',
    ePS: '',
    priceToBookValue: '',
    pERatio: '',
    dividendYield: '',
    rOE: '',
    rOCE: '',
    enterpriseValue: '',
    sectorPE: '',
    eVtoEBITDA: '',
    outstandingShares: '',
    bookValue: '',
    website: '',
    val52WeekHigh: '',
    val52WeekLow: '',
    fairValue: ''
  }
  avg3YrROE: any = 0;
  avg3YrROCE: any = 0;
  avg3YrROA: any = 0;
  avg3YrNPM: any = 0;
  profileInfoSub: Subscription;
  getRevenueInfoSub: Subscription;
  subRouteChange: Subscription;
  getStockReturnsSub: Subscription;
  getBookValueInfoSub: Subscription;
  getPriceChartInfoSub: Subscription;
  getReturnNetInfoSub: Subscription;
  getFinancialGrowthInfoSub: Subscription;
  // getFinancialGrowthInfo2Sub: Subscription;
  getSimilarStocksSub: Subscription;
  getBalSheetStInfoSub: Subscription;
  getCashFlowStInfoSub: Subscription;
  getNewsSub: Subscription;
  getRatiosTtmInfoSub: Subscription;
  getEnterpriseValuesInfoSub: Subscription;
  getQuoteInfoSub: Subscription;
  getRatingInfoSub: Subscription;
  updatePortfoliosSub: Subscription;
  getSecFilingsInfoSub: Subscription;
  getPressReleasesInfoSub: Subscription;

  public lineChartColors: any[] = [
    {
      backgroundColor: 'rgba(256,256,256,0.2)',
      borderColor: 'rgba(256,256,256,0.5)'
    }
  ];
  public priceChartColors: any[] = [
    {
      backgroundColor: 'rgba(27, 0, 256, 0.7)'
    }
  ];

  public returnNetChartColors: any[] = [
    {
      backgroundColor: ["#1bd4a6", "#e6be3f", "#1bd4a6", "#e6be3f", "#1bd4a6"]
    }
  ];
  public lineChartOptions = {
    legend: { display: false },
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 10,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  };

  public dividendLineChartOptions = {
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          return tooltipItems.yLabel + '%';
        }
      }
    },
    legend: { display: false },
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 10,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  };

  public priceChartOptions = {
    legend: { display: false },
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'year'
        }
      }]
    }
  };
  // public lineChartLabels = [];
  public priceChartLabels = [];
  public returnNetChartLabels = [];
  public lineChartType = 'line';
  public priceChartType = 'line';
  public returnNetChartType = 'bar';
  // public revenueLineChartData = [
  //   { data: [] }
  // ];
  // public epsLineChartData = [
  //   { data: [] }
  // ];
  // public dividentLineChartData = [
  //   { data: [] }
  // ];
  // public bookValueLineChartData = [
  //   { data: [] }
  // ];
  public revenueLineChartState = false;
  public dYieldLineChartState = false;
  public revenueChartData: any = [];
  public epsChartData: any = [];
  public dividendYieldChartData = [];
  public peRatioYieldChartData = [];

  public roaceChartData: any = [];
  public valuationChartData: any = [];
  public leverageChartData: any = [];
  public priceChartData = [
    { data: [] }
  ];
  public returnNetROEChartData = [
    { data: [] }
  ];
  public returnNetROCEChartData = [
    { data: [] }
  ];
  public returnNetROAChartData = [
    { data: [] }
  ];
  public returnNetNPMChartData = [
    { data: [] }
  ];

  public rnnChartData = {
    revenue: [],
    netIncome: [],
    npm: [],
    year: []
  }

  public dyDPRChartData: any = [];
  public debtToEquityChartData: any = [];
  public currentRatioChartData: any = [];
  public iCoverageChartData: any = [];
  public quickRatioChartData: any = [];
  public debtToEquityValue: any = 0;
  public currentRatioValue: any = 0;
  public iCoverageValue: any = 0;
  public quickRatioValue: any = 0;
  public pERatioData: any = [];
  public eBRatioData: any = [];
  public priceToBookValueData: any = [];
  public priceToCashFlowData: any = [];
  public avgPERatio: any = 0;
  public avgEBRatio: any = 0;
  public avgPBV: any = 0;
  public avgPCF: any = 0;
  public allHistoRespCompleted = 0;
  public stockReturns: any = [];
  public ratingInfo: any = {};
  public ratingValue: any = 0;
  public secFilings: any = [];
  public pressReleases: any = [];

  public growthData: any = {
    revenueGrowth: {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    },
    netProfitGrowth: {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    },
    shareholderGrowth: {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    },
    dividendGrowth: {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    }
  }

  private chart: am4charts.XYChart;
  // allows for loading with any symbol
  /*  @Input() symbol: string = '';
    settings: any = {};
    // id for being able to check for errors using postMessage
    widgetId: string = '';
 
    // wanted to be able to hide the widget if the symbol passed in was invalid (don't love their sad cloud face)
    @ViewChild( 'containerDiv', { static: false } ) containerDiv: ElementRef;*/


  constructor(public dataService: DataService,
    public globalService: GlobalService,
    public router: ActivatedRoute,
    public route: Router, @Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

  ngOnInit() {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }

    this.globalService.isRnnChartDataReady = 0;
    const fromDate = this.formatDate(new Date());
    const oneMonthDate = this.formatDate(new Date().setDate(new Date().getDate() - 30));
    const sixMonthsDate = this.formatDate(new Date().setDate(new Date().getDate() - 182));
    const oneYearDate = this.formatDate(new Date().setDate(new Date().getDate() - 365));
    const threeYearDate = this.formatDate(new Date().setDate(new Date().getDate() - 1095));
    const fiveYearDate = this.formatDate(new Date().setDate(new Date().getDate() - 1827));
    this.subRouteChange = this.router.params.subscribe(params => {
      if (params.id != undefined) {
        this.stockId = params.id;
        // this.symbol = params.id;
        this.getProfileInfo(params.id);
        this.getRatingInfo(params.id);
        this.getRatiosTtmInfo(params.id);
        this.getQuoteInfo(params.id);
        this.getEnterpriseValuesInfo(params.id);
        this.getRevenueAndEpsInfo(params.id);
        this.getBookValueInfo(params.id);
        this.getPriceChartInfo(params.id);
        this.getReturnNetInfo(params.id);
        this.getFinancialGrowthInfo(params.id);
        // this.getFinancialGrowthInfo2(params.id);
        this.getBalSheetStInfo(params.id);
        this.getCashFlowStInfo(params.id);
        this.getNewsInfo(params.id);
        this.getSecFilings(params.id);
        this.getPressReleases(params.id);
        this.getStockReturns('oneMonth', params.id, oneMonthDate, fromDate);
        const _self = this;
        setTimeout(function () {
          _self.getStockReturns('sixMonth', params.id, sixMonthsDate, fromDate);
        }, 500);
        setTimeout(function () {
          _self.getStockReturns('oneYear', params.id, oneYearDate, fromDate);
        }, 1000);
        setTimeout(function () {
          _self.getStockReturns('threeYear', params.id, threeYearDate, fromDate);
        }, 1500);
        setTimeout(function () {
          _self.getStockReturns('fiveYear', params.id, fiveYearDate, fromDate);
        }, 2000);
        // this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      }
    });
    // $('[data-toggle="tooltip"]').tooltip();

  }

  /*ngAfterViewInit() {
    // need to do this in AfterViewInit because of the Input
    setTimeout( () => {
      this.widgetId = `${ this.symbol }_fundamnetals`;

      // postMessage listener for handling errors
      if ( window.addEventListener ) {
        window.addEventListener( 'message', ( e: any ) => {
            if ( e && e.data ) {
              console.log( e );
              const payload = e.data;
              // if the frameElementId is from this component, the symbol was no good and we should hide the widget
              if ( payload.name === 'tv-widget-no-data' && payload.frameElementId === this.widgetId ) {
                this.containerDiv.nativeElement.style.display = 'none';
              }
            }
          },
          false,
        );
      }


      this.settings = {
        interval: "1m",
        width: 425,
        isTransparent: false,
        height: 450,
        symbol: this.symbol,
        showIntervalTabs: true,
        locale: "en",
        colorTheme: "light"
      };
      const script = document.createElement( 'script' );
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.id = this.widgetId;
      script.innerHTML = JSON.stringify( this.settings );
      this.containerDiv.nativeElement.appendChild( script );
     /* const brandingDiv = document.createElement( 'div' );
     brandingDiv.innerHTML = `
    <div class="tradingview-widget-copyright">
    <a href="https://www.tradingview.com/symbols/${ this.symbol }/" rel="noopener" target="_blank">
    <span class="blue-text">${ this.symbol } Fundamental Data</span></a>
              by TradingView
          </div>
`;

    } );
  }*/

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  public getNum(inputVal) {
    if (inputVal > 0) {
      return range(0, inputVal);
    } else {
      return [];
    }
  }

  public formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  public convertDate(date) {
    const returnDate = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[returnDate.getMonth()] + ' ' + returnDate.getDate() + ', ' + returnDate.getFullYear();
  }

  public getDatesFromData(data) {
    return map(map(data, 'date'), this.convertDate);
  }

  public getValuesFromData(data, key) {
    return map(map(data, key), this.globalService.numDifferentiation);
  }

  public generateFsChartData(data, keyValuePair) {
    const _self = this;
    let convertedData = [];
    forEach(data, function (o) {
      let newRec = {};
      newRec["year"] = o.date.substring(0, 4);
      forEach(keyValuePair, function (x) {
        newRec[x.key] = o[x.key];
      });
      convertedData.push(newRec);
    });
    return convertedData;
  }

  public getProfileInfo(stockId) {
    this.globalService.loaderState = true;
    this.profileBtnState = false;
    this.profileState = false;
    this.profileInfoSub = this.dataService.getProfileInfo(stockId).subscribe((res: any) => {
      this.globalService.loaderState = false;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.profileState = true;
        res[0].description = res[0].description ? res[0].description : '';
        this.profileInfo = res[0];
        this.profileInfo.price = (this.profileInfo.price).toFixed(2);
        this.getSimilarStocks(res[0].exchangeShortName, res[0].sector.trim(), res[0].symbol);
        const todayDate = this.formatDate(new Date());
        this.getSectorPE(res[0].exchangeShortName, todayDate, res[0].sector);
        this.marketCap = this.globalService.numDifferentiation(this.profileInfo.mktCap).value + '' + this.globalService.numDifferentiation(this.profileInfo.mktCap).curDetect;
        this.keyMetrics.marketCap = this.marketCap;
        this.keyMetrics.website = this.profileInfo.website;
        const activityObj = {
          symbol: this.profileInfo.symbol,
          name: this.profileInfo.companyName
        }
        this.profileInfo.percentage = ((this.profileInfo.changes / this.profileInfo.price) * 100).toFixed(1);
        this.globalService.addToActivity(activityObj);
        this.profileBtnState = this.isPortfolioExists(res[0].symbol);
      }
    });
  }

  public isPortfolioExists(symbol) {
    let stateValue = false;
    const matched = findIndex(this.globalService.portfolios, { symbol: symbol });
    if (matched == -1) {
      stateValue = true;
    }
    return stateValue;
  }

  public getRatingInfo(stockId) {
    this.ratingInfoState = false;
    this.getRatingInfoSub = this.dataService.getRatingInfo(stockId).subscribe((res: any) => {
      this.ratingInfoState = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.ratingInfo = res[0];
        this.ratingValue = this.ratingInfo.ratingScore;
      }
    });
  }

  public getRatiosTtmInfo(stockId) {
    this.getRatiosTtmInfoSub = this.dataService.getRatiosTtmInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null) {
        this.keyMetrics.priceToBookValue = (res[0] && res[0].priceToBookRatioTTM ? res[0].priceToBookRatioTTM : 0).toFixed(2);
        this.keyMetrics.pERatio = (res[0] && res[0].peRatioTTM ? res[0].peRatioTTM : 0).toFixed(2);
        this.keyMetrics.eVtoEBITDA = (res[0] && res[0].ebitPerRevenueTTM ? res[0].ebitPerRevenueTTM : 0).toFixed(2);
      }
    });
  }

  public getQuoteInfo(stockId) {
    this.getQuoteInfoSub = this.dataService.getQuoteInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.keyMetrics.outstandingShares = res[0].sharesOutstanding;
        this.keyMetrics.val52WeekHigh = res[0].yearHigh;
        this.keyMetrics.val52WeekLow = res[0].yearLow;
      }
    });
  }

  public getEnterpriseValuesInfo(stockId) {
    this.getEnterpriseValuesInfoSub = this.dataService.getEnterpriseValuesInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.keyMetrics.enterpriseValue = this.globalService.numDifferentiation(res[0].enterpriseValue ? res[0].enterpriseValue : 0).value + ' ' + this.globalService.numDifferentiation(res[0].enterpriseValue ? res[0].enterpriseValue : 0).curDetect;
      }
    });
  }

  public getSectorPE(exchange, date, sector) {
    let result = "-";
    this.getEnterpriseValuesInfoSub = this.dataService.getSectorPEInfo(exchange, date).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        res.forEach(o => {
          if (sector == o.sector) {
            result = Number(o.pe).toFixed(2);
          }
        });
        this.keyMetrics.sectorPE = result;
      }
    });
  }

  public getSimilarStocks(exchange, sector, symbol) {
    this.similarStocksState = false;
    this.stocks = [];
    sector = sector.replace(" ", "_");
    this.getSimilarStocksSub = this.dataService.getSimilarStocks(exchange, sector).subscribe((res: any) => {
      this.similarStocksState = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocks = filter(res, function (o) { return o.symbol !== symbol; });
      }
    });
  }

  public getRevenueAndEpsInfo(stockId) {
    // this.showRevenueEpsChart = false;
    // this.lineChartLabels = [];
    // this.revenueLineChartData[0].data = [];
    // this.epsLineChartData[0].data = [];
    this.revenueLineChartState = false;
    this.revenueChartData = [];
    this.epsChartData = [];
    this.rnnChartData.revenue = [];
    this.rnnChartData.netIncome = [];
    this.rnnChartData.year = [];
    const _self = this;
    this.getRevenueInfoSub = this.dataService.getIncomeStatYearlyInfo(stockId).subscribe((res: any) => {
      // this.showRevenueEpsChart = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.keyMetrics.ePS = (res[0].eps ? res[0].eps : 0).toFixed(2);
        this.revenueAndEpsInfo = reverse(res);
        this.fsIncomeStTableData = cloneDeep(res);
        if (this.fsIncomeStTableData.length === 6) {
          this.fsIncomeStTableData.shift();
        }
        this.initFinSummaryChart('fsIncomeStChart', this.fsIncomeStTableData, [{ name: 'Total Revenue', key: "revenue" }, { name: 'Net Income', key: "netIncome" }]);
        if (this.revenueAndEpsInfo && this.revenueAndEpsInfo.length > 0) {
          this.revenueCurrent = this.globalService.numDifferentiation(this.revenueAndEpsInfo[this.revenueAndEpsInfo.length - 1].revenue);
          this.revenueCurrent.value = this.revenueCurrent.value;
          this.epsCurrent = this.revenueAndEpsInfo[this.revenueAndEpsInfo.length - 1].eps.toFixed(2);
          forEach(this.revenueAndEpsInfo, function (o) {
            // _self.lineChartLabels.push(o.date.substring(0, 4));
            // _self.revenueLineChartData[0].data.push(parseInt(o.revenue.toString().substring(0, 6)));
            // _self.epsLineChartData[0].data.push(parseInt(o.eps.toString().substring(0, 4)));
            _self.revenueChartData.push({ "year": o.date.substring(0, 4), "value": o.revenue });
            _self.epsChartData.push({ "year": o.date.substring(0, 4), "value": o.eps.toFixed(2) });
            _self.rnnChartData.netIncome.push(o.netIncome);
            _self.rnnChartData.revenue.push(o.revenue);
            _self.rnnChartData.year.push(o.date.substring(0, 4));
          });
          this.globalService.isRnnChartDataReady = this.globalService.isRnnChartDataReady + 1;
          if (this.globalService.isRnnChartDataReady >= 2) {
            this.initRNNChart(this.rnnChartData);
          }
        }
        this.generatePLData(this.fsIncomeStTableData);
        this.revenueLineChartState = true;
      }
    });
  }

  public generateElementsData(data, elements, additionalStr) {
    const allKeys = xor(Object.keys(data[0]), elements);
    let result = [];
    allKeys.forEach(val => {
      result.push({
        name: startCase(val),
        eleId: additionalStr + val,
        propId: val,
        data: []
      })
    });
    return result;
  }
  public generatePLData(data) {
    this.pLElements = this.renderStatementData(this.generateElementsData(data, this.elements1, 'pL'), data);
  }

  public generateBalSheetData(data) {
    this.balSheetElements = this.renderStatementData(this.generateElementsData(data, this.elements1, 'bL'), data);
  }

  public generateCashFlowData(data) {
    this.cashFlowElements = this.renderStatementData(this.generateElementsData(data, this.elements1, 'cF'), data);
  }

  public renderStatementData(refs, data) {
    const _self = this;
    forEach(refs, function (ref) {
      forEach(data, function (o) {
        ref.data.push({ date: o.date.substring(0, 4), value: _self.globalService.numDifferentiation(o[ref.propId]).value + _self.globalService.numDifferentiation(o[ref.propId]).curDetect });
      });
    });
    return refs;
  }

  public getBookValueInfo(stockId) {
    // this.showBookValueChart = false;
    // this.showDividendChart = false;
    // this.bookValueLineChartData[0].data = [];
    // this.dividentLineChartData[0].data = [];
    this.dYieldLineChartState = false;
    this.dividendYieldChartData = [];
    this.peRatioYieldChartData = [];
    const _self = this;
    this.getBookValueInfoSub = this.dataService.getBookValueInfo(stockId).subscribe((res: any) => {
      // this.showBookValueChart = true;
      // this.showDividendChart = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.keyMetrics.dividendYield = ((res[0].dividendYield ? res[0].dividendYield : 0) * 100).toFixed(2);
        this.keyMetrics.bookValue = (res[0].bookValuePerShare ? res[0].bookValuePerShare : 0).toFixed(2);
        this.bookValueInfo = reverse(res);
        if (this.bookValueInfo) {
          forEach(this.bookValueInfo, function (o) {
            // _self.bookValueLineChartData[0].data.push(parseInt((o.peRatio ? o.peRatio : 0).toString().substring(0, 2)));
            // _self.dividentLineChartData[0].data.push(((o.dividendYield ? o.dividendYield : 0) * 100).toFixed(2));
            _self.dividendYieldChartData.push({ "year": o.date.substring(0, 4), "value": ((o.dividendYield ? o.dividendYield : 0) * 100).toFixed(2) });
            _self.peRatioYieldChartData.push({ "year": o.date.substring(0, 4), "value": parseInt((o.peRatio ? o.peRatio : 0).toString().substring(0, 2)) });
          });
          this.dYieldLineChartState = true;
        }
      }
    });
  }

  public getPriceChartInfo(stockId) {
    this.showPriceChart = false;
    this.priceChartLabels = [];
    this.priceChartData[0].data = [];
    const _self = this;
    this.getPriceChartInfoSub = this.dataService.getPriceChartInfo(stockId).subscribe((res: any) => {
      this.showPriceChart = true;
      res = JSON.parse(res);
      if (res !== null) {
        this.priceChartInfo = reverse(res["historical"]);
        if (this.priceChartInfo) {
          let data = [];
          forEach(this.priceChartInfo, function (o) {
            // _self.priceChartLabels.push(o.date.toString());
            // _self.priceChartData[0].data.push(o.close.toFixed(2));
            data.push({ date: new Date(o.date), value: o.close.toFixed(2), valueLow: o.low.toFixed(2), valueHigh: o.high.toFixed(2) });

          });
          this.initPriceChart(data);
        }
      }
    });
  }

  public initPriceChart(chartData) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("priceChart", am4charts.XYChart);

      chart.paddingRight = 20;
      chart.data = chartData;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "Close: {valueY.value}";

      let seriesLow = chart.series.push(new am4charts.LineSeries());
      seriesLow.dataFields.dateX = "date";
      seriesLow.dataFields.valueY = "valueLow";
      seriesLow.tooltipText = "Low: {valueY.value}";
      seriesLow.stroke = am4core.color("#F0B41A");

      let seriesHigh = chart.series.push(new am4charts.LineSeries());
      seriesHigh.dataFields.dateX = "date";
      seriesHigh.dataFields.valueY = "valueHigh";
      seriesHigh.tooltipText = "High: {valueY.value}";
      seriesHigh.stroke = am4core.color("#3ab643");

      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });
  }

  public initRNNChart(chartData) {
    let data = [];
    if (chartData.year.length > 0) {
      const _self = this;
      forEach(chartData.year, function (o, i) {
        // data.push({ "year": o, "revenue": _self.globalService.numDifferentiation(chartData.revenue[i]).value, "npm": chartData.npm[i], "net_income": _self.globalService.numDifferentiation(chartData.netIncome[i]).value });
        data.push({ "year": o, "revenue": chartData.revenue[i], "npm": chartData.npm[i], "net_income": chartData.netIncome[i] });
      });
    } else {
      console.log("RNN Chart data is empty!!!");
      return;
    }
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("rnnChart", am4charts.XYChart);
      chart.colors.list = [
        am4core.color("#55E055"),
        am4core.color("#6794DC"),
        am4core.color("#FDD400")
      ];

      /* Create axes */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;

      /* Create value axis */
      let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
      // chart.numberFormatter.numberFormat = "#.";
      valueAxis1.numberFormatter.numberFormat = "#.#a";
      valueAxis1.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
      ];

      // valueAxis1.min = 0;

      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis2.min = 0;
      valueAxis2.syncWithAxis = valueAxis1;
      valueAxis2.renderer.opposite = true;
      valueAxis2.numberFormatter = new am4core.NumberFormatter();
      valueAxis2.numberFormatter.numberFormat = "#.##";

      /* Create series */
      let columnSeries1 = chart.series.push(new am4charts.ColumnSeries());
      columnSeries1.name = "Revenue";
      columnSeries1.dataFields.valueY = "revenue";
      columnSeries1.dataFields.categoryX = "year";

      columnSeries1.columns.template.tooltipText = "[#000 font-size: 12px]{name}:\n[/][#000 font-size: 13px]{valueY}[/] [#000]{additional}[/]"
      columnSeries1.columns.template.propertyFields.fillOpacity = "fillOpacity";
      columnSeries1.columns.template.propertyFields.stroke = "stroke";
      columnSeries1.columns.template.propertyFields.strokeWidth = "strokeWidth";
      columnSeries1.columns.template.propertyFields.strokeDasharray = "columnDash";
      columnSeries1.columns.template.width = am4core.percent(46);
      columnSeries1.tooltip.label.textAlign = "middle";

      /* Create series */
      let columnSeries2 = chart.series.push(new am4charts.ColumnSeries());
      columnSeries2.name = "Net Income";
      columnSeries2.dataFields.valueY = "net_income";
      columnSeries2.dataFields.categoryX = "year";

      columnSeries2.columns.template.tooltipText = "[#000 font-size: 12px]{name}:\n[/][#000 font-size: 13px]{valueY}[/] [#000]{additional}[/]"
      columnSeries2.columns.template.propertyFields.fillOpacity = "fillOpacity";
      columnSeries2.columns.template.propertyFields.stroke = "stroke";
      columnSeries2.columns.template.propertyFields.strokeWidth = "strokeWidth";
      columnSeries2.columns.template.propertyFields.strokeDasharray = "columnDash";
      columnSeries2.columns.template.width = am4core.percent(24);
      columnSeries2.tooltip.label.textAlign = "middle";
      // columnSeries2.fill = am4core.color("#5a5");
      columnSeries2.clustered = false;

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "NPM";
      lineSeries.dataFields.valueY = "npm";
      lineSeries.dataFields.categoryX = "year";

      // lineSeries.stroke = am4core.color("#fdd400");
      lineSeries.strokeWidth = 3;
      lineSeries.propertyFields.strokeDasharray = "lineDash";
      lineSeries.tooltip.label.textAlign = "middle";
      lineSeries.tensionX = 0.77;
      lineSeries.yAxis = valueAxis2;

      let bullet = lineSeries.bullets.push(new am4charts.Bullet());
      // bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
      bullet.tooltipText = "[#000 font-size: 12px]{name}:\n[/][#000 font-size: 13px]{valueY.formatNumber('#.##')}[/] [#000]{additional}[/]"
      let circle = bullet.createChild(am4core.Circle);
      circle.radius = 4;
      circle.fill = am4core.color("#000");
      circle.strokeWidth = 3;

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(lineSeries);
      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      chart.cursor = new am4charts.XYCursor();
      //add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = "top";
      chart.data = data;
    });
  }

  public initDyDPRChart(chartData) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("dyDprChart", am4charts.XYChart);
      chart.colors.list = [
        am4core.color("#6794DC"),
        am4core.color("#FDD400")
      ];

      /* Create axes */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.fontSize = "12px";

      /* Create value axis */
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.min = 0;

      /* Create series */
      let columnSeries1 = chart.series.push(new am4charts.ColumnSeries());
      columnSeries1.name = "Dividend Yield";
      columnSeries1.dataFields.valueY = "dividendYield";
      columnSeries1.dataFields.categoryX = "year";

      columnSeries1.columns.template.tooltipText = "[#000 font-size: 12px]{name}:\n[/][#000 font-size: 13px]{valueY}[/] [#000]{additional}[/]"
      columnSeries1.columns.template.propertyFields.fillOpacity = "fillOpacity";
      columnSeries1.columns.template.propertyFields.stroke = "stroke";
      columnSeries1.columns.template.propertyFields.strokeWidth = "strokeWidth";
      columnSeries1.columns.template.propertyFields.strokeDasharray = "columnDash";
      columnSeries1.tooltip.label.textAlign = "middle";

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "Dividend Payouts";
      lineSeries.dataFields.valueY = "dividendPayoutRatio";
      lineSeries.dataFields.categoryX = "year";

      // lineSeries.stroke = am4core.color("#fdd400");
      lineSeries.strokeWidth = 3;
      lineSeries.propertyFields.strokeDasharray = "lineDash";
      lineSeries.tooltip.label.textAlign = "middle";

      let bullet = lineSeries.bullets.push(new am4charts.Bullet());
      // bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
      bullet.tooltipText = "[#000 font-size: 12px]{name}:\n[/][#000 font-size: 13px]{valueY}[/] [#000]{additional}[/]"
      let circle = bullet.createChild(am4core.Circle);
      circle.radius = 4;
      circle.fill = am4core.color("#000");
      circle.strokeWidth = 3;

      var labelBullet = lineSeries.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.label.dy = 20;

      var labelBulletLine = columnSeries1.bullets.push(new am4charts.LabelBullet());
      labelBulletLine.label.text = "{valueY}";
      labelBulletLine.label.dy = -20;

      chart.data = chartData;
    });
  }

  // public initBarChart(chartDiv, data, name) {
  //   // Chart code goes in here
  //   this.browserOnly(() => {
  //     am4core.useTheme(am4themes_animated);

  //     let chart = am4core.create(chartDiv, am4charts.XYChart);
  //     if (chartDiv === "pERatio") {
  //       chart.colors.list = [
  //         am4core.color("#1bd4a6")
  //       ];
  //     }
  //     if (chartDiv === "eBRatio") {
  //       chart.colors.list = [
  //         am4core.color("#e6be3f")
  //       ];
  //     }
  //     if (chartDiv === "priceToBookValue") {
  //       chart.colors.list = [
  //         am4core.color("#1bd4a6")
  //       ];
  //     }
  //     if (chartDiv === "priceToCashFlow") {
  //       chart.colors.list = [
  //         am4core.color("#e6be3f")
  //       ];
  //     }

  //     /* Create axes */
  //     let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //     categoryAxis.dataFields.category = "year";

  //     /* Create value axis */
  //     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //     // valueAxis.min = 0;

  //     /* Create series */
  //     let columnSeries1 = chart.series.push(new am4charts.ColumnSeries());
  //     columnSeries1.name = name;
  //     columnSeries1.dataFields.valueY = "value";
  //     columnSeries1.dataFields.categoryX = "year";

  //     columnSeries1.columns.template.tooltipText = "[#fff font-size: 12px]{name}:\n[/][#fff font-size: 13px]{valueY}[/] [#fff]{additional}[/]"
  //     columnSeries1.columns.template.propertyFields.fillOpacity = "fillOpacity";
  //     columnSeries1.columns.template.propertyFields.stroke = "stroke";
  //     columnSeries1.columns.template.propertyFields.strokeWidth = "strokeWidth";
  //     columnSeries1.columns.template.propertyFields.strokeDasharray = "columnDash";
  //     columnSeries1.tooltip.label.textAlign = "middle";
  //     chart.data = data;
  //   });
  // }

  public initFinSummaryChart(chartDiv, data, keyValuePair) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create(chartDiv, am4charts.XYChart);
      chart.colors.list = [
        am4core.color("#67B7DC"),
        am4core.color("#6794DC")
      ];
      // const colors = ["#F0B41A", "#3ab643", "#6771DC", "#1adcf0"];
      chart.numberFormatter.numberFormat = "#.a";
      chart.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
      ];

      /* Create axes */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 1;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.fontSize = "12px";

      /* Create value axis */
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.fontSize = "12px";
      // valueAxis.min = 0;

      /* Create series */
      forEach(keyValuePair, function (o) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = o.name;
        series.dataFields.valueY = o.key;
        series.dataFields.categoryX = "year";
        series.columns.template.width = am4core.percent(100);
        series.columns.template.tooltipText = "[#fff font-size: 12px]{name}:\n[/][#fff font-size: 13px]{valueY}[/] [#fff]{additional}[/]";
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "[#000 font-size: 10px]{valueY}";
        labelBullet.label.dy = -10;
        // labelBullet.label.rotation = 270;
        // labelBullet.label.truncate = false;
        // series.columns.template.width = am4core.percent(80);
      });

      chart.data = this.generateFsChartData(data, keyValuePair);
    });
  }

  // initLeLiCharts(chartDiv, data) {
  //   this.browserOnly(() => {
  //     am4core.useTheme(am4themes_animated);
  //     let chart = am4core.create(chartDiv, am4charts.XYChart);
  //     chart.data = data;
  //     if (chartDiv === "debtToEquity") {
  //       chart.colors.list = [
  //         am4core.color("#1bd4a6")
  //       ];
  //     }
  //     if (chartDiv === "currentRatio") {
  //       chart.colors.list = [
  //         am4core.color("#e6be3f")
  //       ];
  //     }
  //     if (chartDiv === "interestCoverageRatio") {
  //       chart.colors.list = [
  //         am4core.color("#1bd4a6")
  //       ];
  //     }
  //     if (chartDiv === "quickRatio") {
  //       chart.colors.list = [
  //         am4core.color("#e6be3f")
  //       ];
  //     }
  //     let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //     categoryAxis.renderer.grid.template.disabled = true;
  //     categoryAxis.dataFields.category = "year";
  //     categoryAxis.startLocation = 0.5;
  //     categoryAxis.endLocation = 0.5;
  //     categoryAxis.renderer.inside = true;
  //     categoryAxis.opacity = 0;

  //     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //     valueAxis.renderer.grid.template.strokeOpacity = 0;
  //     // valueAxis.min = 0;
  //     valueAxis.renderer.inside = true;
  //     valueAxis.opacity = 0;

  //     let lineSeries = chart.series.push(new am4charts.LineSeries());
  //     lineSeries.dataFields.categoryX = "year";
  //     lineSeries.dataFields.valueY = "value";
  //     lineSeries.fillOpacity = 0.5;
  //     lineSeries.strokeWidth = 3;
  //     let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
  //     bullet.tooltipText = "[#000 font-size: 12px]{categoryX} [#fff font-size: 12px]{valueY}"
  //     bullet.circle.radius = 3;
  //     bullet.circle.fill = am4core.color("#fff");
  //     bullet.circle.strokeWidth = 3;
  //     // bullet.circle.dx = -5;

  //     chart.paddingLeft = 0;
  //     chart.paddingRight = 0;
  //   });
  // }

  getReturnNetInfo(stockId) {
    this.showReturnNetChart = false;
    this.returnNetChartLabels = [];
    this.returnNetROEChartData[0].data = [];
    this.returnNetROCEChartData[0].data = [];
    this.returnNetROAChartData[0].data = [];
    this.returnNetNPMChartData[0].data = [];
    this.rnnChartData.npm = [];
    this.dyDPRChartData = [];
    this.debtToEquityChartData = [];
    this.currentRatioChartData = [];
    this.iCoverageChartData = [];
    this.quickRatioChartData = [];
    this.pERatioData = [];
    this.eBRatioData = [];
    this.priceToBookValueData = [];
    this.priceToCashFlowData = [];
    this.roaceChartData = [];
    this.valuationChartData = [];
    this.leverageChartData = [];
    let roeData = [];
    let roceData = [];
    let roaData = [];
    let netNPMData = [];

    const _self = this;
    this.getReturnNetInfoSub = this.dataService.getReturnNetInfo(stockId).subscribe((res: any) => {
      this.showReturnNetChart = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.keyMetrics.rOE = (res[0].returnOnEquity ? res[0].returnOnEquity : 0 * 100).toFixed(2);
        this.keyMetrics.rOCE = (res[0].returnOnCapitalEmployed ? res[0].returnOnCapitalEmployed : 0 * 100).toFixed(2);
        this.keyMetrics.fairValue = (res[0].priceFairValue ? res[0].priceFairValue : 0).toFixed(2);

        this.returnNetChartInfo = reverse(res);
        if (this.returnNetChartInfo) {
          forEach(this.returnNetChartInfo, function (o) {
            _self.returnNetChartLabels.push(o.date.substring(0, 4));
            _self.returnNetROEChartData[0].data.push((o.returnOnEquity * 100).toFixed(2));
            _self.returnNetROCEChartData[0].data.push((o.returnOnCapitalEmployed * 100).toFixed(2));
            _self.returnNetROAChartData[0].data.push((o.returnOnAssets * 100).toFixed(2));
            _self.returnNetNPMChartData[0].data.push(((o.netProfitMargin ? o.netProfitMargin : 0) * 100).toFixed(2));
            // _self.rnnChartData.npm.push((o.netProfitMargin ? o.netProfitMargin : 0).toFixed(4) * 100);
            _self.rnnChartData.npm.push(o.netProfitMargin ? o.netProfitMargin : 0);
            roeData.push({ year: o.date.substring(0, 4), value: (o.returnOnEquity * 100).toFixed(2) });
            roceData.push({ year: o.date.substring(0, 4), value: (o.returnOnCapitalEmployed * 100).toFixed(2) });
            roaData.push({ year: o.date.substring(0, 4), value: (o.returnOnAssets * 100).toFixed(2) });
            netNPMData.push({ year: o.date.substring(0, 4), value: ((o.netProfitMargin ? o.netProfitMargin : 0) * 100).toFixed(2) });
            _self.dyDPRChartData.push({ year: o.date.substring(0, 4), dividendPayoutRatio: (o.dividendPayoutRatio ? o.dividendPayoutRatio : 0).toFixed(2), dividendYield: (o.dividendYield ? o.dividendYield : 0).toFixed(2) });
            _self.debtToEquityChartData.push({ year: o.date.substring(0, 4), value: (o.debtEquityRatio ? o.debtEquityRatio : 0).toFixed(2) });
            _self.currentRatioChartData.push({ year: o.date.substring(0, 4), value: (o.currentRatio ? o.currentRatio : 0).toFixed(2) });
            _self.iCoverageChartData.push({ year: o.date.substring(0, 4), value: (o.interestCoverage ? o.interestCoverage : 0).toFixed(2) });
            _self.quickRatioChartData.push({ year: o.date.substring(0, 4), value: (o.quickRatio ? o.quickRatio : 0).toFixed(2) });
            _self.pERatioData.push({ year: o.date.substring(0, 4), value: (o.priceEarningsRatio ? o.priceEarningsRatio : 0).toFixed(2) });
            _self.eBRatioData.push({ year: o.date.substring(0, 4), value: (o.enterpriseValueMultiple ? o.enterpriseValueMultiple : 0).toFixed(2) });
            _self.priceToBookValueData.push({ year: o.date.substring(0, 4), value: (o.priceToBookRatio ? o.priceToBookRatio : 0).toFixed(2) });
            _self.priceToCashFlowData.push({ year: o.date.substring(0, 4), value: (o.priceCashFlowRatio ? o.priceCashFlowRatio : 0).toFixed(2) });
          });
          this.debtToEquityValue = this.getLatestValue(this.debtToEquityChartData);
          this.currentRatioValue = this.getLatestValue(this.currentRatioChartData);
          this.iCoverageValue = this.getLatestValue(this.iCoverageChartData);
          this.quickRatioValue = this.getLatestValue(this.quickRatioChartData);
          this.avg3YrROE = this.avg3YrInPercent(this.returnNetROEChartData[0].data);
          this.avg3YrROCE = this.avg3YrInPercent(this.returnNetROCEChartData[0].data);
          this.avg3YrROA = this.avg3YrInPercent(this.returnNetROAChartData[0].data);
          this.avg3YrNPM = this.avg3YrInPercent(this.returnNetNPMChartData[0].data);
          this.globalService.isRnnChartDataReady = _self.globalService.isRnnChartDataReady + 1;
          if (this.globalService.isRnnChartDataReady >= 2) {
            this.initRNNChart(this.rnnChartData);
          }
          if (this.dyDPRChartData.length >= 3) {
            this.avgDividendYield = ((+this.dyDPRChartData[(this.dyDPRChartData.length) - 3].dividendYield + +this.dyDPRChartData[(this.dyDPRChartData.length) - 2].dividendYield + +this.dyDPRChartData[(this.dyDPRChartData.length) - 1].dividendYield) / 3).toFixed(2);
          }
          this.initDyDPRChart(this.dyDPRChartData);
          // this.initLeLiCharts('debtToEquity', this.debtToEquityChartData);
          // this.initLeLiCharts('currentRatio', this.currentRatioChartData);
          // this.initLeLiCharts('interestCoverageRatio', this.iCoverageChartData);
          // this.initLeLiCharts('quickRatio', this.quickRatioChartData);
          // this.initBarChart('pERatio', this.pERatioData, "PE Ratio");
          // this.initBarChart('eBRatio', this.eBRatioData, "EB/EBIDTA Ratio");
          // this.initBarChart('priceToBookValue', this.priceToBookValueData, "Price To Book Value");
          // this.initBarChart('priceToCashFlow', this.priceToCashFlowData, "Price To Cash Flow");
          this.avgPERatio = this.getAvgValue(this.pERatioData, 3);
          this.avgEBRatio = this.getAvgValue(this.eBRatioData, 3);
          this.avgPBV = this.getAvgValue(this.priceToBookValueData, 3);
          this.avgPCF = this.getAvgValue(this.priceToCashFlowData, 3);

          this.roaceChartData = [{
            "category": "ROE",
            "value": this.avg3YrROE,
            "color": am4core.color("#67B7DC"),
            "breakdown": roeData,
            "toolTip": "ROE this ratio calculates how much money is made based on the investors' investment in the company.investors want to see a high return on equity ratio because this indicates that the company is using its investors' funds effectively."
          }, {
            "category": "ROCE",
            "value": this.avg3YrROCE,
            "color": am4core.color("#FDD400"),
            "breakdown": roceData,
            "toolTip": "ROCE shows investors how many dollars in profits each dollar of capital employed generates."
          }, {
            "category": "ROA",
            "value": this.avg3YrROA,
            "color": am4core.color("#6794DC"),
            "breakdown": roaData,
            "toolTip": "ROA Return on assets gives an indication of the capital intensity of the company, which will depend on the industry; companies that require large initial investments will generally have lower return on assets. ROAs over 5% are generally considered good."
          }, {
            "category": "Net Profit Margin",
            "value": this.avg3YrNPM,
            "color": am4core.color("#55E055"),
            "breakdown": netNPMData,
            "toolTip": "Generally, a net profit margin in excess of 10% is considered excellent, though it depends on the industry and the structure of the business."
          }];
          this.valuationChartData = [{
            "category": "PE Ratio",
            "value": this.avgPERatio,
            "color": am4core.color("#67B7DC"),
            "breakdown": this.pERatioData,
            "toolTip": "The financial reporting of both companies and investment research services use a basic earnings per share (EPS) figure divided into the current stock price to calculate the P/E multiple (i.e. how many times a stock is trading (its price) per each dollar of EPS)."
          }, {
            "category": "EV/EBIDTA Ratio",
            "value": this.avgEBRatio,
            "color": am4core.color("#FDD400"),
            "breakdown": this.eBRatioData,
            "toolTip": "EV/EBITDA is the enterprise value of a company divided by its earnings before interest, taxes, depreciation and amortization."
          }, {
            "category": "Price To Book Value",
            "value": this.avgPBV,
            "color": am4core.color("#6794DC"),
            "breakdown": this.priceToBookValueData,
            "toolTip": "The price-to-book value ratio, expressed as a multiple (i.e. how many times a company's stock is trading per share compared to the company's book value per share), is an indication of how much shareholders are paying for the net assets of a company."
          }, {
            "category": "Price To Cash Flow",
            "value": this.avgPCF,
            "color": am4core.color("#55E055"),
            "breakdown": this.priceToCashFlowData,
            "toolTip": "The price/cash flow ratio is used by investors to evaluate the investment attractiveness, from a value standpoint, of a company's stock."
          }];
          this.leverageChartData = [{
            "category": "Debt To Equity",
            "value": this.debtToEquityValue,
            "color": am4core.color("#67B7DC"),
            "breakdown": this.debtToEquityChartData,
            "toolTip": ""
          }, {
            "category": "Current Ratio",
            "value": this.currentRatioValue,
            "color": am4core.color("#FDD400"),
            "breakdown": this.currentRatioChartData,
            "toolTip": ""
          }, {
            "category": "Interest Coverage Ratio",
            "value": this.iCoverageValue,
            "color": am4core.color("#6794DC"),
            "breakdown": this.iCoverageChartData,
            "toolTip": ""
          }, {
            "category": "Quick Ratio",
            "value": this.quickRatioValue,
            "color": am4core.color("#55E055"),
            "breakdown": this.quickRatioChartData,
            "toolTip": ""
          }];
        }
      }
    });
  }

  getAvgValue(data, averageValue) {
    let val: any = 0;
    if (data.length >= averageValue) {
      val = ((+data[(data.length) - 3].value + +data[(data.length) - 2].value + +data[(data.length) - 1].value) / averageValue).toFixed(2);
    }
    return val;
  }

  getLatestValue(data) {
    let val: any = 0;
    if (data.length >= 1) {
      val = data[(data.length) - 1].value;
    }
    return val;
  }

  avg3YrInPercent(data) {
    let val: any = 0;
    if (data.length >= 3) {
      val = ((+data[(data.length) - 3] + +data[(data.length) - 2] + +data[(data.length) - 1]) / 3).toFixed(2);
    }
    return val + '%';
  }

  getFinancialGrowthInfo(stockId) {
    this.growthDataState = false;
    this.growthData.revenueGrowth = {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    }
    this.growthData.netProfitGrowth = {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    }
    this.growthData.shareholderGrowth = {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    }
    this.growthData.dividendGrowth = {
      year3CAGR: '0%',
      year5CAGR: '0%',
      year10CAGR: '0%'
    }
    this.getFinancialGrowthInfoSub = this.dataService.getGrowthInfo(stockId).subscribe((res: any) => {
      let data: any = [];
      this.growthDataState = true;
      res = JSON.parse(res);
      if (res !== null && res.length >= 1) {
        data = res[0];
        this.growthData.revenueGrowth = {
          year3CAGR: ((data.threeYRevenueGrowthPerShare) * 100).toFixed(2) + '%',
          year5CAGR: ((data.fiveYRevenueGrowthPerShare) * 100).toFixed(2) + '%',
          year10CAGR: ((data.tenYRevenueGrowthPerShare) * 100).toFixed(2) + '%'
        }
        this.growthData.netProfitGrowth = {
          year3CAGR: ((data.threeYNetIncomeGrowthPerShare) * 100).toFixed(2) + '%',
          year5CAGR: ((data.fiveYNetIncomeGrowthPerShare) * 100).toFixed(2) + '%',
          year10CAGR: ((data.tenYNetIncomeGrowthPerShare) * 100).toFixed(2) + '%'
        }
        this.growthData.shareholderGrowth = {
          year3CAGR: ((data.threeYShareholdersEquityGrowthPerShare) * 100).toFixed(2) + '%',
          year5CAGR: ((data.fiveYShareholdersEquityGrowthPerShare) * 100).toFixed(2) + '%',
          year10CAGR: ((data.tenYShareholdersEquityGrowthPerShare) * 100).toFixed(2) + '%'
        }
        this.growthData.dividendGrowth = {
          year3CAGR: ((data.threeYDividendperShareGrowthPerShare) * 100).toFixed(2) + '%',
          year5CAGR: ((data.fiveYDividendperShareGrowthPerShare) * 100).toFixed(2) + '%',
          year10CAGR: ((data.tenYDividendperShareGrowthPerShare) * 100).toFixed(2) + '%'
        }
      }
    });
  }

  // getFinancialGrowthInfo2(stockId) {
  //   this.growthData.dividendGrowth = {
  //     year1CAGR: '0%',
  //     year3CAGR: '0%',
  //     year5CAGR: '0%'
  //   }
  //   this.getFinancialGrowthInfo2Sub = this.dataService.getFinancialGrowthInfo2(stockId).subscribe((res: any) => {
  //     let data: any = [];
  //     res = JSON.parse(res);
  //     if (res !== null) {
  //       data = res;
  //       if (data.length >= 5) {
  //         this.growthData.dividendGrowth = {
  //           year1CAGR: ((data[0].growthDividendsPaid)*100).toFixed(2) + '%',
  //           year3CAGR: ((data[2].growthDividendsPaid)*100).toFixed(2) + '%',
  //           year5CAGR: ((data[4].growthDividendsPaid)*100).toFixed(2) + '%'
  //         }
  //       }
  //     }
  //   });
  // }

  getSecFilings(stockId) {
    this.secFilingsState = false;
    this.getSecFilingsInfoSub = this.dataService.getSecFilings(stockId).subscribe((res: any) => {
      this.secFilingsState = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.secFilings = res;
      }
    });
  }

  getPressReleases(stockId) {
    this.getPressReleasesInfoSub = this.dataService.getPressReleases(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.pressReleases = res;
      }
    });
  }

  getBalSheetStInfo(stockId) {
    this.balSheetStState = false;
    this.getBalSheetStInfoSub = this.dataService.getBalSheetStatementInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      this.balSheetStState = true;
      if (res !== null && res[0]) {
        this.fsBalanceStTableData = cloneDeep(reverse(res));
        if (this.fsBalanceStTableData.length === 6) {
          this.fsBalanceStTableData.shift();
        }
        this.initFinSummaryChart('fsBalanceStChart', this.fsBalanceStTableData, [{ name: "Total Assets", key: "totalAssets" }, { name: "Total Liabilities", key: "totalLiabilities" }]);
        this.generateBalSheetData(this.fsBalanceStTableData);
      }
    });
  }

  getCashFlowStInfo(stockId) {
    this.cashFlowStState = false;
    this.getCashFlowStInfoSub = this.dataService.getCashFlowStatementInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      this.cashFlowStState = true;
      if (res !== null && res[0]) {
        this.fsCashStTableData = cloneDeep(reverse(res));
        if (this.fsCashStTableData.length === 6) {
          this.fsCashStTableData.shift();
        }
        this.initFinSummaryChart('fsCashStChart', this.fsCashStTableData, [{ name: "Cash", key: "freeCashFlow" }, { name: "Net Change In Cash", key: "netChangeInCash" }]);
        this.generateCashFlowData(this.fsCashStTableData);
      }
    });
  }

  public donloadAnnualReports() {
    // const url = this.globalService.rootPath + 'income-statement/' + this.stockId + '?datatype=csv&apikey=' + this.globalService.apiKey;
    const url = this.globalService.rootPath + 'income-statement/' + this.stockId + '?datatype=csv';
    window.open(url, "_blank");
  }

  getNewsInfo(stockId) {
    this.stockNewsState = false;
    this.stockNews = [];
    this.getNewsSub = this.dataService.getNewsInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      this.stockNewsState = true;
      if (res !== null) {
        this.stockNews = res;
      }
    });
  }

  public getStockReturns(targetVal, stockId, fromDate, toDate) {
    this.getStockReturnsSub = this.dataService.getHistoRangePriceInfo(stockId, fromDate, toDate).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null) {
        if (targetVal === 'oneMonth') {
          this.oneMonthStockReturns = this.calStockReturns(res);
          this.stockReturns.push({
            name: "1 Month Returns",
            value: this.oneMonthStockReturns
          });
        } else if (targetVal === 'sixMonth') {
          this.sixMonthsStockReturns = this.calStockReturns(res);
          this.stockReturns.push({
            name: "6 Months Returns",
            value: this.sixMonthsStockReturns
          });
        } else if (targetVal === 'oneYear') {
          this.oneYearStockReturns = this.calStockReturns(res);
          this.stockReturns.push({
            name: "1 Yr Returns",
            value: this.oneYearStockReturns
          });
        } else if (targetVal === 'threeYear') {
          this.threeYearStockReturns = this.calStockReturns(res);
          this.stockReturns.push({
            name: "3 Yr Returns",
            value: this.threeYearStockReturns
          });
        } else if (targetVal === 'fiveYear') {
          this.fiveYearStockReturns = this.calStockReturns(res);
          this.stockReturns.push({
            name: "5 Yr Returns",
            value: this.fiveYearStockReturns
          });
        }
        this.allHistoRespCompleted = this.allHistoRespCompleted + 1;
      } else {
        this.allHistoRespCompleted = this.allHistoRespCompleted + 1;
        return 0;
      }
    });
  }

  public calStockReturns(res) {
    if (res.historical && res.historical.length > 0) {
      const toClose = res.historical[0].close;
      const fromClose = (res.historical[res.historical.length - 1]).close;
      return parseInt((((toClose - fromClose) / fromClose) * 100).toFixed(2));
    } else {
      return 0;
    }
  }

  public addPortfolio() {
    this.globalService.loaderState = true;
    const matched = findIndex(this.globalService.portfolios, { symbol: this.profileInfo.symbol });
    if (matched !== -1) {
      this.globalService.portfolios.splice(matched, 1);
    }
    const activityObj = {
      symbol: this.profileInfo.symbol,
      name: this.profileInfo.companyName,
      price: this.profileInfo.price,
      date: Date.now()
    }
    this.globalService.portfolios.unshift(activityObj);
    if (this.globalService.portfolios.length > 5) {
      this.globalService.portfolios.splice(5, (this.globalService.portfolios.length - 5));
    }
    const formData = {
      data: JSON.stringify(this.globalService.portfolios),
      email: this.globalService.currUser.email
    }
    this.updatePortfoliosSub = this.dataService.updatePortfolios(formData).subscribe((res: any) => {
      res = JSON.parse(res);
      this.globalService.loaderState = false;
      if (res !== null && res[0]) {
        this.globalService.portfolios = [];
      }
    });
    this.profileBtnState = this.isPortfolioExists(this.profileInfo.symbol);
  }

  getValueForPixels(value) {
    let numArray: any = [];
    for (let i = 0; i < this.stockReturns.length; i++) {
      numArray.push(Math.abs(this.stockReturns[i].value));
    }
    return (value / Math.max(...numArray)) * 100;
  }

  isPossitive(value) {
    return value >= 0;
  }

  scroll(el: HTMLElement) {
    window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
  }

  public trimMe(value) {
    return parseFloat(value).toFixed(2);
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
    if (this.subRouteChange) {
      this.subRouteChange.unsubscribe();
    }
    if (this.profileInfoSub) {
      this.profileInfoSub.unsubscribe();
    }
    if (this.getRevenueInfoSub) {
      this.getRevenueInfoSub.unsubscribe();
    }
    if (this.getStockReturnsSub) {
      this.getStockReturnsSub.unsubscribe();
    }
    if (this.getBookValueInfoSub) {
      this.getBookValueInfoSub.unsubscribe();
    }
    if (this.getPriceChartInfoSub) {
      this.getPriceChartInfoSub.unsubscribe();
    }
    if (this.getReturnNetInfoSub) {
      this.getReturnNetInfoSub.unsubscribe();
    }
    if (this.getFinancialGrowthInfoSub) {
      this.getFinancialGrowthInfoSub.unsubscribe();
    }
    // if (this.getFinancialGrowthInfo2Sub) {
    //   this.getFinancialGrowthInfo2Sub.unsubscribe();
    // }
    if (this.getSimilarStocksSub) {
      this.getSimilarStocksSub.unsubscribe();
    }
    if (this.getBalSheetStInfoSub) {
      this.getBalSheetStInfoSub.unsubscribe();
    }
    if (this.getCashFlowStInfoSub) {
      this.getCashFlowStInfoSub.unsubscribe();
    }
    if (this.getNewsSub) {
      this.getNewsSub.unsubscribe();
    }
    if (this.getRatiosTtmInfoSub) {
      this.getRatiosTtmInfoSub.unsubscribe();
    }
    if (this.getQuoteInfoSub) {
      this.getQuoteInfoSub.unsubscribe();
    }
    if (this.getRatingInfoSub) {
      this.getRatingInfoSub.unsubscribe();
    }
    if (this.updatePortfoliosSub) {
      this.updatePortfoliosSub.unsubscribe();
    }
    if (this.getSecFilingsInfoSub) {
      this.getSecFilingsInfoSub.unsubscribe();
    }
    if (this.getPressReleasesInfoSub) {
      this.getPressReleasesInfoSub.unsubscribe();
    }
  }
}
