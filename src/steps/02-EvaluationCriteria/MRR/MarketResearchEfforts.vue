<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s find out more about your market research efforts
          </h1>
          <p>
            Content from AT-8838
          </p>
          <p>
            <a id="LearnMoreIGCE"
               role="button"
               tabindex="0"
               @click="openSlideoutPanel"
               @keydown.enter="openSlideoutPanel"
               @keydown.space="openSlideoutPanel">
              <span class="">Learn more about market research for the JWCC Contract</span>
            </a>
          </p>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SlideoutPanel from "@/store/slideoutPanel";
import {SlideoutPanelContent} from "../../../../types/Global";
import MarketResearchEffortsLearnMore
  from "@/steps/02-EvaluationCriteria/MRR/MarketResearchEffortsLearnMore.vue";

@Component({
  components: {
    MarketResearchEffortsLearnMore
  },
})

export default class MarketResearchEfforts extends Vue {

  /**
   * Opens the slideout panel assuming that the panel is already initialized.
   */
  public async openSlideoutPanel(e: Event): Promise<void> {
    const opener = e.currentTarget as HTMLElement;
    SlideoutPanel.openSlideoutPanel(opener.id);
  };

  /**
   * Initializes the slideout panel by setting the slideout panel component.
   */
  public async initializeSlideoutPanel(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: MarketResearchEffortsLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

  public async mounted(): Promise<void> {
    await this.initializeSlideoutPanel();
  };
}
</script>
