import { VNodeDirective } from "vue/types/umd";

export interface StepInfo {

    stepNumber: string;
    stepName: string;
    prev: StepInfo | undefined;
    next: StepInfo | undefined;
}


export interface StepsState {

     currentStep : StepInfo | undefined;
     steps: Array<StepInfo>
     setCurrentStep: ({stepNumber, stepName}: {stepNumber: string, stepName: string})=> void
}


export enum Mutations {
    SET_CURRENT_STEP = "SET_CURRENT_STEP"   
  }

