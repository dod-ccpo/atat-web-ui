import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { ComponentPublicInstance } from "vue";

export type SaveOnLeaveRefs = ComponentPublicInstance['$refs'] & {
  form: ComponentPublicInstance & {
    validate: () => Promise<boolean>;
    resetValidation?: () => void;
    reset?: () => void;
  };
};

export type To = RouteLocationNormalized
export type From = RouteLocationNormalized

export async function beforeRouteLeaveFunction(p: {
  to: To, from: From,
  saveOnLeave: () => Promise<boolean>, 
  form: SaveOnLeaveRefs['form'],
  nextTick: (f: () => void) => Promise<void>,
  isValidOverrideForTesting?: boolean,
}) {
  const goNext = await p.saveOnLeave();
  const formToValidate = p.form;
  const skipValidation = AcquisitionPackage.skipValidation;

  let isValid = true;
  const direction = p.to.query.direction;
  if(direction === "next" && formToValidate && !skipValidation){
    AcquisitionPackage.setValidateNow(true);
    isValid = await p.form.validate()
  }

  if (typeof p.isValidOverrideForTesting !== 'undefined') {
    isValid = p.isValidOverrideForTesting
  }

  return p.nextTick(()=> {
    AcquisitionPackage.setValidateNow(false);
    AcquisitionPackage.setSkipValidation(false);
    if (!isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
      const el = document.getElementsByClassName("field-error")[0];
      if (el) {
        el.scrollIntoView({
          behavior: "smooth"
        });
      }
      return false
    } else if (goNext && (isValid || AcquisitionPackage.getAllowDeveloperNavigation)) { 
      Steps.setLeaveStepComplete(p.from.name as string);  
      Steps.clearAdditionalButtonText();     
      AcquisitionPackage.setDisableContinue(false);
      return true
    }
  }).catch((error) => {
    console.log(error)
    return false
  })
}

export default Vue