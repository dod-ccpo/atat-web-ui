<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Chart, { ChartData } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toCurrencyString } from "@/helpers";
import ATATCharts from "@/store/charts";

@Component({})
export default class DonutChart extends Vue {
  @Prop({ required: true, default: "MyDonutChart" }) public chartId!: string;
  @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop({ required: true, default: {} }) public chartOptions!: any;
  @Prop({ required: false, default: false })
  public useChartDataLabels!: boolean;
  @Prop({ required: false, default: false }) public isArcGauge!: boolean;
  @Prop({ required: false, default: "" }) public centerText1!: string;
  @Prop({ required: false, default: "" }) public centerText2!: string;
  @Prop({ required: false, default: "" }) public amount!: number;
  @Prop({ required: false, default: true}) showLabelOnHover!: boolean;
  @Prop({ required: false, default: "" }) public individualAmtsArr!: {[key:string]:number};
  @Prop({ required: false, default: false }) public isError!: boolean;

  private myChart!: Chart;

  @Watch("chartData", { deep: true })
  public chartDataUpdate(newData: ChartData): void {
    this.myChart.data = newData;
    this.myChart.update();
  }

  private async mounted(): Promise<void> {
    if (this.showLabelOnHover) {
      const toolTipExternalOptions = {
        enabled: false,
        position: "nearest",
        external: this.externalTooltipHandler,
      };
      this.chartOptions.plugins.tooltip = toolTipExternalOptions;
    }

    await this.createChart();
  }
  
  public chartAuxColors = ATATCharts.chartAuxColors;

  public async createChart(): Promise<void> {
    const centertext = this.centertext(this);
    if (this.chartId) {
      //eslint-disable-next-line prefer-const 
      let plugins: any = [centertext];
      if (this.useChartDataLabels) {
        plugins.push(ChartDataLabels);
      }
      const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
      this.myChart = new Chart(ctx, {
        type: "doughnut",
        data: this.chartData,
        options: this.chartOptions,
        plugins: plugins,
      });
    }
  }

  public centertext(self: any): any {
    const centertext: any = {
      id: "centertext",
      beforeDraw: function(chart: any) {
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        const text1divisors = self.isArcGauge
          ? { fontSize: 40, textY: 1.5 }
          : { fontSize: 160, textY: 2.2 };
        const text2divisors = self.isArcGauge
          ? { fontSize: 140, textY: 1 }
          : { fontSize: 350, textY: 1.75 };

        ctx.restore();
        
        if(self.isError){
          ctx.fillStyle = self.chartAuxColors.error;
        }
        let fontSize = (height / text1divisors.fontSize).toFixed(2);
        ctx.font = "bold " + fontSize + "em 'Roboto Condensed'";
        ctx.textBaseline = "middle";
        let text = self.centerText1,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / text1divisors.textY;

        ctx.fillText(text, textX, textY);
        ctx.save();

        fontSize = (height / text2divisors.fontSize).toFixed(2);
        ctx.font = fontSize + "em 'Roboto'";
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
  public externalTooltipHandler = (context: any) => {
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b: any) => b.lines);
      const labelText = bodyLines[0][0];
      const sep = labelText.indexOf(":");
      const color = tooltip.labelColors[0].backgroundColor;

      const colorBlock = document.createElement("span");
      colorBlock.style.background = color;
      colorBlock.style.borderColor = "#ffffff";
      colorBlock.style.borderStyle = "solid";
      colorBlock.style.borderWidth = "1px";
      colorBlock.style.marginRight = "8px";
      colorBlock.style.height = "16px";
      colorBlock.style.width = "16px";
      colorBlock.style.display = "inline-block";
      colorBlock.style.marginRight = "8px";

      const label = labelText.slice(0, sep);
      const text = document.createTextNode(label)
      const labelSpan = document.createElement("span");
      labelSpan.style.fontWeight = "700";
      labelSpan.style.fontSize = "14px";
      labelSpan.style.marginRight = "16px";
      labelSpan.style.whiteSpace = "nowrap";
      labelSpan.appendChild(text);

      const percentNo = parseFloat(labelText.slice(sep + 2, labelText.length));
      const amount = "$" + toCurrencyString(this.individualAmtsArr[label]).slice(0, -3);
      const amountNode = document.createTextNode(amount)
      const percentSpan = document.createElement("span");
      percentSpan.style.fontSize = "14px";
      percentSpan.appendChild(amountNode);

      const tooltipDiv = tooltipEl.querySelector("div#DonutChartTooltipDiv");
      // Remove old children
      while (tooltipDiv.firstChild) {
        tooltipDiv.firstChild.remove();
      }

      tooltipDiv.appendChild(colorBlock);
      tooltipDiv.appendChild(labelSpan);
      tooltipDiv.appendChild(percentSpan);

      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX + "px";
      tooltipEl.style.top = positionY + tooltip.caretY + "px";
      tooltipEl.style.font = tooltip.options.bodyFont.string;
      tooltipEl.style.padding =
        tooltip.options.padding + "px " + tooltip.options.padding + "px";
    }
  }

  public getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div#DonutChartTooltip");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.setAttribute("id", "DonutChartTooltip");
      tooltipEl.style.background = "rgba(27, 27, 27, 0.9)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(0, -50%)";

      const div = document.createElement("div");
      div.setAttribute("id", "DonutChartTooltipDiv");
      div.style.margin = "0px";
      div.style.display = "flex";
      div.style.alignItems = "center";

      tooltipEl.appendChild(div);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };
}
</script>
