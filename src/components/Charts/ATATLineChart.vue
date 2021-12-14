<template>
  <canvas id="myLineChart" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Chart from "chart.js/auto";

@Component({})
export default class LineChart extends Vue {
  @Prop({ required: true, default : {} }) public chartData: any;
  @Prop({ required: true, default : {} }) public chartOptions: any;

  private annotationline: any = {
    id: 'annotationline',
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
    }
  }

  private mounted () {
    this.createMyCharts();
  }

  public createMyCharts() {
    var ctx = document.getElementById('myLineChart') as HTMLCanvasElement;
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions,
      plugins: [this.annotationline],
    });
  }
}

</script>
