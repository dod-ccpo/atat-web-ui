<template>
  <v-container fluid class="my-9">
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Let’s wrap up your Portfolio</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <p class="" v-if="!invalidStepsExist">
          In this last step, we will review the information that you provided to
          make sure everything is complete and accurate. Once you have verified
          your Portfolio details, we will be able to provision your cloud
          resources.
        </p>
        <!-- Invalid steps found -->
        <p v-else>
          We found a few details that you need to review before we can provision
          your cloud resources. Let's take care of these details now.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <summary-stepper></summary-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SummaryStepper from "./SummaryStepper.vue";

@Component({
  components: {
    SummaryStepper,
  },
})
export default class PortfolioSummary extends Vue {
  public async invalidStepsExist(): Promise<boolean> {
    return false;
  }
}
</script>
