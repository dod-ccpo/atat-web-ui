export type StepRouteResolver = (current: string) => string;
export type StepPathResolver = (current: string, direction: string)=> string;
export interface StepInfo {
    stepNumber: string;
    stepName: string;
    stepLabel: string;
    prev: string | undefined;
    next: string | undefined;
    resolver: StepRouteResolver | StepPathResolver | undefined;
    additionalButtons: AdditionalButton[];
    backButtonText: string | undefined;
}

export interface AdditionalButton {
    name: string;
    buttonText: string;
    buttonId: string;
    buttonClass?: string;
    emitText?: string;
    actionName?: string;
    actionArgs?: string[];
}

export interface StepsState {
    currentStep: StepInfo | undefined;
    stepMap: Map<string, StepInfo>
    setCurrentStep: (stepName: string) => void
}

export enum Mutations {
    SET_CURRENT_STEP = "SET_CURRENT_STEP"
}

export enum RouteDirection {
    NEXT = "NEXT",
    PREVIOUS = "PREVIOUS"
}
