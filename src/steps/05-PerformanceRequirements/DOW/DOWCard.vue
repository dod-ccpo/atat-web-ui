<template>
  <div>
    <!-- <v-container class="container-max-width" fluid> -->
    <!-- class="_dow-card-wrapper" -->
    <v-card 
      class="d-flex border-rounded px-8 py-6 mb-4 default-box-shadow"
      outlined>
        <ATATSVGIcon 
          v-if="cardData.defineRequirements===true"
          name="StarInTriangle" 
          color="primary" 
          width="49" 
          height="48" 
          class="define-requirements"
        />
        <div class="d-flex justify-center flex-column">
          <ATATSVGIcon :name="cardData.icon" color="primary" width="64" height="64" />
        </div>
        <div class="d-flex align-left justify-center flex-column ml-4">
          <h3 class="mb-1">
            {{ cardData.title }}
          </h3>
          <div>
            {{ cardData.label }}
            <a v-if="cardData.title === 'Anything as a Service (XaaS)'" 
              role="button" 
              id="LearnMoreXaas" class="_text-link"
              tabindex="0" 
              @click="openXaasSlideoutPanel" 
              @keydown.enter="openXaasSlideoutPanel"
              @keydown.space="openXaasSlideoutPanel">
              {{ cardData.learnMore }}
            </a>
            <a v-if="cardData.title === 'Cloud Support Package'" 
              role="button" 
              id="LearnMoreCloudSupportPackage" 
              class="_text-link"
              tabindex="0" 
              @click="openSupportSlideoutPanel" 
              @keydown.enter="openSupportSlideoutPanel"
              @keydown.space="openSupportSlideoutPanel">
              {{ cardData.learnMore }}
            </a>
          </div>
        </div>
        <div class="d-flex align-center justify-center flex-column ml-auto">
          <router-link :id="cardData.route" :to="{ name: cardData.route }">
            <v-btn
              color="primary" 
              id="StartButton" 
              width="110"
              role="link">
              Start
            </v-btn>
          </router-link>

        </div>
    </v-card>
    <!-- </v-container> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import SlideoutPanel from "@/store/slideoutPanel/index";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import XaasLearnMore from "./XaasLearnMore.vue";
import CloudSupportLearnMore from "./CloudSupportLearnMore.vue";
import { SlideoutPanelContent } from "../../../../types/Global";

import Vue from "vue";
import StarInTriangle from "@/components/icons/StarInTriangle.vue";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class DOWCard extends Vue {
  @Prop() public cardData!: Record<string, string | boolean>;

  private currentEnvironmentExists = "";
  private setPanelComponent: any = {};
  private xaasSlideoutPanelContent = {} as SlideoutPanelContent;
  private supportSlideoutPanelContent = {} as SlideoutPanelContent;

  public openXaasSlideoutPanel(e: Event): void {
    this.setPanelComponent(this.xaasSlideoutPanelContent);
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };
  public openSupportSlideoutPanel(e: Event): void {
    this.setPanelComponent(this.supportSlideoutPanelContent);
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };


  public async loadOnEnter(): Promise<void> {
    await CurrentEnvironment.getCurrentEnvironment();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    if (CurrentEnvironment.currentEnvironment) {
      this.currentEnvironmentExists
        = CurrentEnvironment.currentEnvironment.current_environment_exists ? "YES" : "NO"
    }
    this.xaasSlideoutPanelContent = {
      component: XaasLearnMore,
      title: "Learn More",
    };
    this.supportSlideoutPanelContent = {
      component: CloudSupportLearnMore,
      title: "Learn More",
    };

    this.setPanelComponent = await SlideoutPanel.setSlideoutPanelComponent;
  };

}

</script>
