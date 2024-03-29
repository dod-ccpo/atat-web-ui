<template>
    <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Let’s find out more about your security requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              Based on what you told us, this project will require the CSP to access classified 
              information. You are NOT required to complete a DD Form 254 for this task order. 
              However, you will need to identify access requirements that will be included in your 
              Description of Work.
              <a
                role="button"
                id="CoILearnMore"
                class="_text-link"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
              >
                Learn more about JWCC security requirements
              </a>
            </p>
          </div>
         <SecurityRequirementsForm
           ref="SecurityRequirementsFormRef"
           :hasSecret="hasSecret"
           :hasTopSecret="hasTopSecret"
           :isDOW="false"
           :selectedSecretSecurityRequirements="selectedSecretSecurityRequirements"
           @update:selectedSecretSecurityRequirements="selectedSecretSecurityRequirements = $event"
           :selectedTopSecretSecurityRequirements="selectedTopSecretSecurityRequirements"
           @update:selectedTopSecretSecurityRequirements="
             selectedTopSecretSecurityRequirements = $event"
           :selectedClearanceLevels="selectedClearanceLevels"
         />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { SaveOnLeaveRefs, SecurityRequirement, SlideoutPanelContent } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import SecurityRequirementsForm from "@/components/DOW/SecurityRequirementsForm.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import SecurityRequirementsLearnMore
  from "@/steps/04-ContractDetails/SecurityRequirementsLearnMore.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    SecurityRequirementsForm,
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})
class SecurityRequirements extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch(() => false)
  }


  private storedClassification: ClassificationLevelDTO[] = [];
  private selectedSecretSecurityRequirements: string[] = [];
  private selectedTopSecretSecurityRequirements: string[] = [];
  private selectedClearanceLevels: string[] = [];
  // pragma: allowlist secret
  private hasSecret = false;
  // pragma: allowlist secret
  private hasTopSecret = false;
  public savedData: SecurityRequirement[] = []

  public get currentData(): SecurityRequirement[] {
    const requirements:SecurityRequirement[] = []
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
    return requirements
  }


  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await classificationRequirements.setSecurityRequirements(this.currentData);
        await classificationRequirements.saveClassifiedInformationTypes();
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
    this.storedClassification = classificationRequirements.selectedClassificationLevels;
    this.storedClassification.forEach((classification) =>{
      if(classification.classification === "TS"){
        this.hasTopSecret = true
      }
      if(classification.classification === "S"){
        this.hasSecret = true
      }
    })
    const storeData = classificationRequirements.securityRequirements
    if(storeData){
      storeData.forEach((requirement)=>{
        if(requirement.type === "SECRET"){
          this.selectedSecretSecurityRequirements = requirement.classification_information_type
        }
        if(requirement.type === "TOPSECRET"){
          this.selectedTopSecretSecurityRequirements = requirement.classification_information_type
        }
      })
    }
    return true;
  }


  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: SecurityRequirementsLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }
}

export default toNative(SecurityRequirements)
</script>

