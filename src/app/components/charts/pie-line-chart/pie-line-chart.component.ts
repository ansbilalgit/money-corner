import { Component, Inject, Input, OnInit, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-pie-line-chart',
  templateUrl: './pie-line-chart.component.html',
  styleUrls: ['./pie-line-chart.component.css']
})
export class PieLineChartComponent implements OnInit {

  private piechart: am4charts.PieChart;
  private barchart: am4charts.XYChart;
  @Input() data: any = [{
    "category": "Critical",
    "value": 89,
    "color": am4core.color("#dc4534"),
    "breakdown": [{
      "year": "Sales inquiries",
      "value": 29
    }, {
      "year": "Support requests",
      "value": 40
    }, {
      "year": "Bug reports",
      "value": 11
    }, {
      "year": "Other",
      "value": 9
    }]
  }, {
    "category": "Acceptable",
    "value": 71,
    "color": am4core.color("#d7a700"),
    "breakdown": [{
      "year": "Sales inquiries",
      "value": 22
    }, {
      "year": "Support requests",
      "value": 30
    }, {
      "year": "Bug reports",
      "value": 11
    }, {
      "year": "Other",
      "value": 10
    }]
  }, {
    "category": "Good",
    "value": 120,
    "color": am4core.color("#68ad5c"),
    "breakdown": [{
      "year": "Sales inquiries",
      "value": 60
    }, {
      "year": "Support requests",
      "value": 35
    }, {
      "year": "Bug reports",
      "value": 15
    }, {
      "year": "Other",
      "value": 10
    }]
  }];
  @Input() elementId: any = "demolinepie";
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
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      let chart = am4core.create(this.elementId, am4core.Container);
      chart.width = am4core.percent(100);
      chart.height = am4core.percent(100);
      chart.layout = "horizontal";
      // chart.paddingRight = 20;

      const data = this.data;

      // Create chart instance
      let pieChart = chart.createChild(am4charts.PieChart);
      pieChart.data = data;
      pieChart.innerRadius = am4core.percent(50);

      // Add and configure Series
      let pieSeries = pieChart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "category";
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
      pieSeries.labels.template.radius = am4core.percent(-20);
      pieSeries.labels.template.fill = am4core.color("white");
      pieSeries.ticks.template.disabled = true;

      // Set up labels
      let label1 = pieChart.seriesContainer.createChild(am4core.Label);
      label1.text = "";
      label1.horizontalCenter = "middle";
      label1.fontSize = 35;
      label1.dy = -30;

      let label2 = pieChart.seriesContainer.createChild(am4core.Label);
      label2.text = "";
      label2.horizontalCenter = "middle";
      label2.fontSize = 12;
      label2.dy = 20;

      // Create chart instance
      let lineChart = chart.createChild(am4charts.XYChart);
      lineChart.colors.list = [
        am4core.color("#474747")
      ];

      // Create axes
      var categoryAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.startLocation = 0.5;
      categoryAxis.endLocation = 0.5;

      var valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;

      // Create series
      // let lineSeries = lineChart.series.push(new am4charts.LineSeries());
      // lineSeries.sequencedInterpolation = true;
      // lineSeries.dataFields.valueY = "value";
      // lineSeries.dataFields.categoryX = "year";
      // lineSeries.tooltipText = "[{categoryX}: bold]{valueY}[/]";

      // lineSeries.tooltip.pointerOrientation = "vertical";

      // Create series
      let lineSeries = lineChart.series.push(new am4charts.LineSeries());
      // lineSeries.sequencedInterpolation = true;
      lineSeries.dataFields.categoryX = "year";
      lineSeries.dataFields.valueY = "value";
      lineSeries.strokeWidth = 2;
      lineSeries.tensionX = 0.77;
      // lineSeries.tooltip.pointerOrientation = "vertical";

      // bullet is added because we add tooltip to a bullet for it to change color
      let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "[#ff0 font-size: 12px]{categoryX} [#fff font-size: 12px]{valueY}"
      bullet.circle.radius = 3;
      bullet.circle.fill = am4core.color("#fff");
      bullet.circle.strokeWidth = 1;

      bullet.adapter.add("fill", function (fill, target: any) {
        if (target.dataItem.valueY < 0) {
          return am4core.color("#FF0000");
        }
        return fill;
      })
      let range = valueAxis.createSeriesRange(lineSeries);
      range.value = 0;
      range.endValue = -1000;
      range.contents.stroke = am4core.color("#FF0000");
      range.contents.fill = range.contents.stroke;

      

      // Auto-select first slice on load
      pieChart.events.on("ready", function (ev) {
        if(pieSeries.slices.length > 0){
          pieSeries.slices.getIndex(0).isActive = true;
        }
      });

      // Set up toggling events
      pieSeries.slices.template.events.on("toggled", function (ev: any) {
        if (ev.target.isActive) {

          // Untoggle other slices
          pieSeries.slices.each(function (slice) {
            if (slice != ev.target) {
              slice.isActive = false;
            }
          });

          // Update column chart
          lineSeries.appeared = false;
          lineChart.data = ev.target.dataItem.dataContext.breakdown;
          lineSeries.fill = ev.target.fill;
          lineSeries.reinit();

          // Update labels
          label1.text = ev.target.dataItem.values.value.value + '%';
          label1.fill = ev.target.fill;

          label2.text = ev.target.dataItem.category;
        }
      });
      this.piechart = pieChart;
      this.barchart = lineChart;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.piechart) {
        this.piechart.dispose();
      }
      if (this.barchart) {
        this.barchart.dispose();
      }
    });
  }

}