<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s review your agency’s plans to remove barriers to fair opportunity
          </h1>
          <p>
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
                $validators.maxLength(2500)
            ]"
          />
          <v-btn
            id="RestoreSuggestionButton"
            v-if="!writeOwnExplanation"
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
            Restore to suggestion
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
  get btnRestoreIconColor(): string {
    return this.isBarriersToOpportunityIsDefault ? "disabled" : "primary";
  }

  private get currentData(): FairOpportunityDTO {
    return {
      barriers_plans_to_remove_custom: this.barriersToOpportunity,
      barriers_plans_to_remove_generated: this.defaultSuggestion
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      barriers_plans_to_remove_custom: AcquisitionPackage.fairOpportunity?.
        barriers_plans_to_remove_custom,
      barriers_plans_to_remove_generated: AcquisitionPackage.fairOpportunity?.
        barriers_plans_to_remove_generated,
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
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
      this.insertDate = storeData.barriers_follow_on_expected_date_awarded||""
      this.previousJA = storeData.barriers_j_a_prepared_results||""

      if(storeData.barriers_follow_on_requirement === "YES"){
        this.defaultSuggestion += "To overcome future barriers to competition," +
           this.agency + " is preparing a fair opportunity competitive" +
          " follow-on requirement. The follow-on is expected to be" +
          " completed, solicited, and awarded by " + this.insertDate + "."
      }
      if(storeData.barriers_agency_pursuing_training_or_certs === "YES"){
        this.defaultSuggestion += "\n\n" + "To overcome future barriers to competition," +
          this.agency +" will pursue training and certification for" +
          " Government engineers in other technologies."
      }
      if(storeData.barriers_planning_future_development === "YES"){
        this.defaultSuggestion += "\n\n" + "To overcome future barriers to competition," +
          " future development and enhancement of IaaS components will include" +
          " shifting to a containerized platform. This will enable multiple" +
          " vendors to meet the requirements which will enable the flexibility" +
          " to shift workload based on financial and mission requirements."
      }

      if(this.previousJA){
        this.defaultSuggestion += this.previousJA
      }
      this.writeOwnExplanation = storeData.cause_write_own_explanation === "YES";
      if (!this.writeOwnExplanation) {
        this.barriersToOpportunity = this.defaultSuggestion
      }
      if(storeData.barriers_plans_to_remove_custom){
        this.barriersToOpportunity = storeData.barriers_plans_to_remove_custom
      }

    }
  }

  protected async saveOnLeave(): Promise<boolean> {

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
