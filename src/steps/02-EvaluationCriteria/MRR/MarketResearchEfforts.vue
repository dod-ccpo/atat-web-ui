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
              :value.sync="currentData.research_is_csp_only_source_capable"
              :items="onlySourceCapableOptions"
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
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
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
    ATATErrorValidation,
    ATATRadioGroup,
    ATATSelect,
    ATATTextArea,
    ATATTextField,
  }
})

export default class MarketResearchEfforts extends Vue {
  public cspName = "";
  public writeOwnCause: YesNo = "";
  public isLoading = false;

  // public cspIsOnlySourceCapable: YesNo = "";

  public get introText(): string {
    return this.currentData.contract_action !== "NONE"
      ? `Answer a series of questions below about market research conducted to 
        identify all qualified sources. Based on your responses, we’ll suggest 
        language to help you complete this portion of your J&A and MRR.`
      : `Answer a series of questions below about market research conducted to 
        identify all qualified sources. Based on your responses, we’ll suggest 
        language to help you complete this portion of your J&A and MRR.`;
  }

  public get onlySourceCapableLegend(): string {
    return `Did you review the specific capabilities in the JWCC Contracts to 
    determine that ${this.cspName} is the only source capable of fulfilling the 
    Government’s minimum needs in the manner and time frame required?`
  }

  public onlySourceCapableOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");


  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }
  public currentData: FairOpportunityDTO = {};
  // public researchStartDate = "";
  // public researchEndDate = "";

  // public get currentData(): FairOpportunityDTO {
  //   const fairOppSaved: FairOpportunityDTO 
  //     = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
  //     || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
  //   const formData: FairOpportunityDTO = {
  //     /* eslint-disable camelcase */
  //     cause_write_own_explanation: this.writeOwnCause,

  //     research_is_csp_only_source_capable: this.cspIsOnlySourceCapable,
  //     research_start_date: this.researchStartDate,
  //     research_end_date: this.researchEndDate,
  //     research_supporting_data?: string; 
  //     research_review_catalogs_reviewed?: YesNo;
  //     research_review_catalogs_same_research_date?: YesNo;
  //     research_review_catalogs_start_date?: string;
  //     research_review_catalogs_end_date?: string;
  //     research_review_catalogs_review_results?: string;
  //     research_other_techniques_used?: string; // array of sys_ids
  //     research_other_technique?: string;
  //     research_personal_knowledge_person_or_position?: string;
  //     research_techniques_summary?: string;
  //     research_write_own_explanation?: YesNo;

  //   /* eslint-enable camelcase */
  //   }
  //   return Object.assign(fairOppSaved, formData);
  // }



  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.currentData = storeData;

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