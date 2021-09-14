import { Validatable } from "../../types/Wizard";
import { Component } from "vue-property-decorator";
import { Route } from "vue-router";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
/**
 *  Provides functionality to automagically call the validation method of a
 *  validatable wizard step when the user attempts to move forward using the
 *  next button
 */
export default class ValidatableWizardStep extends Validatable {
  validate!: () => Promise<boolean>;

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    // const isWizardRoute = to.meta && to.meta.isWizard;
    // const isWizardNext = to.params && to.params.source === "wizard-next";
    
    await this.validate();
    next();

    // if (isWizardRoute && isWizardNext) {
    //   debugger;
    //   const valid = await this.validate();
    //   if (valid) {
    //     next();
    //   }
    // } else {
    //   // clicked something other than Next button, e.g., step link, main menu item, etc.
    //   debugger;
    //   next();
    // }
  }
}
