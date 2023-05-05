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
            :selectedClearanceLevel.sync="selectedClearanceLevel"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
  </v-form>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Mixins } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { 
  DOWClassificationInstance,
  OtherServiceOfferingData, 
  SecurityRequirement, 
  SlideoutPanelContent } from "types/Global";
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
  private selectedClearanceLevel = "";
  // pragma: allowlist secret
  private hasSecret = false;
  // pragma: allowlist secret
  private hasTopSecret = false;
  public savedData: SecurityRequirement[] = []
  public offeringName = "";
  public groupId = DescriptionOfWork.currentGroupId;
  public isCloudSupportService = false;

  public get currentData(): SecurityRequirement[] {
    //eslint-disable-next-line prefer-const
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
        classification_information_type: this.selectedTopSecretSecurityRequirements,
        // eslint-disable-next-line camelcase
        ts_contractor_clearance_type: this.selectedClearanceLevel
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
        this.selectedClearanceLevel 
         = topSecretReqsObj.ts_contractor_clearance_type as string;
      }
    }
    return true;
  }

  /**
   * cycle through respective DOwObject part (otherOfferingData or serviceOfferings),
   * examine all classification levels to determine if classification level is TS or S 
   * 
   * Finally, set hasSecret, hasTopSecret variables 
   */ 
  public isSecretOrTopSecretSelected(): void {
    let instance: OtherServiceOfferingData[] = [];
    let classLevels: (DOWClassificationInstance | undefined)[] | undefined = [];
    if (this.groupId !== "EDGE_COMPUTING") {
      instance = DescriptionOfWork.DOWObject.find(
        (dowObj) => dowObj.serviceOfferingGroupId === this.groupId
      )?.otherOfferingData as OtherServiceOfferingData[];
      
      this.hasSecret = instance?.some(
        (od) => 
          od.classificationLevel === classificationRequirements.classificationSecretSysId
      ) as boolean
    
      this.hasTopSecret = instance?.some(
        (od) => 
          od.classificationLevel === classificationRequirements.classificationTopSecretSysId
      ) as boolean
    } else if (this.groupId === "EDGE_COMPUTING"){
      classLevels = DescriptionOfWork.DOWObject.find(
        (dowObj) => dowObj.serviceOfferingGroupId === this.groupId
      )?.serviceOfferings.map((i)=>i.classificationInstances).flat();
      this.hasSecret = classLevels?.some(
        (cl) => 
          cl?.classificationLevelSysId === classificationRequirements.classificationSecretSysId
      ) as boolean
      this.hasTopSecret = classLevels?.some(
        (cl) => 
          cl?.classificationLevelSysId === classificationRequirements.classificationTopSecretSysId
      ) as boolean
    } 
  }

  public async mounted(): Promise<void> {
    this.offeringName = DescriptionOfWork.DOWSecReqOfferingName.toLowerCase() !== "other"
      ? DescriptionOfWork.DOWSecReqOfferingName
      : DescriptionOfWork.serviceOfferingsForGroup.find(
        sofg => sofg.name === "Other"
      )?.otherOfferingName || "Other";
    this.isSecretOrTopSecretSelected();
    const slideoutPanelContent: SlideoutPanelContent = {
      component: SecurityRequirementsLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }
}
</script>

