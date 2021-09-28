import { Validatable } from "../../types/Wizard";
import { Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave"]);
@Component({})
/**
 *  Provides functionality to automagically call the validation method of a
 *  validatable wizard step when the user leaves the step
 */
export default class ValidatableWizardStep extends Validatable {
  public validate!: () => Promise<boolean>;
  protected saveModel!: () => Promise<void>;
  protected stepMounted!: () => Promise<void>;

  // public async beforeRouteEnter(
  //   to: Route,
  //   from: Route,
  //   next: (n: void) => void
  // ): Promise<void> {
  //   const incomingModel = this.$store.getters["getCurrentStepModel"];
  //   console.log(incomingModel);
  // }

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
