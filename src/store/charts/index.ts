import { Component } from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'Charts',
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
    cyan: "#00bde3",
    blue: "#0076d6",
    orange: "#fa9441",
    magenta: "#d72d79",
    "green-cool": "#70e17b",
    "indigo-warm": "#b69fff",
    yellow: "#face00",
    "violet-warm": "#b04abd",
    "mint-cool": "#7efbe1",
    "orange-warm": "#914734",
    gray: "#dfe1e2",
  };

  public chartAuxColors = {
    "lineChart-axis": "#3d4551",
    "lineChart-border": "#dfe1e2",
    "lineChart-dataHiliteBorder": "#a9aeb1",
  };

  public chartDataColorSequence = Object.values(this.chartDataColors);

}


const Charts = getModule(ChartsStore);
export default Charts;