<template>
  <v-container fluid>
    <Stepper
      :step-number="stepNumber"
      :current-step-number.sync="stepNumber"
      @clicked-action="getStep"
    />
    <router-view></router-view>
    <!--    <Step1 ref="stepOne" v-if="stepNumber === 1" />-->
    <!--    <Step2 ref="stepTwo" v-if="stepNumber === 2 && !showSummary" />-->
    <!--    <Step2Summary-->
    <!--      ref="stepTwoSummary"-->
    <!--      v-if="stepNumber === 2 && showSummary"-->
    <!--      @clicked-action="getRoute"-->
    <!--    />-->
    <!--    <Step3 v-if="stepNumber === 3" />-->
    <!--    <Step4 v-if="stepNumber === 4" />-->
    <!--    <Step5 v-if="stepNumber === 5" />-->
    <ButtonNavigation @clicked-action="getRoute" :step-number="stepNumber" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Stepper from "./Navigation/StepperNavigation.vue";
import ButtonNavigation from "./Navigation/ButtonNavigation.vue";
import Step1 from "./Step1/views/Step1.vue";
import Step2 from "./Step2/views/Step2.vue";
import Step2Summary from "./Step2/views/Step2Summary.vue";
import Step3 from "./Step3/views/Step3.vue";
import Step4 from "./Step4/views/Step4.vue";
import Step5 from "./Step5/views/Step5.vue";

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
  $refs!: {
    stepOne: Step1;
    stepTwo: Step2;
    stepTwoSummary: Step2Summary;
    stepThree: Step3;
  };

  private showSummary = false;

  public getRoute(actions: string[]): void {
    actions.forEach(async (a) => {
      let action = a.toLowerCase();
      console.log(action);
      switch (action) {
        case "next":
          if (this.$route.name == "addportfolio") {
            await this.$router.push({ name: "addfunding" });
            this.stepNumber = 2;
          } else if (this.$route.name == "addfunding") {
            await this.$router.push({ name: "addapplication" });
            this.stepNumber = 3;
          } else if (this.$route.name == "addapplication") {
            await this.$router.push({ name: "addteammembers" });
            this.stepNumber = 4;
          } else if (this.$route.name == "addteammembers") {
            await this.$router.push({ name: "reviewandsubmit" });
            this.stepNumber = 5;
          }
          break;
        case "summary":
          if (this.$route.name == "addfunding") {
            await this.$router.push({ name: "fundingsummary" });
          } else if (this.$route.name == "editfunding") {
            await this.$router.push({ name: "fundingsummary" });
            this.stepNumber = 2;
          } else if (this.$route.name == "fundingsummary") {
            await this.$router.push({ name: "addapplication" });
            this.stepNumber = 3;
          }
          break;
        case "previous":
          if (this.$route.name == "addportfolio") {
            return;
          } else if (this.$route.name == "addfunding") {
            await this.$router.push({ name: "addportfolio" });
            this.stepNumber = 1;
          } else if (this.$route.name == "fundingsummary") {
            await this.$router.push({ name: "addfunding" });
            this.stepNumber = 2;
          } else if (this.$route.name == "addapplication") {
            await this.$router.push({ name: "fundingsummary" });
            this.stepNumber = 2;
          } else if (this.$route.name == "addteammembers") {
            await this.$router.push({ name: "addapplication" });
            this.stepNumber = 3;
          } else if (this.$route.name == "reviewandsubmit") {
            await this.$router.push({ name: "addteammembers" });
            this.stepNumber = 4;
          }
          break;
        case "cancel":
          await this.$router.push({ name: "portfolios" });
          break;
        case "save":
          alert("Data has been validated and is to be saved");
          await this.$router.push({ name: "portfolios" });

          break;
        // case "provision_cloud_resources":
        //   alert("All is complete. Cloud resources are to be provisioned.");
        //   break;
      }
    }, this);
  }
  public getStep(currStepNumber: number): void {
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
}
</script>
