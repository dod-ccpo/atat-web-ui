<script lang="ts">
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
export default class ValidatableWizardStep<TModel> extends Validatable {

  // must be implmented by inheriting class
  public validate: () => Promise<boolean> = () => {
    throw new Error("not implemented");
  }
  // must be implemented by inheriting class
  protected saveModel: () => Promise<void> = () => {
    throw new Error("not implemented");

  }
  protected stepMounted!: () => Promise<void>;
  private incomingModel!: TModel;
  protected model!: TModel;

  private hasChanges(): boolean {
    let theSame = true;
    const serializedIncoming = JSON.stringify(this.incomingModel);
    const serialiedOutgoing = JSON.stringify(this.model);
    theSame = serializedIncoming === serialiedOutgoing;
    return !theSame;
  }

  public async mounted(): Promise<void> {
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.incomingModel = this.$store.state.currentStepModel;
    }
    this.stepMounted();
  } 

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    if (this.hasChanges()) {
      const isValid = await this.validate();
      if (isValid) {
        await this.saveModel();
      }
    }

    next();
  }
}
</script>
