<template>
  <div class="d-flex justify-space-between align-center">
    <div>
      <h1 class="h2 font-weight-500">
        {{ envClassificationLevel }} Environment
      </h1>
    </div>
    <div
      class="_faux-button d-flex align-center " 
      :class="{'_faux-button--disabled': CSPButtonDisabled}"
      :tabindex="CSPButtonDisabled ? -1 : 0" 
      :role="CSPButtonDisabled ? 'display' : 'button'"
      :aria-label="CSPButtonDisabled ? 'Visit CSP portal' : 'CSP info'"
      id="CSPButton" 
      @click="goToPortal(providers[cloudServiceProvider.toLowerCase()].url)"
      @keydown.enter="goToPortal(providers[cloudServiceProvider.toLowerCase()].url)"
      @keydown.space="goToPortal(providers[cloudServiceProvider.toLowerCase()].url)"
    >
      <ATATSVGIcon
        id="CSPIcon"
        class="d-flex align-center mr-2"
        :name="providers[cloudServiceProvider.toLowerCase()].img.name"
        :width="providers[cloudServiceProvider.toLowerCase()].img.width"
        :height="providers[cloudServiceProvider.toLowerCase()].img.height"
      />
      <div>
        <span class="font-weight-700 d-block" style="line-height: 1.33">
          {{ providers[cloudServiceProvider.toLowerCase()].title }}
        </span>
        <span 
          class="d-block font-size-12 font-weight-500 text-base-dark" 
          style="line-height: 1.33"
        >
          <span v-if="CSPButtonDisabled">
            Cloud Service Provider
          </span>
          <span v-else class="text-primary">
            Login to your <span class="_external-link _external-link--small">portal</span>
          </span>
        </span>
      </div>


    </div>

  </div>


</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { SlideoutPanelContent } from "../../../../../types/Global";
import SlideoutPanel from "@/store/slideoutPanel";
import AccessingCSPLearnMore from
  "@/portfolios/portfolio/components/shared/AccessingCSPLearnMore.vue";
import { cspConsoleURLs } from "@/store/portfolio";
import { Statuses } from "@/store/acquisitionPackage";


@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class CSPCard extends Vue {
  @Prop() private cloudServiceProvider!: string;
  @Prop() private envClassificationLevel!: string;
  @Prop() private envStatus!: string;

  public get CSPButtonDisabled(): boolean {
    return this.envClassificationLevel === "Secret" 
      || this.envStatus !== Statuses.Provisioned.value;
  }

  public goToPortal(url: string): void {
    if (!this.CSPButtonDisabled) {
      window.open(url, "_blank");
    }
  }

  public providers = {
    "azure":{
      title: "Microsoft Azure",
      url: cspConsoleURLs.azure,
      img: {
        name:"azure",
        width:"40",
        height:"31",
      }
    },
    "aws":{
      title: "Amazon Web Services",
      url: cspConsoleURLs.aws,
      img: {
        name:"aws",
        width:"40",
        height:"24"
      }
    },
    "gcp":{
      title: "Google Cloud",
      url: cspConsoleURLs.google,
      img: {
        name:"gcp",
        width:"40",
        height:"35"
      }
    },
    "oracle":{
      title: "Oracle Cloud",
      url: cspConsoleURLs.oracle,
      img: {
        name:"oracle",
        width:"40",
        height:"25"
      }
    },
  }

  public async openSlideoutPanel(e: Event): Promise<void> {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: AccessingCSPLearnMore,
        title: "Learn More",
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);

      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }
}
</script>
