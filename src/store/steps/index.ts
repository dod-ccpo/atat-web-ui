import {  VuexModule, Module, Action, Mutation, getModule} from "vuex-module-decorators";
import rootStore from "../index";
import { Mutations, StepInfo, StepsState} from "./types";
import { mapStepConfigs } from "./helpers";
import { stepperRoutes } from "@/router/stepper";
import { StepperRouteConfig } from "types/Global";



@Module({ name: 'Steps',  namespaced: true, dynamic: true, store: rootStore})
export class StepsStore extends VuexModule implements StepsState {

    currentStep: StepInfo | undefined = {
        stepName: '',
        stepNumber:'',
        stepLabel: '',
        prev: undefined,
        next: undefined,
    };
    
    stepMap: Map<string, StepInfo> = mapStepConfigs(stepperRoutes);

    @Mutation
    [Mutations.SET_CURRENT_STEP](stepName: string): void {
        const step = this.stepMap.get(stepName);
    
         if(step){
             this.currentStep = step;
         }
      }

      @Mutation
      public setSteps(stepperRoutes: StepperRouteConfig[]): void{
          this.stepMap = mapStepConfigs(stepperRoutes);
      }

    @Action({ rawError: true })    
    public setCurrentStep(stepName: string): void {
        this.context.commit(Mutations.SET_CURRENT_STEP, stepName);
    }

    @Action({rawError: true})
    public findRoute(name: string): StepInfo | undefined {
        return this.stepMap.get(name);
    }
}

const Steps= getModule(StepsStore);
export default Steps;