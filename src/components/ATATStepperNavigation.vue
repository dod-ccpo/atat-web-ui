<template>
  <nav class="stepper-nav container-max-width">
    <hr class="base-lighter ml-3 mt-10 mb-8" />
    <div class="d-flex">
      <v-btn
        @click="$emit('previous')"
        role="link"
        class="link-button no-border"
        id="BackButton"
      >
        <v-icon size="20">chevron_left</v-icon>
        <span>Back</span>
      </v-btn>

      <span class="ml-auto d-flex">
        <span v-if="additionalButtons.length">
          <v-btn 
            v-for="button in additionalButtons"
            :key="button.id"
            @click="$emit(additionalButtons.emitText)" 
            :color="additionalButtons.isPrimary ? 'primary' : 'secondary'" 
            role="link" 
            class="ml-auto"
            :id="additionalButtons.buttonId"
          >
            {{ button.buttonText }}
          </v-btn>
        </span>

        <v-btn 
          @click="$emit('next')" 
          depressed 
          color="primary" 
          role="link" 
          class="ml-4"
          id="ContinueButton"
        >
          Continue
        </v-btn>
      </span>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATStepperNavigation extends Vue {
  @Prop({ default: () => []}) private additionalButtons?: Array<unknown>;
}
</script>
