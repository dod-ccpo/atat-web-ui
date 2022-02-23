export interface StepperStep {
    stepNumber?: string;
    completed?: boolean;
    completePercentageWeight?: number;
    menuText?: string;
    route: string;
    subSteps?: StepperStep[];   
}

