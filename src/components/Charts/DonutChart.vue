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
  @Prop({ required: true, default: {} }) public chartOptions!: ChartOptions;
  @Prop({ required: false, default: false })
  public useChartDataLabels!: boolean;
  @Prop({ required: false, default: false }) public isArcGauge!: boolean;
  @Prop({ required: false, default: "" }) public centerText1!: string;
  @Prop({ required: false, default: "" }) public centerText2!: string;

  private mounted() {
    this.createChart();
  }

  public createChart(): void {
    const centertext = this.centertext(this);
    if (this.chartId) {
      let plugins: any = [centertext];
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
