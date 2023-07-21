<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s find out more about your market research efforts
          </h1>
          <p class="copy-max-width mb-10">
            {{ introText }} 
            <span v-if="!hadExplanationOnLoad">
              If you would rather skip these questions, click the “I want to write 
              my own explanation” button below.
            </span>
            <a id="LearnMoreIGCE"
              role="button"
              tabindex="0"
              @click="openSlideoutPanel"
              @keydown.enter="openSlideoutPanel"
              @keydown.space="openSlideoutPanel"
            >
              Learn more about market research for the JWCC Contract
            </a>
          </p>

          <v-expand-transition>
            <AlertForForms  v-if="showAlert" :alertType="alertType" />
          </v-expand-transition>

          <div class="max-width-740">
            <ATATRadioGroup 
              id="OnlyCapableSource"
              name="OnlyCapableSource"
              :legend="onlySourceCapableLegend"
              @radioButtonSelected="onlyCapableSourceClicked"
              :value.sync="cspIsOnlySourceCapable"
              :items="onlySourceCapableOptions"
              :rules="[$validators.required('Please select an option.')]"
            />
            <v-expand-transition>
              <div v-if="showCspOnlySourceCapableFields" id="ResearchDetailsForm" class="mt-8">
                <div style="line-height: 1.3" id="ResearchSectionQuestion">
                  <span class="font-weight-500">When did you conduct this research?</span><br />
                  <span class="font-size-14 text-base">
                    Research must have been conducted within the previous 12 months. 
                  </span>
                </div>
                <div id="ResearchDatePickers" class="d-flex mt-4">
                  <div style="width: 270px; max-width: 270px;">
                    <ATATDatePicker
                      id="ResearchStartDate"
                      class="mr-10"
                      :rules="[
                        $validators.required('Enter a start date using the format MM/DD/YYYY.'),
                        $validators.isDateValid('Please enter a valid date.'),
                      ]"
                      :value.sync="researchStartDate"
                      :min="minResearchStartDate"
                      :max="today"
                      label="Start date"
                      placeHolder="MM/DD/YYYY"
                    />
                    <v-btn 
                      id="ResearchAddEndDate"
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
                    :min="minResearchEndDate"
                    :max="today"
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
                  id="SupportingData"
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
                    $validators.maxLength(
                      1000, 'Limit your description to 1,000 characters or less.'
                    )
                  ]"
                />

              </div>
            </v-expand-transition>


            <section id="ReviewCatalogsSection" v-if="cspHasPeculiarFeature">
              <hr />

              <ATATRadioGroup 
                id="ReviewedCatalogs"
                name="ReviewedCatalogs"
                :legend="reviewedCatalogsLegend"
                :value.sync="reviewedCatalogs"
                :items="reviewedCatalogsOptions"
                :rules="[$validators.required('Please select an option.')]"
              />

              <v-expand-transition>
                <div v-if="wereCatalogsReviewed" class="mt-8" id="ReviewedCatalogsForm">
                  <ATATRadioGroup 
                    id="ReviewedCatalogsSameDates"
                    name="ReviewedCatalogsSameDates"
                    class="mb-8"
                    v-if="hasResearchDates"
                    legend="Was this research conducted on the same date or date range 
                      as indicated above?"
                    :value.sync="sameAsResearchDate"
                    :items="sameDatesOptions"
                    :rules="[$validators.required('Please select an option.')]"
                  />
                  
                  <div class="mt-4" v-if="showCatalogReviewDates" id="ReviewedCatalogsDatesForm">
                    <div style="line-height: 1.3" id="ReviewedCatalogsQuestion">
                      <span class="font-weight-500">When did you conduct this research?</span><br />
                      <span class="font-size-14 text-base">
                        Research must have been conducted within the previous 12 months. 
                      </span>
                    </div>
                    <div class="d-flex mt-5" id="ReviewedCatalogsDatePickers">
                      <div style="width: 270px; max-width: 270px;">
                        <ATATDatePicker
                          id="CatalogReviewStartDate"
                          class="mr-10"
                          :rules="[
                            $validators.required(
                              'Enter a start date using the format MM/DD/YYYY.'
                            ),
                            $validators.isDateValid('Please enter a valid date.'),
                          ]"
                          :value.sync="catalogReviewStartDate"
                          :min="minResearchStartDate"
                          :max="today"
                          label="Start date"
                          placeHolder="MM/DD/YYYY"
                        />
                        <v-btn 
                          id="CatalogReviewAddEndDate"
                          @click="toggleCatalogReviewEndDate()"
                          @keydown.space="toggleCatalogReviewEndDate()"
                          @keydown.enter="toggleCatalogReviewEndDate()"
                          class="_quaternary mt-1 px-2" >
                          <ATATSVGIcon 
                            color="primary" 
                            height="18" 
                            width="18" 
                            :name="catalogReviewButtonIconName" 
                            class="mr-2"
                          />
                          {{ catalogReviewEndDateBtnText }} 
                        </v-btn>

                      </div>

                      <ATATDatePicker
                        id="CatalogReviewEndDate"
                        v-if="showCatalogReviewEndDate"
                        :rules="[
                          $validators.required('Enter an end date using the format MM/DD/YYYY.'),
                          $validators.isDateValid('Please enter a valid date.'),
                        ]"
                        :value.sync="catalogReviewEndDate"
                        :min="minCatalogReviewEndDate"
                        :max="today"
                        label="End date"
                        placeHolder="MM/DD/YYYY"
                      />
                    </div>
                  </div>
                  <ATATTextArea 
                    id="CatalogReviewResults"
                    class="mt-10"
                    label="Briefly discuss the results from your JWCC catalog review"
                    helpText="Fill in the blank to complete the suggested sentence below 
                      or write your own description."
                    :value.sync="catalogReviewResults"
                    :maxChars="1000"
                    :rows="6"
                    :validateItOnBlur="true"
                    :rules="[
                      $validators.required('Describe the results of your JWCC catalog review.'),
                      $validators.maxLength(
                        1000, 'Limit your description to 1,000 characters or less.'
                      )
                    ]"
                  />

                </div>
              </v-expand-transition>
            </section>


            <section id="OtherTechniquesSection" v-if="needsMRR">
              <hr />
              <ATATCheckboxGroup 
                id="OtherTechniques"
                groupLabel="What other techniques did you use?"
                :optional="otherTechniquesOptional"
                :items="otherTechniquesOptions"
                :value.sync="selectedTechniquesUsed"
                :rules="techniquesRules"
                :hasOtherValue="true"
                :otherValueEntered.sync="otherTechnique"
                otherValueRequiredMessage="Enter your other technique."
                :validateOtherOnBlur="true"
                :otherValue="getOtherTechniqueSysId"
              />
              
              <v-expand-transition>
                <ATATTextField 
                  v-if="showPersonalKnowledgePerson"
                  id="PersonReliedUpon"
                  :class="personalKnowledgeInputClass"
                  :value.sync="personalKnowledgePerson"
                  label="Name and/or position of the person relied upon"
                  tooltipText="This refers to the following technique you selected: 
                    “Personal knowledge in procuring supplies/services of this type”"
                  width="380"
                  :rules="[
                    $validators.required(`Enter the name and/or position of the person 
                      that has knowledge in procuring supplies/services of this type.`)
                  ]"

                />
              </v-expand-transition>
              <v-expand-transition>
                <ATATTextArea
                  v-if="showTechniquesSummary"
                  id="TechniquesSummary"
                  :class="techniquesSummaryInputClass"
                  :value.sync="techniquesSummary"
                  label="Summarize the market research performed using the technique(s) 
                    selected above"
                  helpText="Include the who, what, when, where, why, and outcome of your research."
                  :maxChars="1000"
                  rows="9"
                  :validateItOnBlur="true"
                  :noResize="false"
                  :rules="[
                    $validators.required('Enter a description of the research performed.'),
                    $validators.maxLength(
                      1000,'Limit your description to 1,000 characters or less.'
                    )
                  ]"

                />
              </v-expand-transition>
            </section>

          </div>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";

import AlertForForms from "../components/AlertForForms.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  FairOpportunityDTO, 
  FairOppDocGenType, 
  MarketResearchTechniquesDTO 
} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { Checkbox, RadioButton, YesNo } from "types/Global";
import { getCSPCompanyName, getYesNoRadioOptions, hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { addDays, format, isAfter, isSameDay, parseISO, sub } from "date-fns";

import SlideoutPanel from "@/store/slideoutPanel";
import {SlideoutPanelContent} from "../../../../types/Global";
import MarketResearchEffortsLearnMore
  from "@/steps/02-EvaluationCriteria/MRR/MarketResearchEffortsLearnMore.vue";


@Component({
  components: {
    AlertForForms,
    ATATCheckboxGroup,
    ATATDatePicker,
    ATATErrorValidation,
    ATATRadioGroup,
    ATATSelect,
    ATATSVGIcon,
    ATATTextArea,
    ATATTextField,
    MarketResearchEffortsLearnMore,
  }
})

export default class MarketResearchEfforts extends Mixins(SaveOnLeave) {
  public cspName = "";  
  public writeOwnExplanation: YesNo = "";
  public isLoading = false;

  public hasSuggestedTextBeenEdited = false;
  public isCustomExplanation = false;
  public hasExplanation = false;
  public explanationForDocgen: FairOppDocGenType = "";
  public hadExplanationOnLoad = false;

  public explanation = AcquisitionPackage.fairOppExplanations.researchDetails;

  public needsMRR = false;
  public cspHasPeculiarFeature = true;

  public researchStartDate = "";
  public researchEndDate = "";
  public supportingData = "";

  public sameAsResearchDate: YesNo | undefined = "";
  public catalogReviewStartDate = "";
  public catalogReviewEndDate = "";
  public catalogReviewResults = "";

  public otherTechniquesOptional = true;
  public techniquesUsed = ""; // csv string of sys ids for store/SNOW
  public selectedTechniquesUsed: string[] = []; // array of sys ids for UI
  public otherTechnique = "";
  public personalKnowledgePerson = "";
  public personalKnowledgePersonSysId = "";
  public otherTechniqueSysId = "";
  public techniquesSummary = "";
  public showPersonalKnowledgePerson = false;
  public showTechniquesSummary = false;

  public cspIsOnlySourceCapable: YesNo | undefined = "";

  public get introText(): string {
    return this.currentData.contract_action !== "NONE"
      ? `While you are not required to complete a Sole Source MRR, we need some 
        information for your J&A. Based on your responses below, we’ll suggest 
        language  to help you explain the market research conducted.`
      : `Answer a series of questions below about market research conducted to 
        identify all qualified sources. Based on your responses, we’ll suggest 
        language to help you complete this portion of your J&A and MRR.`;
  }

  public getDate(dateStr: string): Date {
    return dateStr.includes("-") ? parseISO(dateStr) : new Date(dateStr);
  }
  public dayAfter(date: Date): string {
    return format(addDays(date, 1), "MM/dd/yyyy");
  }
  public formatISOShort(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  // =================================================================
  // ========== FORM SECTION 1 - CSP IS ONLY SOURCE CAPABLE ==========

  public onlySourceCapableOptions: RadioButton[] = getYesNoRadioOptions("OnlySourceCapable");
  public get showCspOnlySourceCapableFields(): boolean {
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

  public onlyCapableSourceClicked(itemSelected: string): void{
    /**
     * if user had entered research date/date range && selected NO 
     * for `was tis research conducted on the same date or date as indicated above`
     * then selects NO for the #OnlyCapableSource radio button list
     * ensure that catalog dates match the research dates
     */
    if (itemSelected === "NO"){
      if (this.sameAsResearchDate === "YES"){
        this.showCatalogReviewEndDate = this.showResearchEndDate;
        this.catalogReviewStartDate = this.researchStartDate;
        this.catalogReviewEndDate = this.researchEndDate !== ""
          ? this.formatISOShort(new Date(this.researchEndDate))
          : ""
      }
    }
  }

  @Watch("researchStartDate")
  public researchStartDateChanged(): void {
    if (this.researchStartDate) {
      const start = this.getDate(this.researchStartDate);
      if (this.researchEndDate) {
        // make sure end date is after start date
        const end = this.getDate(this.researchEndDate)
        if (isAfter(start, end) || isSameDay(start, end)) {
          this.researchEndDate = this.dayAfter(start);
        }
      }
      this.minResearchEndDate = this.formatISOShort(new Date(this.dayAfter(start)));
    }
  }
  // min start date is 1 year ago
  public minResearchStartDate = this.formatISOShort(sub(new Date(), {years: 1}));
  // default min start date is the day after 1 year ago
  public minResearchEndDate: string = 
    this.formatISOShort(addDays(sub(new Date(), {years: 1}), 1));
  public today = this.formatISOShort(new Date());

  // =====================================================
  // ========== FORM SECTION 2 - CATALOG REVIEW ==========

  public get productOrFeature(): string {
    return this.currentData.cause_product_feature_type === "PRODUCT" ? "product" : "feature";
  }
  public reviewedCatalogs: YesNo | undefined = "";
  public get reviewedCatalogsLegend(): string {
    return `Thinking of the unique ${this.productOrFeature} that you previously 
      told us about, did you review the JWCC contractor’s catalogs to determine 
      if other similar offerings meet or can be modified to satisfy your requirements?`;
  }
  public reviewedCatalogsOptions: RadioButton[] = getYesNoRadioOptions("ReviewedCatalogs");
  public get wereCatalogsReviewed(): boolean {
    return this.reviewedCatalogs === "YES";
  }
  public sameDatesOptions: RadioButton[] = [
    { id: "YesSameDates", label: "Yes", value: "YES" },
    { id: "NoSameDates", label: "No, I want to enter a new date or date range.", value: "NO" },
  ];

  public get hasResearchDates(): boolean {
    return this.researchStartDate !== "" 
      && this.cspIsOnlySourceCapable !== "NO";
  }
  public get showCatalogReviewDates(): boolean {
    return (this.hasResearchDates && this.sameAsResearchDate === "NO") 
      || !this.hasResearchDates;
  }
  public showCatalogReviewEndDate = false;
  public get catalogReviewEndDateBtnText(): string {
    return this.showCatalogReviewEndDate ? "Remove end date" : "Add an end date";
  } 
  public get catalogReviewButtonIconName(): string {
    return this.showCatalogReviewEndDate ? "remove-circle" : "control-point";
  }
  public toggleCatalogReviewEndDate(): void {
    this.showCatalogReviewEndDate = !this.showCatalogReviewEndDate;
    if (!this.showCatalogReviewEndDate) {
      this.catalogReviewEndDate = "";
    }
  }
  @Watch("catalogReviewStartDate")
  public catalogReviewStartDateChanged(): void {
    if (this.catalogReviewStartDate) {
      const start = this.getDate(this.catalogReviewStartDate);
      if (this.catalogReviewEndDate) {
        const end = this.getDate(this.catalogReviewEndDate);
        if (isAfter(start, end) || isSameDay(start, end)) {
          this.catalogReviewEndDate = this.dayAfter(start);
        }
      }
      this.minCatalogReviewEndDate = this.formatISOShort(new Date(this.dayAfter(start)));
    }
  }

  public minCatalogReviewEndDate: string = 
    this.formatISOShort(addDays(sub(new Date(), {years: 1}), 1));

  // =======================================================
  // ========== FORM SECTION 3 - OTHER TECHNIQUES ==========

  public otherTechniquesOptions: Checkbox[] = [];

  public get techniquesRules(): unknown[] {
    const rulesOn = this.needsMRR && this.cspIsOnlySourceCapable === "NO"
      && !this.wereCatalogsReviewed;
    this.otherTechniquesOptional = !rulesOn;
    return rulesOn ?
      [this.$validators.required(
        "Please select at least one technique used to conduct market research."
      )] : [];
  }

  public get getOtherTechniqueSysId(): string {
    const otherOptionObj = this.otherTechniquesOptions.find(obj => obj.label === "Other");
    return otherOptionObj ? otherOptionObj.value : "OtherTechnique"
  }

  @Watch("selectedTechniquesUsed")
  public selectedTechniquesUsedChanged(newVal: string[]): void {
    this.techniquesUsed = newVal.join(",");
    // check sys ids for selection of the "Personal knowledge in procuring... " option
    this.showPersonalKnowledgePerson = newVal.includes(this.personalKnowledgePersonSysId);
    this.showTechniquesSummary = newVal.length > 0;
  }

  public get personalKnowledgeInputClass(): string {
    return this.selectedTechniquesUsed.includes(this.otherTechniqueSysId) 
      ? "mt-4" : "mt-10";
  }
  
  public get techniquesSummaryInputClass(): string {
    const otherTechniqueSelected = this.selectedTechniquesUsed.includes(this.otherTechniqueSysId);
    const showPKP = this.showPersonalKnowledgePerson;
    return showPKP ? "mt-10" : otherTechniqueSelected ? "mt-4" : "mt-10";
  }


  // ========== END FORM SECTIONS ==========

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

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      /* eslint-disable camelcase */
      research_write_own_explanation: this.writeOwnExplanation,

      research_is_csp_only_source_capable: this.cspIsOnlySourceCapable,
      research_start_date: this.researchStartDate,
      research_end_date: this.researchEndDate,
      research_supporting_data: this.supportingData, 
      
      research_review_catalogs_reviewed: this.reviewedCatalogs,
      research_review_catalogs_same_research_date: this.sameAsResearchDate,
      research_review_catalogs_start_date: this.catalogReviewStartDate,
      research_review_catalogs_end_date: this.catalogReviewEndDate,
      research_review_catalogs_review_results: this.catalogReviewResults,

      research_other_techniques_used: this.techniquesUsed, // csv string of sys_ids
      research_other_technique: this.otherTechnique,
      research_personal_knowledge_person_or_position: this.personalKnowledgePerson,
      research_techniques_summary: this.techniquesSummary,

      research_details_for_docgen: this.explanationForDocgen,
    /* eslint-enable camelcase */
    }
    return Object.assign(fairOppSaved, formData);
  }

  public async setOtherTechniquesOptions(): Promise<void> {
    const techniques: MarketResearchTechniquesDTO[] | null  
      = AcquisitionPackage.marketResearchTechniques;

    if (techniques) {
      this.otherTechniquesOptions = techniques.map((obj) => {
        if (obj.technique_value === "PERSONAL_KNOWLEDGE") {
          this.personalKnowledgePersonSysId = obj.sys_id as string;
        } else if (obj.technique_value === "OTHER") {
          this.otherTechniqueSysId = obj.sys_id as string;
        }       
        return {
          id: obj.technique_value as string, 
          value: obj.sys_id as string,
          label: obj.technique_label as string,
        }
      })
    }
  }

  /**
   * Opens the slideout panel assuming that the panel is already initialized.
   */
  public async openSlideoutPanel(e: Event): Promise<void> {
    const opener = e.currentTarget as HTMLElement;
    SlideoutPanel.openSlideoutPanel(opener.id);
  };

  /**
   * Initializes the slideout panel by setting the slideout panel component.
   */
  public async initializeSlideoutPanel(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: MarketResearchEffortsLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

  public async loadOnEnter(): Promise<void> {
    // eslint-disable-next-line camelcase
    await AcquisitionPackage.setFairOpportunity({research_write_own_explanation: "NO"})

    await this.setOtherTechniquesOptions();

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.writeOwnExplanation = "NO";
      this.explanationForDocgen = storeData.research_details_for_docgen;

      this.needsMRR = storeData.contract_action === "NONE";
      this.cspHasPeculiarFeature = storeData.cause_product_feature_peculiar_to_csp === "YES";

      this.cspIsOnlySourceCapable = storeData.research_is_csp_only_source_capable;

      this.researchStartDate = storeData.research_start_date as string;
      // format(new Date(storeData.research_start_date as string), "MM/dd/yyyy");

      this.researchEndDate = storeData.research_end_date as string;
      this.showResearchEndDate = this.researchEndDate !== "";
      this.supportingData = storeData.research_supporting_data as string; 

      this.reviewedCatalogs = storeData.research_review_catalogs_reviewed;
      this.sameAsResearchDate = storeData.research_review_catalogs_same_research_date;
      this.catalogReviewStartDate = storeData.research_review_catalogs_start_date as string;
      this.catalogReviewEndDate = storeData.research_review_catalogs_end_date as string;
      this.showCatalogReviewEndDate = this.catalogReviewEndDate !== "";
      this.catalogReviewResults = storeData.research_review_catalogs_review_results ||
        "The results have determined that no other offering is suitable as follows...";

      this.techniquesUsed = 
        storeData.research_other_techniques_used as string; // csv string of sys_ids
      this.selectedTechniquesUsed = this.techniquesUsed.length 
        ? this.techniquesUsed.split(",") : [];

      this.showPersonalKnowledgePerson = 
        this.selectedTechniquesUsed.includes(this.personalKnowledgePersonSysId);

      this.otherTechnique = storeData.research_other_technique as string;
      this.personalKnowledgePerson 
        = storeData.research_personal_knowledge_person_or_position as string;
      this.techniquesSummary = storeData.research_techniques_summary as string;

      // eslint-disable-next-line camelcase
      const fairOpp: FairOpportunityDTO = { research_write_own_explanation: "NO" };
      await AcquisitionPackage.setFairOpportunity(fairOpp);

      this.cspName = storeData.proposed_csp 
        ? getCSPCompanyName(storeData.proposed_csp) 
        : "this proposed CSP";

      this.hasExplanation = storeData.research_details_generated !== ""
        || storeData.research_details_custom !== "";
    }

    this.hadExplanationOnLoad = this.explanation.hadExplanationOnLoad as boolean;
    this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
    this.isCustomExplanation = this.explanation.useCustomText as boolean;

    await this.initializeSlideoutPanel();

  }

  public async mounted(): Promise<void> {
    this.isLoading = true;
    await this.loadOnEnter();
    this.isLoading = false;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    
    this.supportingData = this.supportingData.trim();
    this.catalogReviewResults = this.catalogReviewResults.trim();
    this.techniquesSummary = this.techniquesSummary.trim();

    let sectionsWithNoSelectedCount = 0;

    // ensure data cleared if any section main question is "NO"
    if (this.cspIsOnlySourceCapable !== "YES") {
      this.researchStartDate = "";
      this.researchEndDate = "";
      this.supportingData = "";
      this.sameAsResearchDate = ""
      sectionsWithNoSelectedCount++;
    }
    if (!this.cspHasPeculiarFeature || this.reviewedCatalogs !== "YES") {
      this.sameAsResearchDate = "";
      this.catalogReviewStartDate = "";
      this.catalogReviewEndDate = "";
      this.catalogReviewResults = "";
      sectionsWithNoSelectedCount++;
    }

    if (this.sameAsResearchDate === "YES") {
      this.catalogReviewStartDate = this.researchStartDate;
      this.catalogReviewEndDate = this.researchEndDate;
    }

    if (!this.needsMRR || this.selectedTechniquesUsed.length === 0) {
      this.techniquesUsed = "";
      this.otherTechnique = "";
      this.personalKnowledgePerson = "";
      this.techniquesSummary = "";
    }

    try {
      if (this.hasChanged()) {
        this.explanation.formEdited = true;
        this.writeOwnExplanation 
          = AcquisitionPackage.fairOpportunity?.research_write_own_explanation as YesNo;

        if (this.explanationForDocgen === "CUSTOM") {
          await AcquisitionPackage.setReplaceCustomWithGenerated(
            {section: "researchDetails", val: true }
          );
        }

        if (this.writeOwnExplanation === "NO") {
          // if it's already "YES" (set from action handler when "I want to write 
          //  my own explanation" button, don't change it, but if it's NO as set on page load, 
          // check if user answered "NO" to both sections 
          this.writeOwnExplanation = sectionsWithNoSelectedCount === 2 ? "YES" : "NO";
          this.explanationForDocgen = this.writeOwnExplanation === "YES" ? "CUSTOM" : "GENERATED";
        } else {
          this.explanationForDocgen = "CUSTOM";
        }
        this.explanation.useCustomText = this.explanationForDocgen === "CUSTOM";

        /* eslint-enable camelcase */
        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}

</script>
