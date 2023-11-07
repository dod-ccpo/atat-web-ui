import { Vue } from 'vue-facing-decorator'
import { RouteLocationNormalized } from "vue-router";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import { SaveOnLeaveRefs } from 'types/Global';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { ComponentPublicInstance } from 'vue';
import { ref } from 'vue';



export type To = RouteLocationNormalized
export type From = RouteLocationNormalized

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
  let validateAllForms: boolean[] = [];
  const refKeys = Object.keys(p.form);
  debugger;
  for (let i=0;i<refKeys.length;i++){
    switch(refKeys[i].toLowerCase()){
    case "form":
      validateAllForms.push(await (await (p.form.form).validate()).valid);
      break;
    case "atatradioform":
      p.form.ATATRadioForm.setErrorMessage();
      validateAllForms.push(
        await (await (p.form.ATATRadioForm).$refs.radioButtonGroup.validate()).valid
      );
      break;
    }
  }
  const isValid = validateAllForms.every(f=>f)
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
      const el = document.getElementsByClassName("error--text")[0];
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