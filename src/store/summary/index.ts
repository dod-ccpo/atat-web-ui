import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { SummaryItem } from "types/Global";
import Vue, { ComponentOptions, PluginFunction, AsyncComponent } from 'vue'

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

@Module({
  name: 'Summary',
  namespaced: true,
  dynamic: true,
  store: rootStore
  })
// // Step 4 - Contract Details
// /* 4.0 */   import ContractDetails from "../steps/04-ContractDetails/Index.vue";
/* 4.1.1 */ 
import PeriodOfPerformance from "../steps/04-ContractDetails/PeriodOfPerformance.vue";
import Periods from "../periods";
// /* 4.1.2 */ import POPStart from "@/steps/04-ContractDetails/POPStart.vue";
// /* 4.1.2 */ 
//import RecurringRequirement from "../steps/04-ContractDetails/RecurringRequirement.vue";
// /* 4.2 */   import ContractType from "../steps/04-ContractDetails/ContractType.vue";
// /* 4.3 */   import ClassificationRequirements
// from "../steps/04-ContractDetails/ClassificationRequirements.vue";
// import SecurityRequirements from "@/steps/04-ContractDetails/SecurityRequirements.vue";
// import CrossDomain from "@/steps/04-ContractDetails/CrossDomain.vue";

export class SummaryStore extends VuexModule {

  
  summaryItem: SummaryItem ={
    title: "",
    description: "",
    isComplete: false,
    isTouched: false,
    routeName: "",
    step: 0,
    substep: 0
  }
  public summaryItems: SummaryItem[] = []

  @Action({rawError: true})
  public async assessPeriodOfPerformance(): Promise<void>{
    const selectedPeriods = Periods.periods;
    const isTouched = (selectedPeriods.length>0)
    const isComplete =  (!isTouched)
      || (selectedPeriods.length >0 && selectedPeriods.every(
        sp => sp.period_unit_count !== ""
      ));
    const POPSummaryItem: SummaryItem = {
      title: "Period of Performance (PoP)",
      description: " 1-year base period with two 1-year options",
      isComplete,
      isTouched,
      routeName: "",
      step: 4,
      substep: 1
    }
    this.doSetSummaryItem(POPSummaryItem)
  }

  @Mutation
  public async doSetSummaryItem(summaryItem:SummaryItem):Promise<void>{
    const existingIndex = this.summaryItems.findIndex(
      si=>(si.step === summaryItem.step) && (si.substep === summaryItem.substep));
    this.summaryItems[existingIndex] = summaryItem;
  }
}

const Summary = getModule(SummaryStore);
export default Summary;
