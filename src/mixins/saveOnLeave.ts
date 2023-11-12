import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { 
  FormRef, 
  SaveOnLeaveRefs 
} from 'types/Global';
import { ComponentPublicInstance } from 'vue';

export type To = RouteLocationNormalized
export type From = RouteLocationNormalized

export let isFormsValid:boolean[] = []
 
export const validateAllForms = async (forms:SaveOnLeaveRefs): Promise<boolean> => {
  debugger;
  isFormsValid = [];
  for (const f in forms){
    const form = (forms as unknown as FormRef)[f];
    if (form){
      console.log('22: => ' + f)
      if (Object.prototype.hasOwnProperty.call(form, "setErrorMessage")){
        form.setErrorMessage();
      } 
      if (Object.prototype.hasOwnProperty.call(form, "validate")){
        const isFormValid = (await form.validate()).valid;
        isFormsValid.push(isFormValid);
      } else {
        await(getRef(form))
      }
    }
  }
  console.log(isFormsValid)
  return isFormsValid.every(f=>f===true)
}

async function getRef(form:ComponentPublicInstance):Promise<void>{
  const refs = form.$refs || form;
  if (refs){
    for (const ref in refs){
      console.log('42: => ' + ref)
      const _formRef = (refs as unknown as FormRef)[ref];
      if (Object.prototype.hasOwnProperty.call(_formRef, "validate")){
        isFormsValid.push((await(_formRef.validate())).valid);
      }
      if (Object.prototype.hasOwnProperty.call(_formRef, "setErrorMessage")){
        (_formRef).setErrorMessage()
      }

      await getRef(_formRef);
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
      //add something here

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
