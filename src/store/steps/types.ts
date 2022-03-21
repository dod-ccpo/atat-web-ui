export type StepRouteResolver = (current: string) => string;
export interface StepInfo {
    stepNumber: string;
    stepName: string;
    stepLabel: string;
    prev: string | undefined;
    next: string | undefined;
    resolver: StepRouteResolver | undefined;
    additionalButtons: AdditionalButton[] | undefined;
}

export interface AdditionalButton {
    name: string;
    buttonText: string;
    buttonId: string;
    isPrimary: boolean;
    emitText: string;
    component: string;
    actionName: string;
    route: string;
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

