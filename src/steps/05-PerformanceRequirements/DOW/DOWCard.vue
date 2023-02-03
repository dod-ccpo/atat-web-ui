<template>
  <div>
    <!-- <v-container class="container-max-width" fluid> -->
    <!-- class="_dow-card-wrapper" -->
    <v-card width="1000px" 
      height="112px" 
      class="d-flex align-center justify-space-around mb-6 border-rounded"
      outlined
      elevation="1">
      <v-row justify="space-around">
        <v-col class="d-flex align-center justify-end col-2 pr-4 corner-triangle">
          <!-- <div id="requirements_needed"></div> -->
          <ATATSVGIcon :name="cardData.icon" color="primary" width="64" height="64" />
        </v-col>
        <v-col class=" align-center justify-center col-8 py-0 mt-4 px-0">
          <h3>
            {{ cardData.title }}
          </h3>
          <p class="">
            {{ cardData.label }}
            <a v-if="cardData.title === 'Anything as a Service (XaaS)'" 
              role="button" 
              id="LearnMore" class="_text-link"
              tabindex="0" 
              @click="openXaasSlideoutPanel" 
              @keydown.enter="openXaasSlideoutPanel"
              @keydown.space="openXaasSlideoutPanel">
              {{ cardData.learnMore }}
            </a>
            <a v-if="cardData.title === 'Cloud Support Package'" 
              role="button" 
              id="LearnMore" 
              class="_text-link"
              tabindex="0" 
              @click="openSupportSlideoutPanel" 
              @keydown.enter="openSupportSlideoutPanel"
              @keydown.space="openSupportSlideoutPanel">
              {{ cardData.learnMore }}
            </a>
          </p>
        </v-col>
        <v-col class="d-flex align-center justify-center">
          <!-- @click="$emit('next')"  -->
          <router-link :id="cardData.route" :to="{ name: cardData.route }">
            <v-btn depressed color="primary" id="StartButton" role="link">
              Start
            </v-btn>
          </router-link>

        </v-col>
      </v-row>
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

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class DOWCard extends Vue {
  @Prop() public cardData!: Record<string, string>;

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
