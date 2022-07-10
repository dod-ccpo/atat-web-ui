<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";

@Component({})
export default class LineChart extends Vue {
  @Prop({ required: true, default: "myLineChart" }) public chartId!: string;
  @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop({ required: true, default: {} }) public chartOptions!: any;
  @Prop({ required: false }) public datasetToToggle!: number;
  @Prop({ required: false }) public toggleDataset!: boolean;
  @Prop({ required: false }) public tooltipHeaderData!: Record<string, string>;
  private myChart!: Chart;

  @Watch("tooltipHeaderData", { deep: true })
  public tooltipHeaderDataUpdate(newData: Record<string, string>): void {
    debugger;
    // this.myChart.data = newData;
    // this.myChart.update();
  }

  @Watch("chartData", { deep: true })
  public chartDataUpdate(newData: ChartData): void {
    this.myChart.data = newData;
    this.myChart.update();
  }

  @Watch("toggleDataset")
  protected doToggleDataset(): void {
    const i = this.datasetToToggle;
    const isDatasetVisible = this.myChart.isDatasetVisible(i);
    if (isDatasetVisible) {
      this.myChart.hide(i); // actual spend (solid)
      this.myChart.hide(i + 1); // burndown (dashed)
    } else {
      this.myChart.show(i);
      this.myChart.show(i + 1);
    }
  }

  private currentMonthLine: any = {
    id: "currentMonthLine",
    beforeDraw: (chart: any) => {
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        ctx.save();
        const activePoint = chart.tooltip._active[0];
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(180,180,180,1)";
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  private mounted() {
    const toolTipExternalOptions = {
      enabled: false,
      position: "nearest",
      external: this.externalTooltipHandler,
    };
    this.chartOptions.plugins.tooltip = toolTipExternalOptions;
    this.createChart();
  }

  public createChart(): void {
    if (this.chartId) {
      const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
      this.myChart = new Chart(ctx, {
        type: "line",
        data: this.chartData,
        options: this.chartOptions,
        plugins: [this.currentMonthLine],
      });
    }
  }


  public getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div#lineChartTooltip");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.setAttribute("id", "lineChartTooltip");
      tooltipEl.style.background = "rgba(27, 27, 27, 0.9)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(8%, -50%)";
      tooltipEl.style.transition = "all .1s ease";

      const table = document.createElement("table");
      table.setAttribute("id", "lineChartTooltipTable");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  public externalTooltipHandler = (context: any) => {
    debugger;
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b: any) => b.lines);
      const projectedCount = bodyLines.filter(
        (l: string[]) => l[0].toLowerCase().indexOf("projected") > -1
      ).length;
      // debugger;
      if (bodyLines.length !== projectedCount) {

        if (bodyLines.length) {

          const titleLines = tooltip.title || [];
          debugger;

          const tableHead = document.createElement("thead");

          titleLines.forEach((title: string) => {
            const tr = document.createElement("tr");
            tr.style.borderWidth = "0";

            const th = document.createElement("th");
            th.style.borderWidth = "0";
            th.colSpan = 3;

            const currentYear = (new Date()).getFullYear();
            // EJY need to increase year if Jan and not first label;
            const text = document.createTextNode(title + " " + currentYear);
            const headerTitle = document.createTextNode(this.tooltipHeaderData.title);
            const amount = document.createTextNode(
              "$" + this.tooltipHeaderData.amount.slice(0, -3)
            );
            const h1 = document.createElement("h1");
            h1.appendChild(amount);
            const legend = document.createTextNode(this.tooltipHeaderData.legend);
            const hr1 = document.createElement("hr");
            const hr2 = document.createElement("hr");


            th.appendChild(text);
            th.appendChild(hr1);
            th.appendChild(headerTitle);
            th.appendChild(h1);
            th.appendChild(hr2);
            th.appendChild(legend);

            tr.appendChild(th);
            tableHead.appendChild(tr);
          });

          const tableBody = document.createElement("tbody");
          bodyLines.forEach((body: any, i: any) => {
            const sep = body[0].indexOf(":");
            const labelText = body[0].slice(0, sep);
            if (
              body[0].toLowerCase().indexOf("burn") === -1 
              && labelText.toLowerCase().indexOf("projected") === -1
            ) {
              const colors = tooltip.labelColors[i];

              const span = document.createElement("span");
              span.style.background = colors.backgroundColor;
              span.style.borderColor = "#ffffff";
              span.style.borderStyle = "solid";
              span.style.borderWidth = "1px";
              span.style.marginRight = "4px";
              span.style.height = "16px";
              span.style.width = "16px";
              span.style.display = "inline-block";
              // EJY get color square aligned with text

              const tr = document.createElement("tr");
              tr.style.backgroundColor = "inherit";
              tr.style.borderWidth = "0";

              const td1 = document.createElement("td");
              td1.style.borderWidth = "0";
              td1.appendChild(span);
              tr.appendChild(td1);

              const td2 = document.createElement("td");
              const text = document.createTextNode(labelText);
              td2.appendChild(text);
              tr.appendChild(td2);

              const td3 = document.createElement("td");
              td3.style.paddingLeft = "8px";
              const labelValue = "$" + body[0].slice(sep + 2, body[0].length);
              const val = document.createTextNode(labelValue);
              td3.appendChild(val);
              tr.appendChild(td3);

              tableBody.appendChild(tr);
            }
          });

          const tableRoot = tooltipEl.querySelector("table#lineChartTooltipTable");
          // Remove old children
          while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
          }
          // Add new children
          tableRoot.appendChild(tableHead);
          tableRoot.appendChild(tableBody);
        }

        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + "px";
        tooltipEl.style.top = positionY + tooltip.caretY + "px";
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding =
          tooltip.options.padding + "px " + tooltip.options.padding + "px";
      };
    }
  }
}
</script>
