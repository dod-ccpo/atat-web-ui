<template>
  <canvas :id="chartId" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({})
export default class DonutChart extends Vue {
  @Prop({ required: true, default : "myDonutChart" }) public chartId: string|undefined;
  @Prop({ required: true, default : {} }) public chartData: any;
  @Prop({ required: true, default : {} }) public chartOptions: any;


  private mounted () {
    Chart.register(ChartDataLabels);
    this.createMyCharts();
  }

  public createMyCharts() {
    if (this.chartId) {
      var ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
      var myLineChart = new Chart(ctx, {
        type: 'doughnut',
        data: this.chartData,
        options: this.chartOptions,
      });
    }
  }
}

</script>
