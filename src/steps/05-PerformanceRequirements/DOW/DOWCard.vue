<template>
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

          <a v-if="showLearnMore" 
            role="button" 
            :id="`LearnMore` + cardData.section" 
            class="_text-link"
            tabindex="0" 
            @click="openSlideoutPanel" 
            @keydown.enter="openSlideoutPanel"
            @keydown.space="openSlideoutPanel">
            {{ cardData.learnMore }}
          </a>
        </div>
      </div>
      <div class="d-flex align-center justify-center flex-column ml-auto">
        <v-btn
          class="ml-5"
          color="primary" 
          :id="`StartButton` + cardData.section" 
          width="110"
          role="link"
          @click="setDOWSection"
          @keydown.enter="setDOWSection"
          @keydown.space="setDOWSection"
        >
          Start
        </v-btn>

      </div>
  </v-card>

</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import SlideoutPanel from "@/store/slideoutPanel/index";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import XaasLearnMore from "./XaasLearnMore.vue";
import CloudSupportLearnMore from "./CloudSupportLearnMore.vue";
import { DOWCardData, SlideoutPanelContent } from "../../../../types/Global";

import Vue from "vue";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class DOWCard extends Vue {
  @Prop() public cardData!: DOWCardData;

  private setPanelComponent: any = {};
  private slideoutPanelContent = {} as SlideoutPanelContent;

  public showLearnMore = false;


  public openSlideoutPanel(e: Event): void {
    this.setPanelComponent(this.slideoutPanelContent);
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };

  public async setDOWSection(): Promise<void> {
    await DescriptionOfWork.setCurrentDOWSection(this.cardData.section as string);
    const routerObj = {
      name: this.cardData.route,
      params: {
        direction: "next",
        resolver: "",
      }
    }
    if (this.cardData.section === "XaaS" || this.cardData.section === "CloudSupportPackage") {
      routerObj.params.resolver = "RequirementsPathResolver";
    } 
    debugger;
    this.$router.push(routerObj)
  }

  public async loadOnEnter(): Promise<void> {
    await CurrentEnvironment.getCurrentEnvironment();
    this.showLearnMore = this.cardData.learnMore !== "";
    
    if (this.cardData.section === "XaaS" || this.cardData.section === "CloudSupportPackage") {
      const slideoutComponent = this.cardData.section === "XaaS" 
        ? XaasLearnMore : CloudSupportLearnMore;
      this.slideoutPanelContent = {
        component: slideoutComponent,
        title: "Learn More",
      };
      this.setPanelComponent = await SlideoutPanel.setSlideoutPanelComponent;
    }

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };

}

</script>
