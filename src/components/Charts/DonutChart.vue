<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Chart, { ChartData, ChartDataset, ChartOptions, DoughnutControllerChartOptions, ElementChartOptions } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({})
export default class DonutChart extends Vue {
  @Prop({ required: true, default: "myDonutChart" }) public chartId!: string;
  @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop({ required: true, default: {} }) public chartOptions!: ChartOptions;
  @Prop({ required: false, default: false }) public useChartDataLabels:
    | boolean
    | undefined;

  private mounted() {
    this.createChart();
  }

  public createChart(): void {
    if (this.chartId) {
      let plugins: any = [];
      if (this.useChartDataLabels) {
        plugins = [ChartDataLabels];
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
}
</script>
