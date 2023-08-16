import Vue from "vue";
import { Route } from "vue-router";
import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import Summary, { isStepTouched, isStepValidatedAndTouched, validateStep } from "@/store/summary";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class SaveOnLeave extends Vue {

  $refs!: {
    form: Vue & {
      validate: () => boolean;
      resetValidation?: () => void;
      reset?: () => void;
    };
  };

  /**
   * Method that gets called before route leave
   * extending mixins must implement this method
   * the method should return true to proceed to the 
   * next route and false to remain on the current view
   */
  protected async saveOnLeave(): Promise<boolean> {
    throw new Error("Not Implemented Error");
  }

  /**
   * if user makes the step untouched b/c of unchecking/unselecting values
   * then set Summary.hasCurrentStepBeenVisited to `false`
   * to restore navigation as if the step has NOT been touched
   */
  public async assessHasCurrentStepBeenVisited(): Promise<void>{
    const currentStepNumber = parseInt(Steps.currentStep?.stepNumber as string);

    if (currentStepNumber && !(await isStepValidatedAndTouched(currentStepNumber))){
      await Summary.setHasCurrentStepBeenVisited(await isStepValidatedAndTouched(currentStepNumber))
    }
  }
  
  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    const goNext = await this.saveOnLeave();
    const formToValidate = this.$refs.form;
    const skipValidation = AcquisitionPackage.skipValidation;
    let isValid = true;
    await this.assessHasCurrentStepBeenVisited();
    const direction = to.params.direction;
    if(direction === "next" && formToValidate && !skipValidation){
      AcquisitionPackage.setValidateNow(true);
      isValid = this.$refs.form.validate();
    }
    
    this.$nextTick(()=> {
      //validate step and update summary store item
      
      AcquisitionPackage.setValidateNow(false);
      AcquisitionPackage.setSkipValidation(false);
      if (!isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
        const el = document.getElementsByClassName("error--text")[0];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth"
          });          
        }
      } else if (goNext && (isValid || AcquisitionPackage.getAllowDeveloperNavigation)) { 
        Steps.setLeaveStepComplete(from.name as string);  
        Steps.clearAdditionalButtonText();     
        AcquisitionPackage.setDisableContinue(false);
        next();
      }
    })
  }
}
