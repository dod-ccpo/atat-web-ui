<template>
  <div :class="isForm ? '_document-review' : '_document-preview'">
    <ATATSlideoutPanel v-if="isForm" :alwaysOpen="true" :showHeader="false">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <v-main>
      <div id="app-content" class="d-flex flex-column">
        <div class="mb-auto">
          <router-view></router-view>
        </div>
        <ATATFooter/>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import { SlideoutPanelContent } from "types/Global";
import Vue from "vue";
import ATATFooter from "@/components/ATATFooter.vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import Form from "./Form.vue";
import Preview from "./Preview.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import CommentsPanel from "./components/CommentsPanel.vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATFooter,
    ATATSVGIcon,
    ATATSlideoutPanel,
    CommentsPanel,
  },
})
export default class DocumentReview extends Vue {
  
  private docTitle = "Requirements Checklist";

  get isForm(): boolean {
    return this.$route.path.toLowerCase().indexOf("form") > 0;
  }

  private docReviewRoutes = [
    { 
      path: "/docReviewForm", 
      component: Form, 
      name: "docReviewForm",
      props: {
        docTitle: this.docTitle
      }},
    { 
      path: "/docReviewPreview", 
      component: Preview, 
      name: "docReviewPreview",
      props: {
        docTitle: this.docTitle
      },
    },
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
    this.docReviewRoutes.forEach((route)=>{
      this.$router.addRoute(route);
    })
    if (!this.isForm){
      this.$router.push("docReviewForm");
    }
  }
}
</script>
