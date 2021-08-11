<template>
  <v-container fluid>
    <Stepper
      :step-number="stepNumber"
      :current-step-number.sync="stepNumber"
      @clicked-action="goToStep"
    />
    <Step1 ref="stepOne" v-if="stepNumber === 1" />
    <Step2 v-if="stepNumber === 2" />
    <Step3 v-if="stepNumber === 3" />
    <Step4 v-if="stepNumber === 4" />
    <Step5 v-if="stepNumber === 5" />
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
import Step3 from "./Step3/views/Step3.vue";
import Step4 from "./Step4/views/Step4.vue";
import Step5 from "./Step5/views/Step5.vue";

@Component({
  components: {
    Stepper,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    ButtonNavigation,
  },
})
export default class Wizard extends Vue {
  private stepNumber = 1;

  $refs!: {
    stepOne: Step1;
    stepTwo: Step2;
    stepThree: Step3;
  };

  public getRoute(actions: string[]): void {
    actions.forEach(async (a) => {
      let action = a.toLowerCase();
      let validated: Promise<boolean>;
      switch (action) {
        case "next":
          if (this.stepNumber === 1) {
            validated =
              this.$refs.stepOne.$refs.createPortfolioForm.validateForm();

            if (await validated) {
              alert("Data has been validated and is to be saved");
              this.stepNumber = this.stepNumber < 5 ? this.stepNumber + 1 : 5;
            }
          } else if (this.stepNumber === 2) {
            console.log(this.$refs);
            // validated =
            //   this.$refs.stepTwo.$refs.createTaskOrderForm.validateForm();

            // if (await validated) {
            //   alert("Data has been validated and is to be saved");
            //   this.stepNumber = this.stepNumber < 5 ? this.stepNumber + 1 : 5;
            // }
          } else {
            this.stepNumber = this.stepNumber < 5 ? this.stepNumber + 1 : 5;
          }
          break;
        case "previous":
          this.stepNumber = this.stepNumber > 1 ? this.stepNumber - 1 : 1;
          break;
        case "cancel":
          this.$router.push("portfolios");
          break;
        case "save":
          validated =
            this.$refs.stepOne.$refs.createPortfolioForm.validateForm();

          if (await validated) {
            alert("Data has been validated and is to be saved");
            this.$router.push("portfolios");
          }

          break;
        // case "provision_cloud_resources":
        //   alert("All is complete. Cloud resources are to be provisioned.");
        //   break;
        default:
          break;
      }
    }, this);
  }

  public goToStep(currStepNumber: number): void {
    this.stepNumber = currStepNumber;
  }
}
</script>
