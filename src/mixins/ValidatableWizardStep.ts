import { Validatable } from "../../types/Wizard";
import { Component } from "vue-property-decorator";
import { Route } from "vue-router";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
/**
 *  Provides functionality to automagically call the validation method of a
 *  validatable wizard step when the user leaves the step
 */
export default class ValidatableWizardStep extends Validatable {
  validate!: () => Promise<boolean>;
  //todo: stash in coming model from beforeRouteEnter
  //private currentModel: any;
  //async beforeRouteEnter() {

  //todo grab model for current step from the store

  //};

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    //todo compare out going model to in coming model
    // if changes then set touched to true
    // if changes validate
    // if valid save
    await this.validate();

    next();
  }
}
