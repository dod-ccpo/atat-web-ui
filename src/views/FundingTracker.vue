<template>
  <v-container class="main-content-wrapper body-lg">
    <v-row>
      <v-col>
        <h1>Funding tracker stub</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-9">
        <canvas id="myLineChart" width="400" height="400" />
      </v-col>
      <v-col class="col-sm-6">
        <canvas id="myBarChart" width="400" height="400" />
      </v-col>

    </v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
// import ChartStub from "@/mixins/ChartStub"
import Chart from "chart.js/auto";
import { Bar, Line } from "vue-chartjs";
@Component({
  components: {
    // "chart-stub": ChartStub,
  }
})
export default class FundingTracker extends Vue {
  private lineChartOptions = {
  plugins: {
    legend: {
      display: false,
    }
  },
  aspectRatio: 1.5,

  scales: {
      x: {
        grid: {
            display: true,
            borderColor: 'rgba(255,255,255,0)',
            lineWidth: 3,
            tickWidth: 0,
            color: "rgba(255,255,255,0)",
        },
        ticks: {
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0,
        }
      },
      y: {
        suggestedMax: 250,
        grid: {
          borderColor: "rgba(255,255,255,0)",
          tickWidth: 0,
        },
        ticks: {
          callback: function(value: number) {
            return '$' + value + 'K';
          }
        }
      }
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
        spanGaps: true,
        data: [null, null, null, null, 160, null, null, null, null, null, null, null, 0],
        fill: false,
        borderColor: '#00BDE3',
        borderDash: [5,5],
        pointRadius: 0,
      }
    ]
  }
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
    var ctx = document.getElementById('myBarChart') as unknown as Bar;
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
          plugins: {
            legend: {
              display: false,
            }
          },
          scales: {
              // yAxes: [{
              //     ticks: {
              //         beginAtZero: true
              //     }
              // }]
          }
        }
    });
    var ctx2 = document.getElementById('myLineChart') as unknown as Line;
    var myLineChart = new Chart(ctx2, {
      type: 'line',
      data: this.chartData,
      options: this.lineChartOptions,
      plugins: [this.annotationline],
    })
  }
}
</script>
