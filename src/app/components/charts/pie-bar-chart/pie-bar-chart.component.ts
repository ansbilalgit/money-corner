import { Component, Inject, Input, OnInit, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-pie-bar-chart',
  templateUrl: './pie-bar-chart.component.html',
  styleUrls: ['./pie-bar-chart.component.css']
})
export class PieBarChartComponent implements OnInit {
  private piechart: am4charts.PieChart;
  private barchart: am4charts.XYChart;
  @Input() data: any;
  @Input() elementId: any;
  @Input() textId: any;
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
      //  pieSeries.alignLabels = false;
      //  pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
      pieSeries.labels.template.maxWidth = 130;
      pieSeries.labels.template.wrap = true;
      //  pieSeries.labels.template.radius = am4core.percent(-20);
      //  pieSeries.labels.template.fill = am4core.color("white");
      //  pieSeries.ticks.template.disabled = true;

      // Set up labels
      let label1 = pieChart.seriesContainer.createChild(am4core.Label);
      label1.text = "";
      label1.horizontalCenter = "middle";
      label1.fontSize = 24;
      label1.dy = -30;

      let label2 = pieChart.seriesContainer.createChild(am4core.Label);
      label2.text = "";
      label2.horizontalCenter = "middle";
      label2.fontSize = 12;
      label2.dy = 10;

      let label3 = pieChart.seriesContainer.createChild(am4core.Label);
      label3.text = "Avg 3Years";
      label3.horizontalCenter = "middle";
      label3.fontSize = 12;
      label3.dy = 30;

      // Create chart instance
      let columnChart = chart.createChild(am4charts.XYChart);

      // Create axes
      let categoryAxis = columnChart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0;
      categoryAxis.renderer.cellEndLocation = 1;
      categoryAxis.renderer.minGridDistance = 1;
      // categoryAxis.renderer.inversed = true;

      let valueAxis = columnChart.xAxes.push(new am4charts.ValueAxis());
      // valueAxis.renderer.opposite = true;

      // Create series
      let columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
      columnSeries.dataFields.valueX = "value";
      columnSeries.dataFields.categoryY = "year";
      columnSeries.columns.template.strokeWidth = 0;
      columnSeries.columns.template.tooltipText = "[/][#fff font-size: 13px]{valueX}[/] [#fff]{additional}[/]";

      var valueLabel = columnSeries.columns.template.createChild(am4core.Label);
      valueLabel.text = "{valueX}";
      valueLabel.fontSize = 12;
      valueLabel.valign = "middle";
      valueLabel.dx = 20;
      valueLabel.strokeWidth = 0;

      // Auto-select first slice on load
      pieChart.events.on("ready", function (ev) {
        if(pieSeries.slices.length > 0){
          pieSeries.slices.getIndex(0).isActive = true;
        }
      });

      const _self = this;
      // Set up toggling events
      pieSeries.slices.template.events.on("toggled", function (ev: any) {
        if (ev.target.isActive) {
          document.getElementById(_self.textId).innerHTML = ev.target.dataItem.dataContext.toolTip;
          // Untoggle other slices
          pieSeries.slices.each(function (slice) {
            if (slice != ev.target) {
              slice.isActive = false;
            }
          });

          // Update column chart
          columnSeries.appeared = false;
          columnChart.data = ev.target.dataItem.dataContext.breakdown;
          columnSeries.fill = ev.target.fill;
          columnSeries.reinit();

          // Update labels
          label1.text = ev.target.dataItem.values.value.value + '%';
          label1.fill = ev.target.fill;

          label2.text = ev.target.dataItem.category;
        }
      });
      this.piechart = pieChart;
      this.barchart = columnChart;
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