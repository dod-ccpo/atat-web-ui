<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({})
export default class DonutChart extends Vue {
  @Prop({ required: true, default: "myDonutChart" }) public chartId!: string;
  @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop({ required: true, default: {} }) public chartOptions!: any;
  @Prop({ required: false, default: false })
  @Prop({ required: false, default: false }) public isArcGauge!: boolean;
  @Prop({ required: false, default: "" }) public centerText1!: string;
  @Prop({ required: false, default: "" }) public centerText2!: string;
  @Prop({ required: false, default: false }) public useChartDataLabels!: boolean;

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
    const centertext = this.centertext(this);
    let plugins: any = [centertext];
    if (this.chartId) {
      if (this.useChartDataLabels) {
        plugins.push(ChartDataLabels);
      }
      const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
      new Chart(ctx, {
        type: "doughnut",
        data: this.chartData,
        options: this.chartOptions,
        plugins: plugins,
      });
    }
  }

  public getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div#donutChartTooltip");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.setAttribute("id", "donutChartTooltip");
      tooltipEl.style.background = "rgba(27, 27, 27, 0.9)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(8%, -50%)";
      tooltipEl.style.transition = "all .1s ease";

      const table = document.createElement("table");
      table.setAttribute("id", "donutChartTooltipTable");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  public externalTooltipHandler = (context: any) => {
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
      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body: any, i: any) => {
        if (body[0].toLowerCase().indexOf("burn") === -1) {
          const colors = tooltip.labelColors[i];

          const span = document.createElement("span");
          span.style.background = colors.backgroundColor;
          span.style.borderColor = "#ffffff";
          span.style.borderStyle = "solid";
          span.style.borderWidth = "1px";
          span.style.marginRight = "12px";
          span.style.height = "14px";
          span.style.width = "14px";
          span.style.display = "inline-block";

          const tr = document.createElement("tr");
          tr.style.backgroundColor = "inherit";
          tr.style.borderWidth = "0";

          const td = document.createElement("td");
          td.style.borderWidth = "0";
          const sep = body[0].indexOf(":");
          const labelText = body[0].slice(0, sep);
          const labelValue = "$" + body[0].slice(sep + 2, body[0].length);
          const text = document.createTextNode(labelText);
          const val = document.createTextNode(labelValue);

          td.appendChild(span);
          td.appendChild(text);
          tr.appendChild(td);

          const td2 = document.createElement("td");
          td2.style.paddingLeft = "8px";
          td2.appendChild(val);
          tr.appendChild(td2);

          tableBody.appendChild(tr);
        }
      });

      const tableRoot = tooltipEl.querySelector("table#donutChartTooltipTable");
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
      // Add new children
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

  public centertext(self: any): any {
    const centertext: any = {
      id: "centertext",
      beforeDraw: function(chart: any) {
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        const text1divisors = self.isArcGauge
          ? { fontSize: 40, textY: 1.5 }
          : { fontSize: 200, textY: 2.2 };
        const text2divisors = self.isArcGauge
          ? { fontSize: 130, textY: 1 }
          : { fontSize: 330, textY: 1.75 };

        ctx.restore();
        let fontSize = (height / text1divisors.fontSize).toFixed(2);
        ctx.font = "bold " + fontSize + "em 'Source Sans Pro'";
        ctx.textBaseline = "middle";
        let text = self.centerText1,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / text1divisors.textY;

        ctx.fillText(text, textX, textY);
        ctx.save();

        fontSize = (height / text2divisors.fontSize).toFixed(2);
        ctx.font = fontSize + "em 'Source Sans Pro'";
        ctx.textBaseline = "bottom";

        text = self.centerText2;
        textX = Math.round((width - ctx.measureText(text).width) / 2);
        textY = height / text2divisors.textY;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };
    return centertext;
  }
}
</script>
