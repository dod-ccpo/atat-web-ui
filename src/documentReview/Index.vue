<template>
  <div class="_document-review">
    <ATATSlideoutPanel
      v-if="displayView === 'form'"
      :alwaysOpen="true"
      :showHeader="false"
    >
      <component @showView="showView" :is="panelContent"></component>
    </ATATSlideoutPanel>
    <div class="bg-base-off-white main-div">
      <Form
        :docTitle="docTitle"
        :docData.sync="docData"
        v-if="displayView === 'form'"
      />
      <Preview
        v-if="displayView === 'preview'"
        :docTitle="docTitle"
        :docData="docData"
        :isForm="false"
        @showView="showView"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { SlideoutPanelContent } from "types/Global";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import Form from "./Form.vue";
import Preview from "./Preview.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import CommentsPanel from "./components/CommentsPanel.vue";
import { Component, Mixins } from "vue-property-decorator";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { OrganizationDTO, ProjectOverviewDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";
import _ from "lodash";

@Component({
  components: {
    ATATSVGIcon,
    ATATSlideoutPanel,
    CommentsPanel,
    Form,
    Preview
  },
})
export default class DocumentReview extends Mixins(SaveOnLeave){
  
  private docTitle = "Requirements Checklist";
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private displayView = "";

  private docData: Record<string, Record<string, unknown>> = {
    "acqPackage":{},
    "org": {}
  }
  
  private savedData:Record<string, Record<string, unknown>> = {
    "acqPackage":{},
    "org": {}
  }
  private docDataSectionsToSave: string[] = [];
  
  public showView(view?: string): void {
    this.displayView = view ? view : "form";
  }

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public async mounted(): Promise<void> {
    this.showView("form")
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CommentsPanel,
      title: "",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    SlideoutPanel.openSlideoutPanel("");
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    this.docData.acqPackage = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    }) as unknown as Record<string, string | unknown>;
    this.docData.org = await AcquisitionPackage.loadData<OrganizationDTO>({
      storeProperty: StoreProperties.Organization
    })as Record<string, string>;
    this.savedData = _.cloneDeep(this.docData)
  }

  public hasChanged(): void {
    for (const section in this.docData){
      if (hasChanges(this.docData[section], this.savedData[section])){
        this.docDataSectionsToSave.push(section);
      };
    }
  } 

  protected async saveOnLeave(): Promise<boolean> {
    await this.hasChanged()
    this.docDataSectionsToSave.forEach(async(section)=>{
      switch(section){
      case "acqPackage":
        await AcquisitionPackage.saveData({
          data: this.docData.acqPackage,
          storeProperty: StoreProperties.ProjectOverview,
        });
        break;
      default:
        break;
      }
    });
    return true;
  }
}
</script>
