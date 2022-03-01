import {  VuexModule, Module, Action, Mutation, getModule} from "vuex-module-decorators";
import store from "../index";
import { StepInfo, StepsState} from "./types";
// import { Mutations} from "./types"
import { buildStepList } from "./helpers";
import { stepperRoutes } from "@/router/stepper";
import { StepperRouteConfig } from "types/Global";



@Module({ name: 'Steps',  namespaced: true, dynamic: true, store})
export class StepsStore extends VuexModule implements StepsState {

    currentStep: StepInfo | undefined = {
        stepName: '',
        stepNumber:'',
        prev: undefined,
        next: undefined,
    };
    steps:StepInfo[] = buildStepList(stepperRoutes);

    @Mutation
    _setCurrentStep({stepNumber, stepName}: {stepNumber: string, stepName: string}): void {
        
        const step = this.steps.find(stepInfo=> 
            stepInfo.stepNumber === stepNumber && stepInfo.stepName === stepName );
    
         if(step){
             this.currentStep = step;
         }
      }

      @Mutation
      public setSteps(stepperRoutes: StepperRouteConfig[]): void{

          this.steps = buildStepList(stepperRoutes);
      }

    @Action
    public setCurrentStep({stepNumber, stepName}: {stepNumber: string, stepName: string}): void {
        this.context.commit('_setCurrentStep', {stepNumber, stepName});
    }
}

const Steps= getModule(StepsStore);
export default Steps;