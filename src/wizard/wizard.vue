<template>
  <v-container fluid>
    <Stepper
      :step-number="stepNumber"
      :current-step-number.sync="stepNumber"
      @clicked-action="getStep"
    />
    <router-view></router-view>
    <ButtonNavigation @clicked-action="getRoute" :step-number="stepNumber" />
  </v-container>
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
import { Route } from "vue-router";

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

  $refs!: {
    stepOne: Step1;
    stepTwo: Step2;
    stepTwoSummary: Step2Summary;
    stepThree: Step3;
  };

  private resolveActions(currentRoute: Route, actions: string[]) {
    debugger;

    actions.forEach(async (a) => {
      let action = a.toLowerCase();
      debugger;

      const nextRoute =
        currentRoute.meta && currentRoute.meta.isWizard
          ? currentRoute.meta.next
          : undefined;
      const previousRoute =
        currentRoute.meta && currentRoute.meta.isWizard
          ? currentRoute.meta.previous
          : undefined;

      switch (action) {
        case "next":
          if (nextRoute) {
            this.$router.push({
              name: nextRoute,
              params: {
                source: "wizard-next",
              },
            });
          } else {
            throw new Error("unable to resolve wizard route");
          }
          break;
        case "summary":
          // todo: move this router logic to the store
          if (this.$route.name === "addfunding") {
            // await this.$router.push({ name: "fundingsummary" });
            this.$store.dispatch("wizardNext");
          } else if (this.$route.name === "editfunding") {
            await this.$router.push({ name: "fundingsummary" });
            this.stepNumber = 2;
          } else if (this.$route.name === "fundingsummary") {
            this.$store.dispatch("wizardNext");
            this.stepNumber = 3;
          }
          break;
        case "previous":
          if (previousRoute) {
            this.$router.push({ name: previousRoute });
          } else {
            throw new Error("unable to resolve wizard route");
          }
          break;
        case "cancel":
          await this.$router.push({ name: "portfolios" });
          break;
        case "save":
          alert("Data has been validated and is to be saved");
          await this.$router.push({ name: "portfolios" });

          break;
      }
    }, this);
  }
  public getRoute(actions: string[]): void {
    this.resolveActions(this.currentRoute, actions);
  }
  public getStep(currStepNumber: number): void {
    debugger;
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
    this.$router.push({ name: `${this.route}` });
    this.stepNumber = currStepNumber;
  }
  public checkPath(): void {
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.currentRoute = this.$route;
    }

    switch (this.$route.name) {
      case "addportfolio":
        this.stepNumber = 1;
        break;
      case "addfunding":
        this.stepNumber = 2;
        break;
      case "editfunding":
        this.stepNumber = 2;
        break;
      case "fundingsummary":
        this.stepNumber = 2;
        break;
      case "addapplication":
        this.stepNumber = 3;
        break;
      case "addteammembers":
        this.stepNumber = 4;
        break;
      case "reviewandsubmit":
        this.stepNumber = 5;
        break;
      case "postreview":
        this.stepNumber = 5;
        break;
      case "submit":
        this.stepNumber = 5;
        break;
      default:
        break;
    }
  }
  public mounted(): void {
    this.checkPath();
  }
  @Watch("$route")
  onRouteChanged(): void {
    debugger;
    if (this.$route.meta && this.$route.meta.isWizard) {
      this.currentRoute = this.$route;
    }
    this.checkPath();
  }
}
</script>
