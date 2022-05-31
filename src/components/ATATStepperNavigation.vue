<template>
  <nav class="stepper-nav container-max-width">
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
import { Component, Prop } from "vue-property-decorator";
import { AdditionalButton } from "@/store/steps/types";

@Component({})

export default class ATATStepperNavigation extends Vue {
  @Prop({ default: () => []}) private additionalButtons?: Array<unknown>;
  @Prop({ default: "Back" }) private backButtonText?: string;
  @Prop({ default: "Continue" }) private continueButtonText?: string;
  @Prop({ default: false }) private noPrevious?: boolean;

  private getButtonClass(button: AdditionalButton) {
    return button.buttonClass || "secondary";
  }

}
</script>
