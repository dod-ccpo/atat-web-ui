import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import rootStore from "../index";
import { Mutations, RouteDirection, StepInfo, 
  StepPathResolver, StepRouteResolver, StepsState } from "./types";
import { mapStepConfigs } from "./helpers";
import { stepperRoutes } from "@/router/stepper";
import { StepperRouteConfig } from "types/Global";

@Module({ name: 'Steps', namespaced: true, dynamic: true, store: rootStore })
export class StepsStore extends VuexModule implements StepsState {

    currentStep: StepInfo | undefined = {
      stepName: '',
      stepNumber: '',
      stepLabel: '',
      prev: undefined,
      next: undefined,
      resolver: undefined,
      additionalButtons: [],
      backButtonText: '',
      continueButtonText:'',
      completed: false,
      completePercentageWeight: 0,
      lastStep: false,
      parentName: undefined
    };
    
    stepMap: Map<string, StepInfo> = mapStepConfigs(stepperRoutes);

    altBackButtonText = "";
    altAdditionalButtonText = "";
    additionalButtonId = "";
    additionalButtonHide = false;

    altBackDestination = "";

    @Mutation
    public setStepComplete(stepName: string): void {
      const step = this.stepMap.get(stepName);
      if(step && step.lastStep === true){
        step.completed = true; 
        this.stepMap.set(stepName, step);
        if(step.parentName){
          const parentStep = this.stepMap.get(step.parentName);
          if(parentStep){
            parentStep.completed = true;
            this.stepMap.set(step.parentName, parentStep);
          }
        }
      }
    }

    @Action 
    public async setAltBackDestination(text: string): Promise<void> {
      this.doSetAltBackDestination(text);
    }
    @Mutation
    public async doSetAltBackDestination(text: string): Promise<void> {
      this.altBackDestination = text;
    }

    @Mutation
    public setAltBackButtonText(text: string): void {
      this.altBackButtonText = text;
    }

    @Mutation
    public clearAltBackButtonText(): void {
      this.altBackButtonText = "";
    }

    @Action
    public setAdditionalButtonText(
      { buttonText, buttonId }: Record<string, string>
    ): void {
      this.doSetAdditionalButtonText({ buttonText, buttonId });
    }

    @Mutation
    public doSetAdditionalButtonText(
      { buttonText, buttonId }: Record<string, string>
    ): void {
      this.altAdditionalButtonText = buttonText;
      this.additionalButtonId = buttonId;
    }

    @Mutation
    public resetAdditionalButtonText(): void {
      this.altAdditionalButtonText = "";
      this.additionalButtonId = "";
    }

    @Action
    public setAdditionalButtonHide(bool: boolean): void {
      this.doSetAdditioinalButtonHide(bool);
    }

    @Mutation
    public doSetAdditioinalButtonHide(bool: boolean): void {
      this.additionalButtonHide = bool;
    }

    @Mutation
    [Mutations.SET_CURRENT_STEP](stepName: string): void {
      const step = this.stepMap.get(stepName);
      if (step) {
        this.currentStep = step;
      }
      if (this.currentStep) {
        this.currentStep.backButtonText = this.altBackButtonText 
          ? this.altBackButtonText 
          : "Back";
        if (
          this.currentStep.additionalButtons.length > 0
          && ((this.altAdditionalButtonText && this.additionalButtonId) 
          || this.additionalButtonHide)
        ) {
          const i = this.currentStep.additionalButtons.findIndex(
            obj => obj.buttonId === this.additionalButtonId
          );
          if (i > -1) {
            if (this.altAdditionalButtonText) {
              this.currentStep.additionalButtons[i].buttonText = this.altAdditionalButtonText;
            }
            this.currentStep.additionalButtons[i].hide = this.additionalButtonHide;
          }
        }
      }
    }

    @Mutation
    public setSteps(stepperRoutes: StepperRouteConfig[]): void {
      this.stepMap = mapStepConfigs(stepperRoutes);
    }

    @Action({ rawError: true })
    public setCurrentStep(stepName: string): void {
      this.context.commit(Mutations.SET_CURRENT_STEP, stepName);
    }

    @Action({ rawError: true })
    public findRoute(name: string): StepInfo | undefined {
      return this.stepMap.get(name);
    }

    @Action({ rawError: true })
    public async resolveRoute(direction: RouteDirection): Promise<string 
    | StepRouteResolver | StepPathResolver | undefined> {
      const nextStepName = direction === RouteDirection.NEXT 
        ? (this.currentStep?.next || '') 
        : (this.currentStep?.prev || '');

      const currentStepName = this.currentStep?.stepName;

      if (currentStepName === undefined || nextStepName.length === 0)
        return undefined;

      const nextStep = await this.findRoute(nextStepName) || undefined;

      const stepResolver = nextStep?.resolver;

      if (stepResolver) {
        return stepResolver;
      }

      return nextStep?.stepName;
    }

    @Action({ rawError: true })
    public async getNext(): Promise<string | StepRouteResolver | StepPathResolver | undefined> {
      return this.resolveRoute(RouteDirection.NEXT);
    }

    @Action({ rawError: true })
    public async getPrevious(): Promise<string | StepRouteResolver | StepPathResolver| undefined> {
      return this.resolveRoute(RouteDirection.PREVIOUS)
    }
}

const Steps = getModule(StepsStore);
export default Steps;
