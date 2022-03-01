export interface StepInfo {

    stepNumber: string;
    stepName: string;
    stepLabel: string;
    prev: string | undefined;
    next: string | undefined;
}

export interface StepsState {

     currentStep : StepInfo | undefined;
     stepMap: Map<string, StepInfo>
     setCurrentStep: (stepName: string)=> void
}


export enum Mutations {
    SET_CURRENT_STEP = "SET_CURRENT_STEP"   
  }

