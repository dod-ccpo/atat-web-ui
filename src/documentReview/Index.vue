<template>


  <div class="_document-review">
    
    <ATATSlideoutPanel 
        v-if="panelContent"
        :alwaysOpen="true"
        :showHeader="false">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <v-main class="bg-base-off-white">
      <div class="mainDiv">
        <v-breadcrumbs
          class="pa-0 mb-3"
          :items="breadCrumbItems"
          divider="-"
        ></v-breadcrumbs>
        <h1>Requirements Checklist</h1>
        <div id="FormDiv">
          <v-form id="reviewForm">
            <h2>Part I. Requirements Owner Information</h2>
          </v-form>
        </div>
      </div>
    </v-main>
  </div>
</template>
<script lang="ts">
import { BreadCrumbItem, SlideoutPanelContent } from "types/Global";
import Vue from "vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import CommentsPanel from "./components/CommentsPanel.vue";

import { Component } from "vue-property-decorator";
@Component({
  components:{
    ATATSVGIcon,
    ATATSlideoutPanel,  
    CommentsPanel
  }
})
export default class DocumentReview extends Vue {
  public breadCrumbItems: BreadCrumbItem[] = [
    {
      text: "Acquisitions",
      disabled: false,
      href: "#",
    },
    {
      text: "Demo Package",
      disabled: false,
      href: "#",
    },
    {
      text: "Requirements Checklist",
      disabled: true,
      href: "#",
    },
  ];

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  };

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CommentsPanel,
      title: "" 
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    SlideoutPanel.openSlideoutPanel("");
  }
}
</script>
