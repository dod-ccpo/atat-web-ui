import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { SaveOnLeaveRefs } from 'types/Global';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { ComponentPublicInstance } from 'vue';



export type To = RouteLocationNormalized
export type From = RouteLocationNormalized

export async function beforeRouteLeaveFunction(p: {
  to: To, from: From,
  saveOnLeave: () => Promise<boolean>, 
  form: SaveOnLeaveRefs['form'],
  nextTick: (f: () => void) => Promise<void>,
  isValid: boolean,
  // this is an easy way to test the validation state 
  // while we work on our pages before it gets fixed
  // it can be removed after validation is fixed
  isValidOverrideForTesting?: boolean,
}) {
  const goNext = await p.saveOnLeave();
  const skipValidation = AcquisitionPackage.skipValidation;
  const direction = p.to.query.direction;
  if(direction === "next" && p.isValid && !skipValidation){
    AcquisitionPackage.setValidateNow(p.isValid);
  }
  

  // this is an easy way to test the validation state 
  // while we work on our pages before it gets fixed
  // it can be removed after validation is fixed

  // if (typeof p.isValidOverrideForTesting !== 'undefined') {
  //   isValid = p.isValidOverrideForTesting
  // }

  return p.nextTick(()=> {
    AcquisitionPackage.setValidateNow(false);
    AcquisitionPackage.setSkipValidation(false);
    if (!p.isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
      const el = document.getElementsByClassName("v-input--error")[0];
      if (el) {
        el.scrollIntoView({
          behavior: "smooth"
        });
      }
      return false
    } else if (goNext && (p.isValid || AcquisitionPackage.getAllowDeveloperNavigation)) { 
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