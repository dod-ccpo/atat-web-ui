import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { FormRef, RadioFormRef, RadioFormRefAsExternalComponent, SaveOnLeaveRefs } from 'types/Global';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { ComponentPublicInstance } from 'vue';
import { ref } from 'vue';



export type To = RouteLocationNormalized
export type From = RouteLocationNormalized
 
export const validateAllForms = async (forms:SaveOnLeaveRefs): Promise<boolean> => {
  const refKeys = Object.keys(forms)
  const validatedForms: boolean[] = [];
  debugger;
  for (const ref of refKeys){
    if (ref.toLowerCase().includes("radio")){
      if (ref.toLowerCase().includes("external")){
        const radioFormWithExternalComponent = 
          (forms as unknown as RadioFormRefAsExternalComponent)[ref];
        radioFormWithExternalComponent.$refs.radioButtonGroup.setErrorMessage();
        validatedForms.push(
          // eslint-disable-next-line max-len
          await (await radioFormWithExternalComponent.$refs.radioButtonGroup.$refs.radioButtonGroup.validate()).valid
        );
      } else {
        const radioForm = (forms as unknown as RadioFormRef)[ref];
        radioForm.setErrorMessage();
        validatedForms.push(
          await (await radioForm.$refs.radioButtonGroup.validate()).valid
        );
      }
    } else if (ref.toLowerCase() === "form"){
      const form = (forms as unknown as FormRef)[ref] ;
      validatedForms.push(await (await (form).validate()).valid);
    }
  }
  return validatedForms.every(f=>f)
}


export async function beforeRouteLeaveFunction(p: {
  to: To, from: From,
  saveOnLeave: () => Promise<boolean>, 
  form: SaveOnLeaveRefs,
  nextTick: (f: () => void) => Promise<void>,
  isValid?: boolean,
  // this is an easy way to test the validation state 
  // while we work on our pages before it gets fixed
  // it can be removed after validation is fixed
  isValidOverrideForTesting?: boolean,
}) {
 
  const isValid = await validateAllForms(p.form)
  const goNext = await p.saveOnLeave();
  const skipValidation = AcquisitionPackage.skipValidation;
  const direction = p.to.query.direction;
  if(direction === "next" && isValid && !skipValidation){
    AcquisitionPackage.setValidateNow(isValid);
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
    if (!isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
      const el = document.getElementsByClassName("error--text")[0];
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
