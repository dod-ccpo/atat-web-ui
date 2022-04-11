<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather some details about the duration of your task order
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Your Period of Performance (PoP) will begin based upon the execution 
              date of your task order or on your requested start date, if applicable. 
              It will extend through the length of the base period, plus any subsequent 
              option periods. In the fields below, specify the length of time that 
              each period will remain in effect. Add, duplicate or remove option 
              periods as needed, up to 5 years total. 
              <a role="button" id="PoPLearnMore" @click="openSlideoutPanel">
                Learn more about PoPs on the JWCC contract.
              </a>
            </p>

          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import PoPLearnMore from "./PopLearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";

import { SlideoutPanelContent } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    PoPLearnMore,
  },
})

export default class PeriodOfPerformance extends Vue {

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PoPLearnMore,
      title: "Learn More",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }


}
</script>
