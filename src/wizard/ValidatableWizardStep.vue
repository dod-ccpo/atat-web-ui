<script lang="ts">
import { Validatable } from "../../types/Wizard";
import { Component, Watch } from "vue-property-decorator";
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
  };
  // must be implemented by inheriting class
  protected saveModel: () => Promise<void> = () => {
    throw new Error("not implemented");
  };

  // must be implemented by inheriting class
  protected saveData: () => Promise<void> = () => {
    throw new Error("not implemented");
  };

  protected onHasChanges!: () => boolean;

  protected stepMounted!: () => Promise<void>;
  private incomingModel!: TModel;
  protected model!: TModel;

  private hasChanges(): boolean {
    let theSame = true;
    const serializedIncoming = JSON.stringify(this.incomingModel);
    const serialiedOutgoing = JSON.stringify(this.model);
    theSame = serializedIncoming === serialiedOutgoing;

    if (this.onHasChanges) {
      return !theSame && this.onHasChanges();
    }

    return !theSame;
  }

  public async mounted(): Promise<void> {
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.incomingModel = this.$store.state.currentStepModel;
    }
    if (this.stepMounted) {
      await this.stepMounted();
     }
  }

  @Watch("$store.state.validationStamp")
  async onValidationTriggered(): Promise<void> {
    if (this.hasChanges()) {
      await this.saveModel();
      await this.validate();
    }
  }

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    const isValid = await this.validate();
    await this.saveModel();
    if (this.hasChanges()) {
      try {
        if (isValid) {
          await this.saveData();
        }
      } catch (error) {
        console.log(error);
      }
    }

    next();
  }
}
</script>
