<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pageHeaderIntro }} plans to remove barriers to fair opportunity
          </h1>
          <p v-if="allSectionsNO">
            Unfortunately, we were not able to suggest language to help you complete
            this portion of the J&A. In the field below, briefly describe the actions
            proposed to remove or overcome barriers that led to the exception to fair
            opportunity. If a J&A was prepared to support any related prior procurements,
            explain the results of any actions taken to remove barriers.
          </p>
          <p v-else-if="writeOwnExplanation">
            In the field below, briefly describe the actions proposed to remove
            or overcome barriers that led to the exception to fair opportunity.
            If a J&A was prepared to support any related prior procurements,
            explain the results of any actions taken to remove barriers.
          </p>
          <p v-else>
            Based on what you’ve told us, we’ve suggested language to describe the actions proposed
            to remove barriers to fair opportunity. You can edit any details to meet your
            requirements.
          </p>
          <ATATTextArea
            class="textarea-max-width"
            id="BarriersTextArea"
            :value.sync="barriersToOpportunity"
            :maxChars="2500"
            :rows="getRowCount"
            :validateItOnBlur="true"
            :rules="[
                $validators.required('Describe the actions proposed to remove barriers to fair' +
                 ' opportunity..'),
                $validators.maxLength(2500,'Limit your description to 2,500 characters or less.')
            ]"
          />
          <v-btn
            id="RestoreSuggestionButton"
            v-if="!writeOwnExplanation || this.docgenType === 'GENERATED' "
            class="secondary font-size-14 px-4 mb-1 mt-1"
            :disabled="isBarriersToOpportunityIsDefault"
            @click="confirmRestoreDefaultText"
          >
            <ATATSVGIcon
              id="RestoreSuggestionButtonIcon"
              width="19"
              height="15"
              name="restore"
              class="mr-1"
              :color="btnRestoreIconColor"
            />
            Restore default suggestion
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <ConfirmRestoreDefaultTextModal
      @okRestore="restoreSuggestion"
      :showRestoreModal.sync="showRestoreModal"
      :isBasedOnResponses="true"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ConfirmRestoreDefaultTextModal
  from "@/steps/02-EvaluationCriteria/components/ConfirmRestoreDefaultTextModal.vue";
import { FairOpportunityDTO, OrganizationDTO } from "@/api/models";
import _ from "lodash";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { convertAgencyRecordToSelect, hasChanges } from "@/helpers";
import OrganizationData from "@/store/organizationData";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
    ATATSVGIcon
  },
})

export default class ReviewBarriers extends Mixins(SaveOnLeave){
  /* eslint-disable camelcase */
  public barriersToOpportunity =""
  public agency = ""
  public insertDate = ""
  public previousJA = ""
  public defaultSuggestion = ""
  public showRestoreModal = false;
  public writeOwnExplanation = false;
  public isBarriersToOpportunityIsDefault = false;
  public docgenType = ""
  public plansToRemoveCustom=""
  public plansToRemoveGenerated=""
  public allSectionsNO = false


  public get getRowCount(): number {
    return this.writeOwnExplanation ? 12 : 19;
  }

  @Watch("barriersToOpportunity")
  public barriersToOpportunityChanged(): void {
    this.isBarriersToOpportunityIsDefault = this.barriersToOpportunity === this.defaultSuggestion;
  }
  public restoreSuggestion(): void {
    this.barriersToOpportunity = this.defaultSuggestion;
    this.showRestoreModal = false;
  }

  public confirmRestoreDefaultText(): void {
    this.showRestoreModal = true;
  }
  public get btnRestoreIconColor(): string {
    return this.isBarriersToOpportunityIsDefault ? "disabled" : "primary";
  }

  public get followOnP():string {
    return "To overcome future barriers to competition, " +
      this.agency + " is preparing a fair opportunity competitive" +
      " follow-on requirement. The follow-on is expected to be" +
      " completed, solicited, and awarded by " + this.insertDate + "."
  } // EJY UPDATE DATES TO SPELLED OUT VERSION e.g., June 6, 2023 instead of MM/DD/YYYY
  public get trainingCertP():string {
    return "To overcome future barriers to competition, " +
      this.agency + " will pursue training and certification for" +
      " Government engineers in other technologies."
  }
  public get futureDevelopmentP():string {
    return "To overcome future barriers to competition, " +
      " future development and enhancement of IaaS components will include" +
      " shifting to a containerized platform. This will enable multiple" +
      " vendors to meet the requirements which will enable the flexibility" +
      " to shift workload based on financial and mission requirements."
  }

  public generateSuggestion():void {
    const followOn = this.savedData?.barriers_follow_on_requirement === "YES"
    const training = this.savedData?.barriers_agency_pursuing_training_or_certs === "YES"
    const development = this.savedData?.barriers_planning_future_development === "YES"
    let suggestedText = ""
    if(followOn){
      suggestedText += this.followOnP
      if(training || development || this.previousJA) suggestedText += "\n\n"
    }
    if(training){
      suggestedText += this.trainingCertP
      if(development || this.previousJA) suggestedText += "\n\n"
    }
    if(development){
      suggestedText += this.futureDevelopmentP
      if(this.previousJA) suggestedText += "\n\n"
    }
    if(this.previousJA){
      suggestedText += this.previousJA
    }
    this.barriersToOpportunity = this.barriersToOpportunity || suggestedText
    this.defaultSuggestion = suggestedText
  }
  public get pageHeaderIntro(): string {
    return this.docgenType === "CUSTOM" ? "Tell us how your agency" : "Let’s review your agency’s";
  }

  private get currentData(): FairOpportunityDTO {
    return {
      barriers_plans_to_remove_custom: this.plansToRemoveCustom,
      barriers_plans_to_remove_generated: this.plansToRemoveGenerated
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    await AcquisitionPackage.doSetFairOppBackToReview(false);
    const agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data);
    const organizationStore = await AcquisitionPackage
      .loadData<OrganizationDTO>({storeProperty:
        StoreProperties.Organization}) as Record<string, any>;
    const selectedAgencyIndex = agencyData.findIndex(
      (svc) => svc.value === organizationStore.agency.value
    );
    if (selectedAgencyIndex > -1) {
      this.agency = agencyData[selectedAgencyIndex].text || "";
    }
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if(storeData){
      this.insertDate = storeData.barriers_follow_on_expected_date_awarded || ""
      this.previousJA = storeData.barriers_j_a_prepared_results || ""

      this.writeOwnExplanation = storeData.barriers_write_own_explanation === "YES";
      if (!this.writeOwnExplanation) {
        this.generateSuggestion()
      }

      this.plansToRemoveCustom = storeData.barriers_plans_to_remove_custom||""
      this.plansToRemoveGenerated = storeData.barriers_plans_to_remove_generated
        || this.defaultSuggestion
      this.docgenType = storeData.barriers_plans_to_remove_for_docgen || ""
      this.barriersToOpportunity = this.docgenType === "GENERATED"
        ? this.plansToRemoveGenerated : this.plansToRemoveCustom

      this.allSectionsNO = storeData.barriers_follow_on_requirement === "NO" &&
        storeData.barriers_agency_pursuing_training_or_certs === "NO" &&
        storeData.barriers_planning_future_development === "NO"&&
        storeData.barriers_j_a_prepared === "NO"


      AcquisitionPackage.generateFairOpportunitySuggestion("RemoveBarriers");

    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if(this.docgenType === "GENERATED"){
      this.plansToRemoveGenerated = this.barriersToOpportunity.trim();
    }else{
      this.plansToRemoveCustom = this.barriersToOpportunity.trim();
    }
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
