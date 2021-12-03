import { Component } from "vue-property-decorator";
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import WizardState from "@/store/modules/wizard/types";
// import {
//   ApplicationModel,
//   EnvironmentModel,
//   OperatorModel,
// } from "types/Portfolios";

const namespace = "wizard";

/**
 * Mixin to encapsulate application store module data
 */
@Component({})
export default class WizardModuleData extends Vue {
  @State(namespace) wizardState!: WizardState;
  @Action("createPortfolioDraft", { namespace })
  createPortfolioDraft!: () => void;
}
