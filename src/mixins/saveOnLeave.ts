import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { 
  FormRef, 
  RadioFormRef, 
  RadioFormRefAsExternalComponent, 
  SaveOnLeaveRefs 
} from 'types/Global';

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
}) {
 
  let isValid = true;
  const goNext = await p.saveOnLeave();
  const skipValidation = AcquisitionPackage.skipValidation;
  const direction = p.to.query.direction;
  if(direction === "next" && isValid && !skipValidation){
    AcquisitionPackage.setValidateNow(isValid);
    isValid = await validateAllForms(p.form)
  }

  return p.nextTick(()=> {
    AcquisitionPackage.setValidateNow(false);
    AcquisitionPackage.setSkipValidation(false);
    if (direction === "previous"){

    } else if (!isValid && !AcquisitionPackage.getAllowDeveloperNavigation) {
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
