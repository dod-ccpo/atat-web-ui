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
import { ComponentPublicInstance } from 'vue';

export type To = RouteLocationNormalized
export type From = RouteLocationNormalized

export let isFormsValid:boolean[] = []
 
export const validateAllForms = async (forms:SaveOnLeaveRefs): Promise<boolean> => {
  const refKeys = Object.keys(forms)
  let validatedForms: boolean[] = [];
  const isValid: boolean[] = [];

  debugger;
  isFormsValid = [];
  for (const ref of refKeys){
    const form = (forms as unknown as FormRef)[ref];
    await(getRef({form}))
  }
  console.log(isFormsValid)
  return isFormsValid.every(f=>f)
}

async function getRef(p:{
  form:ComponentPublicInstance, 
}):Promise<void>{
  // debugger;
  // console.log(p.form);
  const refs = p.form.$refs;
  if (refs){
    for (const ref in refs){
      const _formRef = (refs as unknown as SaveOnLeaveRefs)[ref];
      if (Object.keys(_formRef).includes("validate")){
        
        const validMuch = ((await(await _formRef).validate()).valid);
        console.log(ref);
        console.log(validMuch)
        isFormsValid.push((await(await _formRef).validate()).valid);
      }
      await getRef({form:_formRef});
    }
  }
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
