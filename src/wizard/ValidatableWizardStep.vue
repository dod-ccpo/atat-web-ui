<script lang="ts">
import { Validatable } from "../../types/Wizard";
import { Component, Prop } from "vue-property-decorator";
import { Route } from "vue-router";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave", "beforeRouteEnter"]);
@Component({})
/**
 *  Provides base functionality for validatable wizard steps
 *  Automatically validates and saves before leaving the wizard step
 */
export default class ValidatableWizardStep<TModel> extends Validatable {
  @Prop({ required: true }) step!: number;

  //assign this property to skip validation
  @Prop({ default: false }) skipValidation!: boolean;

  protected touched = false;
  protected valid = false;

  // must be implmented by inheriting class
  public validate: () => Promise<boolean> = () => {
    throw new Error("not implemented");
  };

  protected updateModelState(isValid: boolean): void {

    // EJY how to hit this on step 4?

    this.$store.dispatch("updateStepModelValidity", [this.step, isValid]);
  }

  protected async saveData(): Promise<void> {
    debugger; // VALIDATABLE WIZARD STEP
    // EJY how to hit this on step 4?
    await this.$store.dispatch("saveStepData", this.step);
  }

  protected incomingModel!: TModel;
  protected model!: TModel;

  private hasChanges(): boolean {
    debugger;
    let theSame = true;
    const serializedIncoming = JSON.stringify(this.incomingModel);
    const serialiedOutgoing = JSON.stringify(this.model);
    theSame = serializedIncoming === serialiedOutgoing;

    return !theSame;
  }

  public async mounted(): Promise<void> {
    debugger;
    if (this.$route.meta && this.$route.meta.isWizard) {
      if (this.skipValidation) return;

      this.incomingModel = JSON.parse(JSON.stringify(this.model)) as TModel;
      this.touched = await this.$store.dispatch("isStepTouched", this.step);
      if (this.touched) {
        this.validate();
      }
    }
  }

  public async beforeRouteEnter(
    to: Route,
    from: Route,
    next: (n: unknown) => void
  ): Promise<void> {
    next((vm: ValidatableWizardStep<TModel>) => {
      //loads model before route enter
      vm.model = vm.$store.getters.getStepModel(vm.step);
    });
  }

  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: (n: void) => void
  ): Promise<void> {
    // if the skip validation property is set or if the next
    // route we're heading to is not a wizard route we will skip validation
    if (this.skipValidation) {
      next();
    }
    const isValid = await this.validate();
    await this.updateModelState(isValid);
    const isChanged = this.hasChanges();
    if (isChanged) {
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
