<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Now let’s find out about any actions proposed to remove barriers to fair opportunity
          </h1>
          <p>
            Answer the series of questions below. Based on your responses, we’ll suggest
            language to help you complete this portion of your J&A. You’ll be able to edit
            our suggestions to meet your requirements. 
            <span v-if="!hadExplanationOnLoad">
              If you would rather skip these questions, click the “I want to write 
              my own explanation” button below.
            </span>
          </p>

          <v-expand-transition>
            <AlertForForms  v-if="showAlert" :alertType="alertType" />
          </v-expand-transition>

          <ATATRadioGroup
            id="FairOpportunityFollowOn"
            name="FairOpportunityFollowOn"
            legend="Is your agency preparing a fair opportunity competitive follow-on requirement?"
            :value.sync="selectedRequirement"
            :items="followOnRequirement"
            :rules="[$validators.required('Please select an option.')]"
          />
          <v-expand-transition>
            <div v-if="needFollowOnDate">
              <ATATDatePicker
                id="FollowOnDate"
                class="mt-8"
                :rules="[
                  $validators.required(
                    `Enter a date using the format 'MM/DD/YYYY.`
                  ),
                  $validators.isDateValid(`Enter a date using the format 'MM/DD/YYYY`),
                ]"
                :value.sync="followOnDate"
                label="When do you expect to have this follow-on competed, solicited
                 and awarded by?"
                placeHolder="MM/DD/YYYY"
                />
            </div>
          </v-expand-transition>
          <hr />
          <ATATRadioGroup
            id="PursuingTraining"
            name="PursuingTraining"
            legend="Is your agency pursuing training and/or certifications for Government engineers
             in other technologies?"
            :value.sync="selectedTrainingRequirement"
            :items="trainingRequirement"
            :rules="[$validators.required('Please select an option.')]"
          />
          <hr />
          <ATATRadioGroup
            id="IaaSRequirement"
            name="IaaSRequirement"
            legend="Are you planning future development and enhancement of Infrastructure as a
             Service (IaaS) components that will shift to a containerized platform?"
            helpText="This does not apply to Software as a Service (SasS) or Platform as a Service
             (PaaS) requirements."
            :value.sync="selectedIaaSRequirement"
            :items="IaaSRequirement"
            :rules="[$validators.required('Please select an option.')]"
          />
          <hr />
          <ATATRadioGroup
            id="PriorProcurement"
            name="PriorProcurement"
            tooltipText="If there are no previous contracts related to this effort, select “No.”
             We’ll find out more about your procurement history in the Background section."
            legend="Was a J&A prepared to support any prior procurements related to this effort?"
            :value.sync="selectedProcurement"
            :items="priorProcurement"
            :rules="[$validators.required('Please select an option.')]"
          />
          <v-expand-transition>
            <div v-if="needProcurement">
              <ATATTextArea
                class="textarea-max-width mt-8"
                id="ProcurementTextArea"
                label="Briefly explain the results of any actions taken to remove barriers from
                 previous J&As"
                :value.sync="procurementDiscussion"
                :maxChars="1000"
                :rows="6"
                :validateItOnBlur="true"
                :rules="[
                $validators.required('Describe the results of actions taken to remove barriers.'),
                $validators.maxLength(1000)
            ]"
              />
            </div>
          </v-expand-transition>
          <hr />
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import { Component, Mixins, Watch } from "vue-property-decorator";

import AlertForForms from "../components/AlertForForms.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { add, format } from "date-fns";
import { FairOppDocGenType, FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import { YesNo } from "../../../../types/Global";


@Component({
  components: {
    AlertForForms,
    ATATTextArea,
    ATATDatePicker,
    ATATRadioGroup,
  }
})

export default class RemoveBarriers extends Mixins(SaveOnLeave) {
  /* eslint-disable camelcase */

  public followOnRequirement = getYesNoRadioOptions("FollowOn")
  public selectedRequirement = ""
  public needFollowOnDate = false
  public followOnDate = ""
  public trainingRequirement = getYesNoRadioOptions("TrainingRequirement")
  public selectedTrainingRequirement = ""
  public IaaSRequirement = getYesNoRadioOptions("IaaSRequirement")
  public selectedIaaSRequirement = ""
  public priorProcurement = getYesNoRadioOptions("PriorProcurement")
  public selectedProcurement = ""
  public needProcurement = false
  public procurementDiscussion = ""
  public writeOwnExplanation = ""
  public isNewPackage = AcquisitionPackage.isNewPackage

  public hasSuggestedTextBeenEdited = false;
  public isCustomExplanation = false;
  public hasExplanation = false;
  public explanationForDocgen: FairOppDocGenType = ""
  public hadExplanationOnLoad = false;

  public explanation = AcquisitionPackage.fairOppExplanations.plansToRemoveBarriers;

  @Watch("selectedRequirement")
  public selectedRequirementChanged(newVal: YesNo): void {
    this.needFollowOnDate = newVal === "YES";
  }
  @Watch("selectedProcurement")
  public selectedProcurementChanged(newVal: YesNo): void {
    this.needProcurement = newVal === "YES";
  }

  public get showAlert(): boolean{
    return this.hasExplanation && 
      (this.isCustomExplanation || this.hasSuggestedTextBeenEdited);
  }
  public get alertType(): string {
    if (this.hasExplanation) {
      if (this.isCustomExplanation) return "custom";
      if (this.hasSuggestedTextBeenEdited) return "suggestion";
    }
    return "";
  }

  private get currentData(): FairOpportunityDTO {
    return {
      barriers_follow_on_requirement: this.selectedRequirement,
      barriers_follow_on_expected_date_awarded: this.followOnDate,
      barriers_agency_pursuing_training_or_certs:this.selectedTrainingRequirement,
      barriers_planning_future_development:this.selectedIaaSRequirement,
      barriers_j_a_prepared:this.selectedProcurement,
      barriers_j_a_prepared_results:this.procurementDiscussion,
      barriers_write_own_explanation:this.writeOwnExplanation,
      barriers_plans_to_remove_for_docgen: this.explanationForDocgen
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      barriers_follow_on_requirement: AcquisitionPackage.fairOpportunity?.
        barriers_follow_on_requirement,
      barriers_follow_on_expected_date: AcquisitionPackage.fairOpportunity?.
        barriers_follow_on_expected_date_awarded,
      barriers_agency_pursuing_training_or_certs:AcquisitionPackage.fairOpportunity?.
        barriers_agency_pursuing_training_or_certs,
      barriers_planning_future_development:AcquisitionPackage.fairOpportunity?.
        barriers_planning_future_development,
      barriers_j_a_prepared:AcquisitionPackage.fairOpportunity?.
        barriers_j_a_prepared,
      barriers_j_a_prepared_results:AcquisitionPackage.fairOpportunity?.
        barriers_j_a_prepared_results,
      barriers_plans_to_remove_for_docgen:AcquisitionPackage.fairOpportunity?.
        barriers_plans_to_remove_for_docgen
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    await AcquisitionPackage.setFairOpportunity({ barriers_write_own_explanation: "NO" });

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.writeOwnExplanation = "NO"
      this.selectedRequirement = storeData.barriers_follow_on_requirement || "";
      this.followOnDate = storeData.barriers_follow_on_expected_date_awarded || "";
      this.selectedTrainingRequirement = storeData.barriers_agency_pursuing_training_or_certs || "";
      this.selectedIaaSRequirement = storeData.barriers_planning_future_development || "";
      this.selectedProcurement = storeData.barriers_j_a_prepared || "";
      this.procurementDiscussion = storeData.barriers_j_a_prepared_results || "";
      this.explanationForDocgen = storeData.barriers_plans_to_remove_for_docgen || "";
      
      this.hasExplanation = storeData.barriers_plans_to_remove_generated !== ""
        || storeData.barriers_plans_to_remove_custom !== "";
    }

    this.hadExplanationOnLoad = this.explanation.hadExplanationOnLoad as boolean;
    this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
    this.isCustomExplanation = this.explanation.useCustomText as boolean;
  }

  protected async saveOnLeave(): Promise<boolean> {
    let sectionsWithNoSelectedCount = 0;
    if(this.currentData.barriers_follow_on_requirement === 'NO'){
      this.followOnDate = ''
      sectionsWithNoSelectedCount++
    }
    if(this.currentData.barriers_agency_pursuing_training_or_certs === 'NO'){
      sectionsWithNoSelectedCount++
    }
    if(this.currentData.barriers_planning_future_development === 'NO'){
      sectionsWithNoSelectedCount++
    }
    if(this.currentData.barriers_j_a_prepared === 'NO'){
      this.procurementDiscussion = ''
      sectionsWithNoSelectedCount++
    }
    this.writeOwnExplanation
      = AcquisitionPackage.fairOpportunity?.barriers_write_own_explanation as YesNo
    if(this.writeOwnExplanation !== 'YES'){
      this.writeOwnExplanation = sectionsWithNoSelectedCount === 4 ? "YES": "NO";
    }

    this.explanationForDocgen = this.writeOwnExplanation === "YES" ? "CUSTOM" : "GENERATED";
    this.procurementDiscussion = this.procurementDiscussion.trim();
    
    try {
      if (this.hasChanged()) {
        this.explanation.formEdited = true;
        this.writeOwnExplanation 
          = AcquisitionPackage.fairOpportunity?.barriers_write_own_explanation as YesNo;

        if (this.explanationForDocgen === "CUSTOM") {
          await AcquisitionPackage.setReplaceCustomWithGenerated(
            {section: "plansToRemoveBarriers", val: true }
          );
        }

        if (this.writeOwnExplanation === "NO") {
          // if it's already "YES" (set from action handler when "I want to write 
          //  my own explanation" button, don't change it, but if it's NO as set on page load, 
          // check if user answered "NO" to all 3 sections 
          this.writeOwnExplanation = sectionsWithNoSelectedCount === 4 ? "YES" : "NO";
          this.explanationForDocgen = this.writeOwnExplanation === "YES" ? "CUSTOM" : "GENERATED";
        } else {
          this.explanationForDocgen = "CUSTOM";
        }
        this.explanation.useCustomText = this.explanationForDocgen === "CUSTOM";


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
