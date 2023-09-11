import { Component, Inject, Input, OnInit, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-mini-chart',
  templateUrl: './mini-chart.component.html',
  styleUrls: ['./mini-chart.component.css']
})
export class MiniChartComponent implements OnInit, AfterViewInit {
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
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create(this.elementId, am4charts.XYChart);

      chart.data = this.data;
      chart.colors.list = [
        am4core.color("#4D4DFD")
      ];

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.inside = true;
      dateAxis.opacity = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.opacity = 0;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.columns.template.tooltipText = "[#000 font-size: 12px]{categoryX} [#fff font-size: 12px]{valueY}";
      chart.paddingLeft = 0;
      chart.paddingRight = 0;
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
