import {  VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import store from "../index";
import { StepInfo, StepsState} from "./types";
import { Mutations} from "./types"
import { buildStepList } from "./helpers";
import { stepperRoutes } from "@/router/stepper";



@Module({ name: 'StepsStore', dynamic: true, namespaced: true, store })
class StepsStore extends VuexModule implements StepsState {

    currentStep: StepInfo | undefined;
    steps:StepInfo[] = buildStepList(stepperRoutes);

    @Mutation
    [Mutations.SET_CURRENT_STEP]({stepNumber, stepName}: {stepNumber: string, stepName: string}): void {
        
        const step = this.steps.find(stepInfo=> 
            stepInfo.stepNumber === stepNumber && stepInfo.stepName === stepName );
    
         if(step){
             this.currentStep = step;
         }
      }

    @Action
    public setCurrentStep({stepNumber, stepName}: {stepNumber: string, stepName: string}): void {
        this.context.commit(Mutations.SET_CURRENT_STEP, {stepNumber, stepName});
    }
}

export default getModule(StepsStore);