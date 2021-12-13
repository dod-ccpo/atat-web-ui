<template>
  <v-container class="main-content-wrapper body-lg">
    <v-row>
      <v-col>
        <h1>Funding tracker stub</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-6">
        <chart-stub
          :chart-data="chartData"
          :chart-options="options"
        />
      </v-col>
      <v-col class="col-sm-6">
        <canvas id="myChart" width="400" height="400" />
      </v-col>

    </v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ChartStub from "@/mixins/ChartStub"
import Chart from "chart.js";
import { Bar } from "vue-chartjs";
@Component({
  components: {
    "chart-stub": ChartStub,
  }
})
export default class FundingTracker extends Vue {
  private options = {
    legend: {
      display: false,
    },
    // title: {
    //   display: true,
    //   text: "My Line Chart"
    // },
    responsive: true,
    // maintainAspectRatio: false,
    // aspectRatio: 2,
    // canvas: {
    //   height: "200px"
    // },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            lineWidth: 0,
            drawTicks: true,

            ticks: {
              beginAtZero: true,
              stepSize: 50,
              padding: 10,
            },

            // color: function(context: any) {
            //   console.dir(context);
            //   if (context.tick.label === "Jan 2020") {
            //     return "rgba(200,200,200,1)"
            //   }
            //   return "rbga(255,255,255,0)"
            // }

          },
        }
      ],
      yAxes: [
        {
          display: true,
          drawTicks: false,
          zeroLineWidth: 0,
          ticks: {
            beginAtZero: true,
            stepSize: 50,
            padding: 10,
            callback: function(value, index, values) {
                return '$' + value + "K";
            }
          },
          gridLines: {
            drawTicks: false,
          },
        }
      ]
    }

  };
  private chartData = {
    labels: ["Sept", "Oct", "Nov", "Dec", "Jan 2022", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"],
    datasets: [
      {
        label: 'Actual Spend',
        data: [230, 190, 188, 170, 160, null, null, null],
        fill: false,
        borderColor: '#00BDE3',
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderWidth: 2,
        lineTension: 0,
      },
      {
        label: 'Projected Burn',
        data: [null, null, null, null, 160, 140, 120, 100, 80, 60, 40, 20, 0],
        fill: false,
        borderColor: '#00BDE3',
        borderDash: [5,5],
        pointRadius: 0,
      }
    ]
  }
  private mounted () {
    var ctx = document.getElementById('line-chart') as unknown as Chart;
    console.dir(ctx);
    // if (ctx) {
    //   const myChart = new Chart(ctx, {});
    //   myChart.height = 200;
    // }
    this.createMyChart();
  }

  public createMyChart() {
    var ctx = document.getElementById('myChart') as unknown as Bar;
    debugger;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

  }
}
</script>
