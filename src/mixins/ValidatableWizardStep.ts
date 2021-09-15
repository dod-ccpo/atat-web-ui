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

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    await this.validate();
    next();
  }
}
