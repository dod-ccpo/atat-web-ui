<template>
  <div>
    Future page for Gather Price Estimates
    <a role="button"
       id="OpenLearnMore"
       tabindex="0"
       @click="openSlideoutPanel"
       @keydown.enter="openSlideoutPanel"
       @keydown.space="openSlideoutPanel">
      Learn more.
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import SlideoutPanel from "@/store/slideoutPanel";
import { SlideoutPanelContent } from "../../../../types/Global";
// eslint-disable-next-line camelcase
import SlideOut_GatherPricesEstimates
  from "@/steps/10-FinancialDetails/IGCE/components/SlideOut_GatherPricesEstimates.vue";

@Component({
})
export default class GatherPriceEstimates extends Vue {
  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      // eslint-disable-next-line camelcase
      component: SlideOut_GatherPricesEstimates,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }
}
</script>

