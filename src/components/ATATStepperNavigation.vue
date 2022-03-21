<template>
  <nav class="stepper-nav container-max-width">
    <hr class="base-lighter ml-3 mt-10 mb-8" />
    <v-row>
      <v-col>
        <v-btn
          @click="$emit('previous')"
          role="link"
          class="link-button no-border"
          id="BackButton"
        >
          <v-icon size="20">chevron_left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-col>
      <v-col>

      <span v-if="additionalButtons.length">
        <v-btn 
          v-for="button in additionalButtons"
          :key="button.id"
          @click="$emit(additionalButtons.emitText)" 
          color="secondary" 
          role="link" 
          class="ml-auto"
          :class="additionalButtons.isPrimary ? 'is-primary' : 'is-secondary'"
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
        class="ml-auto"
        id="ContinueButton"
      >
          Continue
      </v-btn>

    </v-row>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATStepperNavigation extends Vue {
  @Prop({ default: () => []}) private additionalButtons?: Array<unknown>;

}
// EJY pass prop into this for additional buttons

</script>
