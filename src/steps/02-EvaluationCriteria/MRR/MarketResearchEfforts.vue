<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s find out more about your market research efforts
          </h1>
          <p class="copy-max-width">
            {{ introText }} 
            If you would rather skip these questions, click the “I want to write my 
            own explanation” button below. 
            <!-- TODO - make text below link for opening slideout - AT-9006 -->
            Learn more about market research for the JWCC Contract 
          </p>
          <div class="max-width-740">
            <ATATRadioGroup 
              id="OnlyCapableSource"
              name="OnlyCapableSource"
              :legend="onlySourceCapableLegend"
              :value.sync="cspIsOnlySourceCapable"
              :items="onlySourceCapableOptions"
              :rules="[$validators.required('Please select an option.')]"
            />
            <v-expand-transition>
              <div v-if="isCspOnlySourceCapable" class="mt-8">
                <div style="line-height: 1.3">
                  <span class="font-weight-500">When did you conduct this research?</span><br />
                  <span class="font-size-14 text-base">
                    Research must have been conducted within the previous 12 months. 
                  </span>
                </div>
                <div class="d-flex mt-4">
                  <div style="width: 270px; max-width: 270px;">
                    <ATATDatePicker
                      id="ResearchStartDate"
                      class="mr-10"
                      :rules="[
                        $validators.required('Enter a start date using the format MM/DD/YYYY.'),
                        $validators.isDateValid('Please enter a valid date.'),
                      ]"
                      :value.sync="researchStartDate"
                      label="Start date"
                      placeHolder="MM/DD/YYYY"
                    />
                    <v-btn 
                      @click="toggleResearchEndDate()"
                      @keydown.space="toggleResearchEndDate()"
                      @keydown.enter="toggleResearchEndDate()"
                      class="_quaternary mt-1 px-2" >
                      <ATATSVGIcon 
                        color="primary" 
                        height="18" 
                        width="18" 
                        :name="researchButtonIconName" 
                        class="mr-2"
                      />
                      {{ researchEndDateBtnText }} 
                    </v-btn>

                  </div>
                  <ATATDatePicker
                    id="ResearchEndDate"
                    v-if="showResearchEndDate"
                    :rules="[
                      $validators.required('Enter an end date using the format MM/DD/YYYY.'),
                      $validators.isDateValid('Please enter a valid date.'),
                    ]"
                    :value.sync="researchEndDate"
                    label="End date"
                    placeHolder="MM/DD/YYYY"
                  />

                </div>

                <ATATTextArea 
                  id="InsufficientTimeReason"
                  class="mt-10"
                  label="Briefly discuss the market research data that supports your 
                    sole source determination"
                  helpText="Include the who, what, when, where, why, and outcome of your research."
                  :value.sync="supportingData"
                  :maxChars="1000"
                  :rows="6"
                  :validateItOnBlur="true"
                  :rules="[
                    $validators.required('Describe the results of your JWCC Contracts review.'),
                    $validators.maxLength(1000)
                  ]"
                />


              </div>
            </v-expand-transition>

            <hr />

            <ATATRadioGroup 
              id="ReviewedCatalogs"
              name="ReviewedCatalogs"
              :legend="reviewedCatalogsLegend"
              :value.sync="reviewedCatalogs"
              :items="reviewedCatalogsOptions"
              :rules="[$validators.required('Please select an option.')]"
            />



          </div>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { RadioButton, YesNo } from "types/Global";
import { getYesNoRadioOptions } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATDatePicker,
    ATATErrorValidation,
    ATATRadioGroup,
    ATATSelect,
    ATATSVGIcon,
    ATATTextArea,
    ATATTextField,
  }
})

export default class MarketResearchEfforts extends Vue {
  public cspName = "";
  public writeOwnCause: YesNo = "";
  public isLoading = false;

  public get introText(): string {
    return this.currentData.contract_action !== "NONE"
      ? `While you are not required to complete a Sole Source MRR, we need some 
        information for your J&A. Based on your responses below, we’ll suggest 
        language  to help you explain the market research conducted.`
      : `Answer a series of questions below about market research conducted to 
        identify all qualified sources. Based on your responses, we’ll suggest 
        language to help you complete this portion of your J&A and MRR.`;
  }


  public onlySourceCapableOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");
  public get isCspOnlySourceCapable(): boolean {
    return this.cspIsOnlySourceCapable === "YES";
  }

  public get onlySourceCapableLegend(): string {
    return `Did you review the specific capabilities in the JWCC Contracts to 
    determine that ${this.cspName} is the only source capable of fulfilling the 
    Government’s minimum needs in the manner and time frame required?`;
  }

  public showResearchEndDate = false;
  public get researchEndDateBtnText(): string {
    return this.showResearchEndDate ? "Remove end date" : "Add an end date";
  } 
  public get researchButtonIconName(): string {
    return this.showResearchEndDate ? "remove-circle" : "control-point";
  }
  public toggleResearchEndDate(): void {
    this.showResearchEndDate = !this.showResearchEndDate;
    if (!this.showResearchEndDate) {
      this.researchEndDate = "";
    }
  }
 
  public get productOrFeature(): string {
    return this.currentData.cause_product_feature_type === "PRODUCT" ? "product" : "feature";
  }
  public reviewedCatalogs: YesNo = "";
  public get reviewedCatalogsLegend(): string {
    return `Thinking of the unique ${this.productOrFeature} that you previously 
      told us about, did you review the JWCC contractor’s catalogs to determine 
      if other similar offerings meet or can be modified to satisfy your requirements?`;
  }
  public reviewedCatalogsOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");


  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }
  // EJY move data vars up to top
  public researchStartDate = "";
  public researchEndDate = "";
  public supportingData = "";

  // public currentData: FairOpportunityDTO = {};
  public cspIsOnlySourceCapable: YesNo = "";
  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      /* eslint-disable camelcase */
      cause_write_own_explanation: this.writeOwnCause,

      research_is_csp_only_source_capable: this.cspIsOnlySourceCapable,
      research_start_date: this.researchStartDate,
      research_end_date: this.researchEndDate,
      research_supporting_data: this.supportingData, 
      research_review_catalogs_reviewed: this.reviewedCatalogs,
      // research_review_catalogs_same_research_date?: YesNo;
      // research_review_catalogs_start_date?: string;
      // research_review_catalogs_end_date?: string;
      // research_review_catalogs_review_results?: string;
      // research_other_techniques_used?: string; // array of sys_ids
      // research_other_technique?: string;
      // research_personal_knowledge_person_or_position?: string;
      // research_techniques_summary?: string;
      // research_write_own_explanation?: YesNo;

    /* eslint-enable camelcase */
    }
    return Object.assign(fairOppSaved, formData);
  }



  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {

      const cspNames = {
        AWS: "Amazon",
        GCP: "Google",
        AZURE: "Microsoft",
        ORACLE: "Oracle",
      }      
      this.cspName = storeData.proposed_csp ? cspNames[storeData.proposed_csp] : "your CSP";


    }

  }

  public async mounted(): Promise<void> {
    this.isLoading = true;
    await this.loadOnEnter();
    this.isLoading = false;
  }



}
</script>