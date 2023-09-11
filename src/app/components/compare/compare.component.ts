import { Component, Inject, NgZone, PLATFORM_ID, OnInit, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, take } from 'rxjs/operators';
import { forEach, uniq, result, find, reverse, findIndex } from 'lodash';
import { Subscription } from 'rxjs';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  @ViewChild('compare', { static: false }) compareElem: ElementRef;
  @ViewChild('search', { static: false }) searchElement: ElementRef;
  filteredStocks: any = [];
  searchInfoSub: Subscription;
  histoStockInfoSub: Subscription;
  fRProfitablityInfoSub: Subscription;
  profileInfoSub: Subscription;
  getRatiosTtmInfoSub: Subscription;
  getQuoteInfoSub: Subscription;
  getEnterpriseValuesInfoSub: Subscription;
  getSectorPEInfoSub: Subscription;
  getRevenueInfoSub: Subscription;
  getBookValueInfoSub: Subscription;
  items: any = [];
  keys: any = [];
  frActiveTab: String = 'ROE';
  showFRProfitablity: Boolean = false;
  showHistoPriceChart: Boolean = false;
  stocksKeyMetrics: any = {};
  stockBtns:any = [];
  searchStr = "";

  constructor(
    public dataService: DataService,
    public globalService: GlobalService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) { }

  ngOnInit() {
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  public onTextChange() {
    if(this.searchStr == "") {
      this.filteredStocks = [];
      return false;
    }
     this.filteredStocks = this.globalService.filterStocks(this.searchStr);
     this.dataService.getSearchInfo(this.searchStr).pipe(take(1)).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.filteredStocks = res;
      }
      if (res.length === 0) {
        this.filteredStocks = [];
      }
    })    

  }
  //  public requestAutocompleteItems = (str: string): any => {
  //   return this.globalService.filterStocks(str);
  //    return this.dataService.getSearchInfo(text).pipe(
  //     map((data: any) => JSON.parse(data).map(item => { return { "name": item.name ? item.name : '', "symbol": item.symbol ? item.symbol : '' } })));
  // };

  public onAdd(item) {
    const foundedAt = findIndex(this.stockBtns, ['symbol', item.symbol]);
    if(foundedAt == -1) {
      this.stockBtns.push(item);
    }
    this.searchStr = "";
    this.searchElement.nativeElement.focus();
    // this.tagInput.dropdown.hide();
  }

  public onRemove(item) {
    this.searchStr = "";
    const foundedAt = findIndex(this.stockBtns, ['symbol', item.symbol]);
    this.stockBtns.splice(foundedAt, 1);
    this.searchElement.nativeElement.focus();
    // this.tagInput.dropdown.hide();
  }

  public focusSearchField() {
    this.searchElement.nativeElement.focus();
  }

  public compareStocks() {
    this.searchStr = "";
    this.showHistoPriceChart = false;
    const _self = this;
    let stocks = [];
    forEach(this.stockBtns, function (o) {
      stocks.push(o.symbol);
    });
    if (stocks.length <= 1) return;
    this.globalService.loaderState = true;
    this.keys = [];
    const priceChartData = [];
    this.histoStockInfoSub = this.dataService.getCompareStockHistoPrices(stocks).subscribe((data: any) => {
      data = JSON.parse(data);
      let mixedDates = [];
      let stocks = [];
      this.keys = [];
      forEach(data.historicalStockList, function (o, i) {
        stocks.push(o.symbol);
        _self.keys.push({ name: o.symbol, key: "stock" + (i + 1) });
        forEach(o.historical, function (h) {
          mixedDates.push(h.date);
        });
      });
      forEach(this.keys, function (key) {
        _self.stocksKeyMetrics[key.name] = {
          price: '0',
          marketCap: '0',
          ePS: '0',
          priceToBookValue: '0',
          pERatio: '0',
          dividendYield: '0',
          rOE: '0',
          rOCE: '0',
          enterpriseValue: '0',
          sectorPE: '0',
          eVtoEBITDA: '0',
          outstandingShares: '0',
          bookValue: '0',
          website: '',
          val52WeekHigh: '0',
          val52WeekLow: '0',
          fairValue: '0'
        };
      });
      const allDates = uniq(mixedDates);
      forEach(allDates, function (date) {
        if (data.historicalStockList.length == 2) {
          priceChartData.push({ "date": date, "stock1": result(find(data.historicalStockList[0].historical, { 'date': date }), 'close'), "stock2": result(find(data.historicalStockList[1].historical, { 'date': date }), 'close') });
        }
        if (data.historicalStockList.length == 3) {
          priceChartData.push({ "date": date, "stock1": result(find(data.historicalStockList[0].historical, { 'date': date }), 'close'), "stock2": result(find(data.historicalStockList[1].historical, { 'date': date }), 'close'), "stock3": result(find(data.historicalStockList[2].historical, { 'date': date }), 'close') });
        }
      });
      this.globalService.loaderState = false;
      this.showHistoPriceChart = true;
      const scrollToContainer = this.compareElem.nativeElement.offsetTop;
      window.scrollTo({ top: scrollToContainer - 100, behavior: 'smooth' });
      this.initHistoPriceChart(this.keys, priceChartData);

      this.globalService.fRProfitablityChartData = {
        "ROE": [],
        "ROCE": [],
        "ROAC": [],
        "NPM": [],
        "DTE": [],
        "CR": [],
        "ICR": [],
        "QR": [],
        "PER": [],
        "EBR": [],
        "PBV": [],
        "PCF": []
      };
      forEach(this.keys, function (key, i) {
        _self.getFRProfitablityInfo(key.name, i, "ROE");
        _self.getKeyMetrics(key.name);
      });
    });
  }

  public getSectorPE(exchange, date, sector, stockId) {
    let result = "-";
    this.getSectorPEInfoSub = this.dataService.getSectorPEInfo(exchange, date).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        res.forEach(o => {
          if (sector == o.sector) {
            result = Number(o.pe).toFixed(2);
          }
        });
      }
      this.stocksKeyMetrics[stockId].sectorPE = result;
    });
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

  public getKeyMetrics(stockId) {
    this.profileInfoSub = this.dataService.getProfileInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        const profileInfo = res[0];
        const todayDate = this.formatDate(new Date());
        this.stocksKeyMetrics[stockId].price = profileInfo.price;
        this.stocksKeyMetrics[stockId].marketCap = this.globalService.numDifferentiation(profileInfo.mktCap).value + '' + this.globalService.numDifferentiation(profileInfo.mktCap).curDetect;
        this.stocksKeyMetrics[stockId].website = profileInfo.website;
        this.getSectorPE(res[0].exchangeShortName, todayDate, res[0].sector, stockId);
      }
    });
    this.getRatiosTtmInfoSub = this.dataService.getRatiosTtmInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].priceToBookValue = (res[0].priceToBookRatioTTM ? res[0].priceToBookRatioTTM : 0).toFixed(2);
        this.stocksKeyMetrics[stockId].pERatio = (res[0].peRatioTTM ? res[0].peRatioTTM : 0).toFixed(2);
        this.stocksKeyMetrics[stockId].eVtoEBITDA = (res[0].ebitPerRevenueTTM ? res[0].ebitPerRevenueTTM : 0).toFixed(2);
      }
    });
    this.getQuoteInfoSub = this.dataService.getQuoteInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].outstandingShares = res[0].sharesOutstanding;
        this.stocksKeyMetrics[stockId].val52WeekHigh = res[0].yearHigh;
        this.stocksKeyMetrics[stockId].val52WeekLow = res[0].yearLow;
      }
    });
    this.getEnterpriseValuesInfoSub = this.dataService.getEnterpriseValuesInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].enterpriseValue = this.globalService.numDifferentiation(res[0].enterpriseValue ? res[0].enterpriseValue : 0).value + ' ' + this.globalService.numDifferentiation(res[0].enterpriseValue ? res[0].enterpriseValue : 0).curDetect;
      }
    });
    this.getRevenueInfoSub = this.dataService.getIncomeStatYearlyInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].ePS = (res[0].eps ? res[0].eps : 0).toFixed(2);
      }
    });
    this.getBookValueInfoSub = this.dataService.getBookValueInfo(stockId).subscribe((res: any) => {
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].dividendYield = (res[0].dividendYield ? res[0].dividendYield : 0).toFixed(2);
        this.stocksKeyMetrics[stockId].bookValue = (res[0].bookValuePerShare ? res[0].bookValuePerShare : 0).toFixed(2);
      }
    });
  }

  public initHistoPriceChart(keyValuePair: any, data: any) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("histoPriceChart", am4charts.XYChart);

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.labels.template.location = 0.0001;

      /* Create value axis */
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.min = 0;
      const colors = ["#F0B41A", "#3ab643", "#6771DC"];

      /* Create series */
      forEach(keyValuePair, function (o, index) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = o.key;
        series.stroke = am4core.color(colors[index]);
        series.strokeWidth = 2;
        series.name = o.name;

        let bullet = series.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#fff font-size: 12px]{name}:\n[/][#fff font-size: 13px]{valueY}[/] [#fff]{additional}[/]"
      });
      chart.legend = new am4charts.Legend();
      chart.cursor = new am4charts.XYCursor();
      chart.data = data;
    });
  }

  public initHistoBarChart(keyValuePair: any, data: any) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("histoBarChart", am4charts.XYChart);

      /* Create axes */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 1;
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.fontSize = "12px";

      /* Create value axis */
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.fontSize = "12px";
      // valueAxis.min = 0;
      chart.colors.list = [
        am4core.color("#6794DC"),
        am4core.color("#6F67DC"),
        am4core.color("#67B7DC")
      ];

      /* Create series */
      forEach(keyValuePair, function (o) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = o.name;
        series.dataFields.valueY = o.key;
        series.dataFields.categoryX = "date";
        series.columns.template.width = am4core.percent(100);
        series.columns.template.tooltipText = "[#fff font-size: 12px]{name}:\n[/][#fff font-size: 13px]{valueY}[/] [#fff]{additional}[/]";
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "[#000 font-size: 10px]{valueY}";
        labelBullet.label.dy = -10;
      });
      chart.legend = new am4charts.Legend();
      chart.data = data;
    });
  }

  public profitablity(key) {
    this.frActiveTab = key;
    this.generateBarChartData(key);
  }

  getFRProfitablityInfo(stockId, i, cType) {
    this.showFRProfitablity = false;
    const _self = this;
    this.fRProfitablityInfoSub = this.dataService.getReturnNetInfoFor3Years(stockId).subscribe((res: any) => {
      this.showFRProfitablity = true;
      res = JSON.parse(res);
      if (res !== null && res[0]) {
        this.stocksKeyMetrics[stockId].rOE = (res[0].returnOnEquity ? res[0].returnOnEquity : 0 * 100).toFixed(2);
        this.stocksKeyMetrics[stockId].rOCE = (res[0].returnOnCapitalEmployed ? res[0].returnOnCapitalEmployed : 0 * 100).toFixed(2);
        this.stocksKeyMetrics[stockId].fairValue = (res[0].priceFairValue ? res[0].priceFairValue : 0).toFixed(2);
        const fRResponse = reverse(res);
        if (fRResponse) {
          forEach(fRResponse, function (o) {
            _self.globalService.fRProfitablityChartData.ROE.push({ "stock": stockId, "year": o.date.substring(0, 4), value: (o.returnOnEquity * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.ROCE.push({ "stock": stockId, "year": o.date.substring(0, 4), value: (o.returnOnCapitalEmployed * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.ROAC.push({ "stock": stockId, "year": o.date.substring(0, 4), value: (o.returnOnAssets * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.NPM.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.netProfitMargin ? o.netProfitMargin : 0) * 100).toFixed(2) });

            _self.globalService.fRProfitablityChartData.DTE.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.debtEquityRatio ? o.debtEquityRatio : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.CR.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.currentRatio ? o.currentRatio : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.ICR.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.interestCoverage ? o.interestCoverage : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.QR.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.quickRatio ? o.quickRatio : 0) * 100).toFixed(2) });

            _self.globalService.fRProfitablityChartData.PER.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.priceEarningsRatio ? o.priceEarningsRatio : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.EBR.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.enterpriseValueMultiple ? o.enterpriseValueMultiple : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.PBV.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.priceToBookRatio ? o.priceToBookRatio : 0) * 100).toFixed(2) });
            _self.globalService.fRProfitablityChartData.PCF.push({ "stock": stockId, "year": o.date.substring(0, 4), value: ((o.priceCashFlowRatio ? o.priceCashFlowRatio : 0) * 100).toFixed(2) });
          });
          if (i === (this.keys.length - 1)) {
            this.generateBarChartData(cType);
          }
        }
      }
    });
  }

  public getStockValue(date, data, stockName) {
    let dummyValue = find(data, function (o) {
      return o.year === date && o.stock === stockName;
    });
    if (dummyValue != undefined) {
      return dummyValue.value;
    } else {
      return 0;
    }
  }

  public generateBarChartData(cType) {
    const _self = this;
    let mixedDates = [];
    const histoChartData = [];
    forEach(this.globalService.fRProfitablityChartData[cType], function (h) {
      mixedDates.push(h.year);
    });
    const allDates = uniq(mixedDates);
    forEach(allDates, function (date) {
      if (_self.keys.length === 2) {
        histoChartData.push({ "date": date, "stock1": _self.getStockValue(date, _self.globalService.fRProfitablityChartData[cType], _self.keys[0].name), "stock2": _self.getStockValue(date, _self.globalService.fRProfitablityChartData[cType], _self.keys[1].name) });
      } else if (_self.keys.length === 3) {
        histoChartData.push({ "date": date, "stock1": _self.getStockValue(date, _self.globalService.fRProfitablityChartData[cType], _self.keys[0].name), "stock2": _self.getStockValue(date, _self.globalService.fRProfitablityChartData[cType], _self.keys[1].name), "stock3": _self.getStockValue(date, _self.globalService.fRProfitablityChartData[cType], _self.keys[2].name) });
      }
    });
    this.showFRProfitablity = true;
    this.initHistoBarChart(this.keys, histoChartData);
  }

  ngOnDestroy() {
    if (this.searchInfoSub) {
      this.searchInfoSub.unsubscribe();
    }
    if (this.histoStockInfoSub) {
      this.histoStockInfoSub.unsubscribe();
    }
    if (this.fRProfitablityInfoSub) {
      this.fRProfitablityInfoSub.unsubscribe();
    }
    if (this.profileInfoSub) {
      this.profileInfoSub.unsubscribe();
    }
    if (this.getRatiosTtmInfoSub) {
      this.getRatiosTtmInfoSub.unsubscribe();
    }
    if (this.getQuoteInfoSub) {
      this.getQuoteInfoSub.unsubscribe();
    }
    if (this.getEnterpriseValuesInfoSub) {
      this.getEnterpriseValuesInfoSub.unsubscribe();
    }
    if (this.getRevenueInfoSub) {
      this.getRevenueInfoSub.unsubscribe();
    }
    if (this.getBookValueInfoSub) {
      this.getBookValueInfoSub.unsubscribe();
    }
    if (this.getSectorPEInfoSub) {
      this.getSectorPEInfoSub.unsubscribe();
    }
  }
}
