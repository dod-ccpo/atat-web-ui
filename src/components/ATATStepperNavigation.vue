<template>
  <nav class="stepper-nav container-max-width" :id="id">
    <hr class="base-lighter mt-10 mb-8" />
    <div class="d-flex">

      <v-btn
        v-if="!noPrevious"
        @click="$emit('previous')"
        role="link"
        class="link-button no-border"
        id="BackButton"
      >
        <v-icon size="20">chevron_left</v-icon>
        <span>{{ backButtonText }}</span>
      </v-btn>


      <v-btn
        id="developerToggleButton"
        v-if="allowDeveloperNavigation()"
        @click="toggleDeveloperNavigation()"
        role="button"
        class="ml-4"
      >
        <span>Toggle Developer Navigation {{ developerNavState }}</span>
      </v-btn>

      <span class="ml-auto d-flex">
        <span v-if="additionalButtons.length" class="d-flex">
          <v-btn 
            v-for="button in additionalButtons"
            :key="button.id"
            @click="$emit('additionalButtonClick', button)" 
            :color="getButtonClass(button)" 
            role="link" 
            class="ml-4"
            :id="button.buttonId"
            :class="{ 'd-none': button.hide }"
          >
            {{ button.buttonText }}
          </v-btn>
        </span>

        <v-btn 
          @click="$emit('next')" 
          depressed 
          :color="this.continueButtonText == 'Continue'? 'primary' : 'secondary'"
          role="link" 
          class="ml-4"
          id="ContinueButton"
        >
          {{ continueButtonText }}
        </v-btn>
      </span>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { AdditionalButton } from "@/store/steps/types";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({})

export default class ATATStepperNavigation extends Vue {
  @Prop({ default: () => []}) private additionalButtons?: Array<unknown>;
  @Prop({ default: "Back" }) private backButtonText?: string;
  @Prop({ default: "Continue" }) private continueButtonText?: string;
  @Prop({ default: false }) private noPrevious?: boolean;
  @Prop({ default: "stepperNavigation" }) private id?: string;

  private getButtonClass(button: AdditionalButton) {
    return button.buttonClass || "secondary";
  }

  private allowDeveloperNavigation(): boolean {
    return process.env.VUE_APP_allowDeveloperNavigation === 'true' || false;
  }

  private get developerNavState(): string {
    return AcquisitionPackage.getAllowDeveloperNavigation ? "OFF" : "ON";
  }

  private toggleDeveloperNavigation(): void {
    AcquisitionPackage.setAllowDeveloperNavigation(!AcquisitionPackage.getAllowDeveloperNavigation);
  }

}
</script>
