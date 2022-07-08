import { Component } from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'ATATCharts',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class ChartsStore extends VuexModule {

  public chartDataColors = {
    // Color pallete for data visualizations.
    // Must maintain this sequence to maximize contrast between
    // neighboring colors to help with visual differentiation, optimizing
    // charts for users with color vision deficiencies.
    "purple": "#544496",
    "blue": "#1AA7E0",
    "orange": "#FA9441",
    "magenta": "#D72D79",
    "green-cool": "#70E17B",
    "indigo-warm": "#B69FFF",
    "yellow": "#FACE00",
    "blue-warm": "#2672DE",
    "mint-cool": "#7EFBE1",
    "orange-warm": "#914734",
    "gray": "#dfe1e2",
  };

  public chartAuxColors = {
    "lineChart-axis": "#3d4551",
    "lineChart-border": "#dfe1e2",
    "lineChart-dataHiliteBorder": "#a9aeb1",
  };

  public chartDataColorSequence = Object.values(this.chartDataColors);

  public monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

}


const ATATCharts = getModule(ChartsStore);
export default ATATCharts;