<template>
  <v-form ref="form" lazy-validation>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us about the security requirements for your {{ offeringName }}
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              {{ offeringName }} services may require individuals to have a different clearance 
              and/or level of access to classified information compared to other 
              performance requirements. We pre-filled your security requirements 
              based on information you already provided, but you can edit options 
              to customize access for these services.            
            </p>
          </div>
          <!-- pragma: allowlist nextline secret -->
          <SecurityRequirementsForm :hasSecret="hasSecret" :hasTopSecret="hasTopSecret"
            :isDOW="true"
            :selectedSecretSecurityRequirements.sync="selectedSecretSecurityRequirements"
            :selectedTopSecretSecurityRequirements.sync="selectedTopSecretSecurityRequirements"
            :selectedClearanceLevels="selectedClearanceLevels"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { SecurityRequirement, SlideoutPanelContent } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import SecurityRequirementsForm from "@/components/DOW/SecurityRequirementsForm.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import SecurityRequirementsLearnMore
  from "@/steps/04-ContractDetails/SecurityRequirementsLearnMore.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";

@Component({
  components: {
    SecurityRequirementsForm,
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})

export default class DOWSecurityRequirements extends Mixins(SaveOnLeave) {
  private selectedClassifications: ClassificationLevelDTO[] = [];
  private selectedSecretSecurityRequirements: string[] = [];
  private selectedTopSecretSecurityRequirements: string[] = [];
  private selectedClearanceLevels: string[] = [];
  // pragma: allowlist secret
  private hasSecret = false;
  // pragma: allowlist secret
  private hasTopSecret = false;
  public savedData: SecurityRequirement[] = []
  public offeringName = "";
  public groupId = DescriptionOfWork.currentGroupId;
  public isCloudSupportService = false;

  public get currentData(): SecurityRequirement[] {
    let requirements:SecurityRequirement[] = []
    if(this.hasSecret){
      requirements.push({
        type:"SECRET",
        // eslint-disable-next-line camelcase
        classification_information_type: this.selectedSecretSecurityRequirements
      })
    }
    if(this.hasTopSecret){
      requirements.push({
        type:"TOPSECRET",
        // eslint-disable-next-line camelcase
        classification_information_type: this.selectedTopSecretSecurityRequirements
      })
    }
    return requirements;
  }


  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    try {
      if (this.hasChanged()) {
        await DescriptionOfWork.saveSecurityRequirements(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async loadOnEnter(): Promise<boolean> {
    this.selectedClassifications = classificationRequirements.selectedClassificationLevels;
    this.selectedClassifications.forEach((classification) => {
      if(classification.classification === "TS"){
        this.hasTopSecret = true;
      }
      if(classification.classification === "S"){
        this.hasSecret = true;
      }
    });

    const storeData = await DescriptionOfWork.getDOWSecurityRequirements();
    if (storeData) {
      this.savedData = _.cloneDeep(storeData);     
      const secretReqsObj = storeData.find(obj => obj.type === "SECRET");
      if (secretReqsObj) {
        this.selectedSecretSecurityRequirements 
          = secretReqsObj.classification_information_type;
      }
      const topSecretReqsObj = storeData.find(obj => obj.type === "TOPSECRET");
      if (topSecretReqsObj) {
        this.selectedTopSecretSecurityRequirements 
          = topSecretReqsObj.classification_information_type;
      }
    }
    return true;
  }

  public async mounted(): Promise<void> {
    this.offeringName = DescriptionOfWork.DOWSecReqOfferingName;

    const slideoutPanelContent: SlideoutPanelContent = {
      component: SecurityRequirementsLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }
}
</script>

