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

          <v-btn @click="saveOnLeave" class="my-10">Temp Save Button</v-btn>

        </div>
        <ATATFooter/>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import { DocReviewData, SlideoutPanelContent } from "types/Global";
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
  private displayView = "";
  private isForm = true;

  /* eslint-disable camelcase */

  private docDataInitial: DocReviewData = {
    projectOverview: {
      title: "",
      scope: "",
      emergency_declaration: "",
    },
    organization: {},
    fairOpportunity: {
      exception_to_fair_opportunity: "",
    },
    currentContract: {},
  }

  private docData: DocReviewData = this.docDataInitial;
  private savedDocData: DocReviewData = this.docDataInitial;
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
    this.docData.projectOverview = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    }) as ProjectOverviewDTO;

    this.docData.organization = await AcquisitionPackage.loadData<OrganizationDTO>({
      storeProperty: StoreProperties.Organization
    }) as OrganizationDTO;

    this.docData.fairOpportunity = await AcquisitionPackage.loadData<FairOpportunityDTO>({
      storeProperty: StoreProperties.FairOpportunity
    }) as FairOpportunityDTO;

    this.docData.currentContract = await AcquisitionPackage.loadData<CurrentContractDTO>({
      storeProperty: StoreProperties.CurrentContract
    }) as CurrentContractDTO;

    // create a copy of data as it was on page load for comparison on page leave for 
    // what to save to store and database
    this.savedDocData = _.cloneDeep(this.docData);
  }

  public async hasChanged(): Promise<void> {
    const docData = this.docData as unknown as Record<string, unknown> ;
    const savedDocData = this.docData as unknown as Record<string, unknown> ;
    const keys = Object.keys(docData);

    keys.forEach((key: string) => {
      if (hasChanges(docData[key], savedDocData[key])){
        this.docDataSectionsToSave.push(key);
      };
    });
  } 

  protected async saveOnLeave(): Promise<boolean> {
    await this.hasChanged();
    this.docDataSectionsToSave.forEach(async(section)=>{
      switch(section) {
      case "projectOverview":
        await AcquisitionPackage.saveData({
          data: this.docData.projectOverview,
          storeProperty: StoreProperties.ProjectOverview,
        });
        break;
      case "organization": 
        // future ticket
        break;

      case "fairOpportunity":
        await AcquisitionPackage.saveData<FairOpportunityDTO>({
          data: this.docData.fairOpportunity,
          storeProperty: StoreProperties.FairOpportunity
        });
        break;
      
      case "currentContract":
        await AcquisitionPackage.saveData<CurrentContractDTO>({
          data: this.docData.currentContract,
          storeProperty: StoreProperties.CurrentContract
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
