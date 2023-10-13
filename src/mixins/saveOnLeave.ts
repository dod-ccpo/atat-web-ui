import Vue from "vue";
import { Route } from "vue-router";
import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import Summary from "@/store/summary";
import { routeNames } from "@/router/stepper";
import { getModule } from "vuex-module-decorators";

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
  public async saveOnLeave(): Promise<boolean> {
    throw new Error("Not Implemented Error");
  }

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    debugger;
    const direction = to.params.direction;
    const goNext = await this.saveOnLeave();
    // const formToValidate = this.$refs.form;
    // const skipValidation = AcquisitionPackage.skipValidation;
    // let isValid = true;
    
    // if(direction === "next" && formToValidate && !skipValidation){
    //   AcquisitionPackage.setValidateNow(true);
    //   isValid = this.$refs.form.validate();
    // } 
    // const currentStepNumber = parseInt(Steps.currentStep?.stepNumber as string);
    // const fromSummaryPage = ["SUMMARYSTEP", "DOWLANDINGPAGE"].some(
    //   pageName => (from.name as string).split("_").join("").toUpperCase().includes(pageName)
    // ) 
    // const previousStepNumber = currentStepNumber - 1;
    // if(direction === "previous" && fromSummaryPage){
    //   await this.returnToSummary(previousStepNumber > 0 ? previousStepNumber : 1 );
    // } else if (
    //   direction === "previous"
    //   && Summary.hasCurrentStepBeenVisited 
    //   && Steps.getPrevStepName.split("_").join("").toUpperCase().includes("SUMMARYSTEP")){
    //   await this.returnToSummary(currentStepNumber);
    // } else  {
    //   this.$nextTick(async ()=> {
    //     AcquisitionPackage.setValidateNow(false);
    //     AcquisitionPackage.setSkipValidation(false);
    //     if (!isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
    //       const el = document.getElementsByClassName("error--text")[0];
    //       if (el) {
    //         el.scrollIntoView({
    //           behavior: "smooth"
    //         });          
    //       }
    //     } else if (goNext && (isValid || AcquisitionPackage.getAllowDeveloperNavigation)) { 
    //       Steps.setLeaveStepComplete(from.name as string);  
    //       Steps.clearAdditionalButtonText();     
    //       AcquisitionPackage.setDisableContinue(false);
    //       next();
    //     }
    //   })
    // }
  };

  public async returnToSummary(stepNumber:number): Promise<void> {
    if (stepNumber){
    let summaryPage = "";
    switch(stepNumber){
    case 1:
      summaryPage = "SummaryStepOne";
      break;
    case 2:
      summaryPage = "SummaryStepTwo";
      break;
    case 3:
      summaryPage = "SummaryStepThree";
      break;
    case 4:
      summaryPage = "Summary_Step_Four";
      break;
    case 5:
      summaryPage = "DOW_Landing_Page";
      break;
    case 6:
      summaryPage = "Summary_Step_Six";
      break;
    case 7:
      summaryPage = "Summary_Step_Seven";
      break;
    case 8:
      summaryPage = "Summary_Step_Eight";
      break;
    default:
      break;
    }
    this.$router.push({
      name: summaryPage,
      params: {
        direction: "next"
      },
    })
  }
  }
}
