<template>
  <div>
    <Stepper
      :step-number="stepNumber"
      :current-step-number.sync="stepNumber"
      @clicked-action="getStep"
      class="px-14 bg-white"
    />
    <router-view class="wizard-content height-100"></router-view>
    <ButtonNavigation
      ref="buttonNavigation"
      @clicked-action="getRoute"
      :step-number="stepNumber"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Stepper from "./Navigation/StepperNavigation.vue";
import ButtonNavigation from "./Navigation/ButtonNavigation.vue";
import Step1 from "./Step1/views/Step1.vue";
import Step2 from "./Step2/views/Step2.vue";
import Step2Summary from "./Step2/views/Step2Summary.vue";
import Step3 from "./Step3/views/Step3.vue";
import Step4 from "./Step4/views/Step4.vue";
import Step5 from "./Step5/views/Step5.vue";
import { NavigationFailure, Route } from "vue-router";

Component.registerHooks(["beforeRouteEnter"]);
@Component({
  components: {
    Stepper,
    Step1,
    Step2,
    Step2Summary,
    Step3,
    Step4,
    Step5,
    ButtonNavigation,
  },
})
export default class Wizard extends Vue {
  private stepNumber = 1;
  private route = "";
  private currentRoute!: Route;
  private navigationRedirected = 2;

  $refs!: {
    stepOne: Step1;
    stepTwo: Step2;
    stepTwoSummary: Step2Summary;
    stepThree: Step3;
    buttonNavigation: ButtonNavigation;
  };

  private async resolveActions(
    currentRoute: Route,
    actions: string[]
  ): Promise<void> {
    actions.forEach(async (a) => {
      let action = a.toLowerCase();
      const returnToReview = this.$store.getters["wizard/isReturnToReview"];
      this.$store.dispatch("wizard/setReturnToReview", false);
      const nextRoute = returnToReview
        ? "reviewandsubmit"
        : currentRoute.meta && currentRoute.meta.isWizard
        ? currentRoute.meta.next
        : undefined;
      const previousRoute =
        currentRoute.meta && currentRoute.meta.isWizard
          ? currentRoute.meta.previous
          : undefined;

      switch (action) {
        case "next":
          if (nextRoute) {
            this.routerPush({
              name: nextRoute,
              params: {
                source: "wizard-next",
              },
            });
          } else {
            throw new Error("unable to resolve wizard route");
          }
          break;
        case "previous":
          if (previousRoute) {
            this.routerPush({
              name: previousRoute,
              params: {
                source: "wizard-previous",
              },
            });
          } else {
            throw new Error("unable to resolve wizard route");
          }
          break;
        case "cancel":
          await this.routerPush({ name: "portfolios" });
          break;
        case "save":
          try {
            const saved = await this.$store.dispatch(
              "wizard/saveAllValidSteps"
            );
            if (saved) {
              alert("Data has been validated and is saved");
              await this.routerPush({ name: "portfolios" });
            }
          } catch (error) {
            alert("An error occurred saving portfolio");
          }

          break;
      }
    }, this);
  }
  public getRoute(actions: string[]): void {
    this.resolveActions(this.currentRoute, actions);
  }
  public getStep(currStepNumber: number): void {
    // avoids redundant navigation
    if (currStepNumber === this.stepNumber) return;

    switch (currStepNumber) {
      case 1:
        this.route = "addportfolio";
        break;
      case 2:
        this.route = "addfunding";
        break;
      case 3:
        this.route = "addapplication";
        break;
      case 4:
        this.route = "addteammembers";
        break;
      case 5:
        this.route = "reviewandsubmit";
        break;
      default:
        break;
    }
    this.routerPush({ name: `${this.route}` });
    this.stepNumber = currStepNumber;
  }
  public checkPath(): void {
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.currentRoute = this.$route;
      this.stepNumber = this.$route.meta.step;
    }
  }
  public mounted(): void {
    this.checkPath();
  }
  @Watch("$route")
  onRouteChanged(): void {
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.currentRoute = this.$route;
    }
    this.checkPath();
  }

  //centeralizing wizard calls to router push
  //in order to catch Navigation failure errors
  //that result from intentional redirects
  private routerPush(option: any) {
    this.$router.push(option).catch((e) => {
      const navigationFailure = e as NavigationFailure;

      //we will swallow navigation redirect failures caught
      // here
      if (
        navigationFailure &&
        navigationFailure.type === this.navigationRedirected
      ) {
        return;
      } else {
        Promise.reject(e);
      }
    });
  }
}
</script>
<style>
.side-drawer-open {
  width: calc(100% - 400px) !important;
}
</style>
