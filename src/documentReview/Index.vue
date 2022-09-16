<template>
  <div class="_document-review">
    <ATATSlideoutPanel v-if="displayView==='form'" 
      :alwaysOpen="true" 
      :showHeader="false">
      <component 
        @showView="showView" 
        :is="panelContent"
        ></component>
    </ATATSlideoutPanel>
    <div class="bg-base-off-white main-div">
       <Form 
          v-if="displayView==='form'"
       ></Form>
       <Preview v-if="displayView==='preview'"
          @showView="showView" 
       ></Preview>
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
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ProjectOverviewDTO } from "@/api/models";

@Component({
  components: {
    ATATSVGIcon,
    ATATSlideoutPanel,
    CommentsPanel,
    Form,
    Preview
  },
})
export default class DocumentReview extends Vue {
  
  private docTitle = "Requirements Checklist";
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private displayView = ""
  
 
  get showDocReviewComponent(): boolean {
    return this.$route.path.toLowerCase().indexOf("form") > 0;
  }

  public showView(view?: string): void {
    this.displayView = view ? view : "form";
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
    if (!this.showDocReviewComponent){
      this.$router.push("docReviewForm");
    }
    await this.loadOnEnter();
    this.showView("form")
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    });
    console.log(storeData);
    if (storeData) {
      this.currentTitle = storeData.title;
      this.projectScope = storeData.scope;
      if (
        storeData.emergency_declaration &&
        storeData.emergency_declaration.length > 0
      ) {
        this.emergencyDeclaration =
          storeData.emergency_declaration === "true" ? "yes" : "no";
      }
    }
  }
}
</script>
