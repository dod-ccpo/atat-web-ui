<template>
  <v-expand-transition>
    <ATATAlert
      id="ReviewQuestionnaireResponses"
      type="warning"
      v-if="showAlert"
      maxWidth="750"
      class="mt-9 mb-2"
    >
      <template v-slot:content>
        <p>
          To view suggested language based on your updated responses to the previous 
          questionnaire, click “Restore default suggestion” below.
        </p>
      </template>
    </ATATAlert>
  </v-expand-transition>  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
  }
})

export default class RestoreSuggestionAlert extends Vue {
  @Prop({ default: false }) private showAlert!: boolean;
}

</script>
