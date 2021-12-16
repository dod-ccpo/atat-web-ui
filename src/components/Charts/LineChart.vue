<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";

@Component({})
export default class LineChart extends Vue {
  @Prop({ required: true, default: "myLineChart" }) public chartId!: string;
  @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop({ required: true, default: {} }) public chartOptions!: any;

  private annotationline: any = {
    id: "annotationline",
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
      new Chart(ctx, {
        type: "line",
        data: this.chartData,
        options: this.chartOptions,
        plugins: [this.annotationline],
      });
    }
  }

  public getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "rgba(27, 27, 27, 0.9)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(8%, -50%)";
      tooltipEl.style.transition = "all .1s ease";

      const table = document.createElement("table");
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
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b: any) => b.lines);

      const tableHead = document.createElement("thead");

      titleLines.forEach((title: string) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = "0";

        const th = document.createElement("th");
        th.style.borderWidth = "0";
        th.colSpan = 2;
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

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

      const tableRoot = tooltipEl.querySelector("table");

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
</script>
