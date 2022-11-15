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
      validate: () => boolean;
    };
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
    const goNext = await this.saveOnLeave();

    const formToValidate = this.$refs.form;
    let isValid = true;

    if(formToValidate){
      AcquisitionPackage.setValidateNow(true);
      isValid = this.$refs.form.validate();
    }
    
    this.$nextTick(()=> {
      AcquisitionPackage.setValidateNow(false);
      if (goNext && isValid) { 
        next();
      }
    })
  }
}
