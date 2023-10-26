import { Vue, Component, toNative } from "vue-facing-decorator";
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { ComponentPublicInstance } from "vue";

// Register the router hooks with their names
// Component.registerHooks(["beforeRouteLeave"]);
@Component({})
class SaveOnLeave extends Vue {

  $refs!: {
    form: ComponentPublicInstance & {
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

  public async beforeRouteLeave(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: (n: void) => void
  ): Promise<void> {
    const goNext = await this.saveOnLeave();
    const formToValidate = this.$refs.form;
    const skipValidation = AcquisitionPackage.skipValidation;
    let isValid = true;
    const direction = to.params.direction;
    if(direction === "next" && formToValidate && !skipValidation){
      AcquisitionPackage.setValidateNow(true);
      isValid = this.$refs.form.validate();
    }
    
    this.$nextTick(()=> {
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
        // Steps.setLeaveStepComplete(from.name as string);  
        // Steps.clearAdditionalButtonText();     
        AcquisitionPackage.setDisableContinue(false);
        next();
      }
    })
  }
}


export default SaveOnLeave
