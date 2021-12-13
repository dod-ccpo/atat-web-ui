import Vue from "vue";
import { Component, Mixins, Prop } from "vue-property-decorator";
import Chart, { ChartData, ChartOptions } from "chart.js";
import VueCharts from 'vue-chartjs'
import { Line, mixins } from 'vue-chartjs'

@Component({
    // extends: Line, // this is important to add the functionality to your component
    // mixins: [mixins.reactiveProp]
})

export default class ChartStub extends Mixins(mixins.reactiveProp, Line) {

  // @Prop({ required: true, default: {} }) public chartData!: ChartData;
  @Prop() public chartOptions!: ChartOptions;

  // public renderChart!: (chartData: any, options: any) => void;

  // private options = {
  //   plugins: {
  //     legend: {
  //       display: false,
  //     }
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: true,
  //         borderColor: 'rgba(255,255,255,0)',
  //         lineWidth: 3,
  //         tickWidth: 0,
  //         color: function(context) {
  //           console.dir(context);
  //           if (context.tick.label === "Jan 2022") {
  //             return "#bbb"
  //           }
  //           return "white"
  //         }
  //       }
  //     },
  //     y: {
  //       suggestedMax: 250,
  //       grid: {
  //         borderColor: "rgba(255,255,255,0)"
  //       },
  //       ticks: {
  //         callback: function(value, index, values) {
  //           return '$' + value + 'K';
  //         }
  //       }
  //     }
  //   }
  // };


  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(
      this.chartData,
      this.chartOptions,
    );
  }
}

