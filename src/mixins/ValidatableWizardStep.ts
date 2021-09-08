import { Validatable } from "../../types/Wizard";
import { Component } from "vue-property-decorator";
import { Route } from "vue-router";
import { nextTick } from "vue/types/umd";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class ValidatableWizardStep extends Validatable {
  validate!: () => Promise<boolean>;

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ) {
    debugger;

    const isWizardRoute = to.meta && to.meta.isWizard;
    const isWizardNext = to.params && to.params.source === "wizard-next";

    if (isWizardRoute && isWizardNext) {
      const valid = await this.validate();
      if (valid) {
        next();
      }
    } else {
      next();
    }
  }
}
