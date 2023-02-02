<template>
<div>
  <!-- <v-container class="container-max-width" fluid> -->
    <!-- class="_dow-card-wrapper" -->
  <v-card
    width="1000px"
    height="112px"
    class="d-flex align-center justify-space-around mb-6"
    outlined
    elevation="1"
  >
    <v-row justify="space-around">
      <v-col class="d-flex align-center justify-end col-2 pr-4">
        <ATATSVGIcon 
          :name="cardData.icon"
          color="primary"
          width="64"
          height="64"
        />
      </v-col>
      <v-col class=" align-center justify-center col-8 py-0 mt-4 px-0">
        <h3>
          {{ cardData.title }}
        </h3>
        <p class="">
          {{ cardData.label }} 
            <!-- @click="openSlideoutPanel"
            @keydown.enter="openSlideoutPanel"
            @keydown.space="openSlideoutPanel" -->
          <a
            v-if="cardData.learnMore"
            role="button"
            id="LearnMore"
            class="_text-link"
            tabindex="0"
          >
            {{ cardData.learnMore }}
          </a>
        </p>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <!-- @click="$emit('next')"  -->
        <!-- v-if="!hideContinueButton" -->
        <!-- role="link"  -->
        <!-- class="ml-4" -->
        <v-btn 
          depressed 
          color="primary"
          id="StartButton"
        >
          Start
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
  <!-- </v-container> -->
</div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"

import Vue from "vue";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class DOWCard extends Vue {
  @Prop() private cardData!: Record<string, string>;

  // public openSlideoutPanel(e: Event): void {
  //   if (e && e.currentTarget) {
  //     const opener = e.currentTarget as HTMLElement;
  //     SlideoutPanel.openSlideoutPanel(opener.id);
  //   }
  // }
 
}

</script>
