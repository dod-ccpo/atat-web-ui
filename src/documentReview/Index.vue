<template>
  <div class="_document-review">
    <ATATSlideoutPanel
      v-if="isForm"
      :alwaysOpen="true"
      :showHeader="false"
    >
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>
    <div class="_document-review">
      <v-main class="bg-base-off-white">
        <div class="mainDiv">
          <router-view></router-view>
        </div>
      </v-main>
    </div>
  </div>
</template>
<script lang="ts">
import { SlideoutPanelContent } from "types/Global";
import Vue from "vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import Form from "./Form.vue";
import Preview from "./Preview.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import CommentsPanel from "./components/CommentsPanel.vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATSVGIcon,
    ATATSlideoutPanel,
    CommentsPanel,
  },
})
export default class DocumentReview extends Vue {

  get isForm(): boolean {
    return this.$route.path.toLowerCase().indexOf('form') > 0 
  }
  
  private docReviewRoutes = [
    { path: "/docReviewForm", component: Form },
    { path: "/docReviewPreview", component: Preview },
  ];

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CommentsPanel,
      title: "",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    SlideoutPanel.openSlideoutPanel("");
    this.$router.addRoutes(this.docReviewRoutes);
  }

}
</script>
