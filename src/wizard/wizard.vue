<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <Stepper
          :step-number="stepNumber"
          :current-step-number.sync="stepNumber"
          @clicked-action="goToStep"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Step1 v-if="stepNumber === 1" />
        <Step2 v-if="stepNumber === 2" />
        <Step3 v-if="stepNumber === 3" />
        <Step4 v-if="stepNumber === 4" />
        <Step5 v-if="stepNumber === 5" />
      </v-col>
    </v-row>
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
  public getRoute(actions: string[]): void {
    actions.forEach((a) => {
      let action = a.toLowerCase();
      switch (action) {
        case "next":
          this.stepNumber = this.stepNumber < 5 ? this.stepNumber + 1 : 5;
          break;
        case "previous":
          this.stepNumber = this.stepNumber > 1 ? this.stepNumber - 1 : 1;
          break;
        case "cancel":
          this.$router.push("portfolios");
          break;
        case "save":
          console.log(this.$refs.form);
          // alert("Data has been saved");
          break;
        case "close":
          // this.$router.push("portfolios");
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
