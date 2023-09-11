import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable()
export class DataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, public globalService: GlobalService) { }

  getStockInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=company_outlook&symbol=' + stockId);
  }
  getProfileInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=profile&symbol=' + stockId);
  }
  getSimilarStocks(exchange, sector) {
    return this.http.get(this.globalService.rootPath + '?q=stock_screener&sector=' + sector + '&exchange=' + exchange + '&limit=10');
  }
  getIncomeStatYearlyInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=income_statement&symbol=' + stockId + '&limit=6');
  }
  getBookValueInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=key_metrics&symbol=' + stockId + '&limit=6');
  }
  getPriceChartInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=historical_price_full_bulk&symbol=' + stockId);
  }
  getReturnNetInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=ratios&symbol=' + stockId + '&limit=6');
  }
  getReturnNetInfoFor3Years(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=ratios_limit_3&symbol=' + stockId + '&limit=3');
  }
  getFinancialGrowthInfo1(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=income_statement_growth&symbol=' + stockId + '&period=year&limit=5');
  }
  getFinancialGrowthInfo2(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=cash_flow_statement_growth&symbol=' + stockId + '&period=year&limit=5');
  }
  getBalSheetStatementInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=balance_sheet_statement&symbol=' + stockId + '&limit=6');
  }
  getCashFlowStatementInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=cash_flow_statement&symbol=' + stockId + '&limit=6');
  }
  getNewsInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=stock_news_ticker&tickers=' + stockId + '&limit=10');
  }
  getHistoRangePriceInfo(stockId, fromDate, toDate) {
    return this.http.get(this.globalService.rootPath + '?q=historical_price_full&symbol=' + stockId + '&from=' + fromDate + '&to=' + toDate);
  }
  getRatiosTtmInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=ratios_ttm&symbol=' + stockId);
  }
  getEnterpriseValuesInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=enterprise_values&symbol=' + stockId);
  }
  getSectorPEInfo(exchange, date) {
    return this.http.get(this.globalService.rootPath + '?q=sector_pe&date='+ date +'&exchange=' + exchange);
  }
  getQuoteInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=quote&symbol=' + stockId);
  }
  getRatingInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=rating&symbol=' + stockId);
  }
  getSearchInfo(str) {
    return this.http.get(this.globalService.rootPath + '?q=search&query=' + str + '&limit=10&exchange=NASDAQ');
  }
  getFullSearchInfo(str) {
    return this.http.get(this.globalService.rootPath + '?q=full_search&query=' + str);
  }
  getTopGainers() {
    return this.http.get(this.globalService.rootPath + '?q=stock&key=gainers');
  }
  getTopLosers() {
    return this.http.get(this.globalService.rootPath + '?q=stock&key=losers');
  }
  getGlobalMarketIndex() {
    return this.http.get(this.globalService.rootPath + '?q=quotes');
  }
  getStockNews() {
    return this.http.get(this.globalService.rootPath + '?q=stock_news&limit=20');
  }
  getCompareStockHistoPrices(stocks) {
    return this.http.get(this.globalService.rootPath + '?q=stocks_historical_price_full&stocks=' + stocks);
  }
  getCustStockStreenerInfo(customOptions) {
    return this.http.get(this.globalService.rootPath + '?q=custom_stock_screener&options=' + customOptions);
  }
  updateUser(formData) {
    return this.http.post(this.globalService.rootPath + '?q=add_user', formData, this.httpOptions);
  }
  getPortfolios(email) {
    return this.http.get(this.globalService.rootPath + '?q=get_portfolios&email=' + email);
  }
  updatePortfolios(formData) {
    return this.http.post(this.globalService.rootPath + '?q=update_portfolios', formData, this.httpOptions);
  }
  getGrowthInfo(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=financial_growth&symbol=' + stockId);
  }
  getSecFilings(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=sec_filings&symbol=' + stockId);
  }
  getPressReleases(stockId) {
    return this.http.get(this.globalService.rootPath + '?q=press_releases&symbol=' + stockId);
  }
  getSearchData() {
    return this.http.get(this.globalService.rootPath + '?q=stock_list');
  }
  getAllStocks() {
    return this.http.get('./assets/all-stocks.json');
  }
  contactUser(formData) {
    return this.http.post(this.globalService.rootPath + '?q=contact_user', formData, this.httpOptions);
  }
  getCalendar(url){
    return this.http.get(this.globalService.apiUrl + url)
  }
}