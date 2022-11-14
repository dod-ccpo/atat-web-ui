import Vue from "vue";
import { Route } from "vue-router";
import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class SaveOnLeave extends Vue {

  $refs!: {
    form: Vue & {
      resetValidation: () => void;
      errorBucket: string[];
      reset: () => void;
      validate: () => boolean;
      errorBag: Record<number, boolean>;
    },
  };


  /**
   * Method that get's called before route leave
   * extending mixins must implement this method
   * the method should return true to proceed to the 
   * next route and false to remain on the current view
   */
  protected async saveOnLeave(): Promise<boolean> {
    throw new Error("Not Implemented Error");
  }

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    let isValid = true;
    // todo - perhaps find the ref with "v-form" in its classList
    const theForm = this.$refs.form as Vue & { validate: () => boolean };
    if (theForm) {
      await AcquisitionPackage.setValidateFormNow(true);
      isValid = theForm.validate()
    }
    const goNext = await this.saveOnLeave();  
    
    this.$nextTick(()=> {
      AcquisitionPackage.setValidateFormNow(false);
      if (goNext && isValid) {
        next();
      }
    })
  }
}
