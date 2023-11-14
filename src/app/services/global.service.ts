import { Injectable, EventEmitter } from '@angular/core';
import { findIndex, uniqBy } from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable()
export class GlobalService {
  loaderState: boolean = false;
  isSearchLoaded: boolean = false;
  allStocksData: Array<any> = [];
  currRoute = "home";
  userLoggedIn: EventEmitter<any> = new EventEmitter();
   rootPath = 'https://www.findurstocks.com.au/be/data.php';
  apiUrl = 'https://financialmodelingprep.com/api/v3/';
  // rootPath = environment.rootPath;
  isRnnChartDataReady = 0;
  portfolios: any = [];
  fRProfitablityChartData: any = {
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
  currUser = {
    isUserVerified: false,
    name: '',
    email: '',
    mobile: '',
    createdon: '',
    photoUrl: ''
  }
  constructor() {

  }
  setUser(userObj) {
    this.currUser = {
      isUserVerified: true,
      name: userObj.name,
      email: userObj.email,
      mobile: userObj.mobile,
      createdon: userObj.createdon,
      photoUrl: userObj.photoUrl
    }
  }

  clearUser() {
    this.currUser = {
      isUserVerified: false,
      name: '',
      email: '',
      mobile: '',
      createdon: '',
      photoUrl: ''
    }
  }

  public convertDate(date) {
    const returnDate = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[returnDate.getMonth()] + ' ' + returnDate.getDate() + ', ' + returnDate.getFullYear();
  }

  public numDifferentiation(val) {
    let converted: any = {
      value: 0,
      curDetect: ''
    };
    if (Math.abs(Number(val)) >= 1.0e+12) {
      return converted = { value: (Math.abs(Number(val)) / 1.0e+12).toFixed(2), curDetect: 'T' };
    }
    if (Math.abs(Number(val)) >= 1.0e+9) {
      return converted = { value: (Math.abs(Number(val)) / 1.0e+9).toFixed(2), curDetect: 'B' };
    } else if (Math.abs(Number(val)) >= 1.0e+6) {
      return converted = { value: (Math.abs(Number(val)) / 1.0e+6).toFixed(2), curDetect: 'M' };
    } else {
      return converted = { value: Number(val).toFixed(2), curDetect: '' };
    }
  }

  public numToBillions(val) {
    return (val / 1.0e+9).toFixed(2);
  }

  addToActivity(activityObj) {
    let activitiesList = [];
    if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem("activitiesList") != null) {
        activitiesList = JSON.parse(localStorage.getItem("activitiesList"));
      }
    }
    if (activitiesList.length > 0) {
      activitiesList = uniqBy(activitiesList, 'symbol');
      const matched = findIndex(activitiesList, { symbol: activityObj.symbol });
      if (matched !== -1) {
        activitiesList.splice(matched, 1);
      }
    }
    activitiesList.unshift(activityObj);
    if (activitiesList.length > 5) {
      activitiesList.splice(5, (activitiesList.length - 5));
    }
    localStorage.setItem('activitiesList', JSON.stringify(activitiesList));
  }

  getAllActivities() {
    let activitiesList = [];
    if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem("activitiesList") != null) {
        activitiesList = JSON.parse(localStorage.getItem("activitiesList"));
      }
    }
    return activitiesList;
  }


  filterStocks(str) {
    let filterdOutput = [];
    for (var i = 0; i < this.allStocksData.length; i++) {
      if (this.allStocksData[i].name.toLowerCase().indexOf(str.toLowerCase()) !== -1 || this.allStocksData[i].symbol.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
        filterdOutput.push({ symbol: this.allStocksData[i].symbol, name: this.allStocksData[i].name });
      }
      if (filterdOutput.length === 100) break;
    }
    return filterdOutput.length == 0 ? [] : filterdOutput;
  }
}
