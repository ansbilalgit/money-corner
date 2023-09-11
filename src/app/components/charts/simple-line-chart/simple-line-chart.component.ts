import { Component, Inject, Input, OnInit, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-simple-line-chart',
  templateUrl: './simple-line-chart.component.html',
  styleUrls: ['./simple-line-chart.component.css']
})
export class SimpleLineChartComponent implements OnInit {

  private chart: am4charts.XYChart;
  @Input() data: any;
  @Input() elementId: any;
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Chart code goes in here

    this.browserOnly(() => {
      // Themes begin
      am4core.useTheme(am4themes_dataviz);
      am4core.useTheme(am4themes_animated);
      // Themes end

      let chart = am4core.create(this.elementId, am4charts.XYChart);
      // chart.paddingRight = 20;

      // chart.data = [{ year: "2015", value: 175620 }, { year: "2016", value: 175699 }, { year: "2017", value: 172432 }, { year: "2018", value: 182136 }, { year: "2019", value: 176185 }, { year: "2020", value: 134322 }];
      chart.data = this.data;
      chart.colors.list = [
        am4core.color("#474747")
      ];

      chart.numberFormatter.numberFormat = "#a";
      chart.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
      ];

      // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // dateAxis.renderer.inside = true;
      // dateAxis.opacity = 0;

      // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.renderer.inside = true;
      // valueAxis.opacity = 0;

      // let series = chart.series.push(new am4charts.ColumnSeries());
      // series.dataFields.dateX = "date";
      // series.dataFields.valueY = "value";
      // series.columns.template.tooltipText = "[#000 font-size: 12px]{categoryX} [#fff font-size: 12px]{valueY}";
      // chart.paddingLeft = 0;
      // chart.paddingRight = 0;
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.dataFields.category = "year";
      categoryAxis.startLocation = 0.1;
      categoryAxis.endLocation = 0.7;
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.fontSize = "12px";
      // categoryAxis.renderer.inside = true;
      // categoryAxis.opacity = 0;

      // Create value axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.baseValue = 0;
      valueAxis.fontSize = "12px";
      // valueAxis.numberFormatter = new am4core.NumberFormatter();
      // valueAxis.numberFormatter.numberFormat = "#.00"; 
      // valueAxis.renderer.inside = true;
      // valueAxis.opacity = 0;

      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "year";
      series.strokeWidth = 2;
      series.tensionX = 0.77;

      // bullet is added because we add tooltip to a bullet for it to change color
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "[#fff font-size: 12px]{valueY}"
      bullet.circle.radius = 3;
      bullet.circle.fill = am4core.color("#fff");
      bullet.circle.strokeWidth = 1;

      bullet.adapter.add("fill", function (fill, target: any) {
        if (target.dataItem.valueY < 0) {
          return am4core.color("#FF0000");
        }
        return fill;
      })
      let range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = -1000;
      range.contents.stroke = am4core.color("#FF0000");
      range.contents.fill = range.contents.stroke;

      // Add scrollbar
      // let scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(series);
      // chart.scrollbarX = scrollbarX;

      // chart.cursor = new am4charts.XYCursor();

      // chart.paddingLeft = 0;
      // chart.paddingRight = 0;
      this.chart = chart;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}