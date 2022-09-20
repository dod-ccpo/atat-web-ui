<template>
  <div :class="isForm ? '_document-review' : '_document-preview'">
    <ATATSlideoutPanel
      v-if="displayView === 'form'"
      :alwaysOpen="true"
      :showHeader="false"
    >
      <component @showView="showView" :is="panelContent"></component>
    </ATATSlideoutPanel>

    <v-main>
      <div id="app-content" class="d-flex flex-column">
        <div class="mb-auto">
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
        <ATATFooter/>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import { SlideoutPanelContent } from "types/Global";
import ATATFooter from "@/components/ATATFooter.vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import Form from "./Form.vue";
import Preview from "./Preview.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import CommentsPanel from "./components/CommentsPanel.vue";
import { Component, Mixins } from "vue-property-decorator";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";

import { 
  CurrentContractDTO, 
  FairOpportunityDTO,
  OrganizationDTO, 
  ProjectOverviewDTO 
} from "@/api/models";

import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";
import _ from "lodash";

@Component({
  components: {
    ATATFooter,
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
  private isForm = true;

  private docData: Record<string, Record<string, unknown>> = {
    "acqPackage":{},
    "org": {},
    "currentContract": {},
    "fairOpp": {},
  }
  
  private savedData:Record<string, Record<string, unknown>> = {
    "acqPackage":{},
    "org": {},
    "currentContract": {},
    "fairOpp": {},
  }

  private docDataSectionsToSave: string[] = [];
  
  public showView(view?: string): void {
    this.displayView = view ? view : "form";
    this.isForm = view === "form";
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
    }) as Record<string, string>;

    this.docData.currentContract = await AcquisitionPackage.loadData<CurrentContractDTO>({
      storeProperty: StoreProperties.CurrentContract
    }) as Record<string, string>;

    this.docData.fairOpp = await AcquisitionPackage.loadData<FairOpportunityDTO>({
      storeProperty: StoreProperties.FairOpportunity
    }) as unknown as Record<string, string>;


    this.savedData = _.cloneDeep(this.docData);
    debugger;
  }

  public hasChanged(): void {
    for (const section in this.docData){
      if (hasChanges(this.docData[section], this.savedData[section])){
        this.docDataSectionsToSave.push(section);
      };
    }
  } 

  protected async saveOnLeave(): Promise<boolean> {
    await this.hasChanged();
    debugger;
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
