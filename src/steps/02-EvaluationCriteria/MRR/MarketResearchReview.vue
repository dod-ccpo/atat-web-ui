<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pagewHeaderIntro }} your market research details
          </h1>
          <div class="copy-max-width">
            <p class="mb-4" v-if="!isCustom">
              Based on what you’ve told us, we’ve suggested language to describe the 
              extent of the market research you conducted to identify all qualified 
              sources. You can edit any details to meet your requirements, but be 
              sure to include all relevant information from the following instructions.
            </p>
            <p class="mb-4" v-else>
              In the field below, please describe the extent of the market research 
              you conducted to identify all qualified sources and the results thereof. 
              Be sure to include any relevant details from the following instructions.
            </p>

            <ATATTextArea 
              id="ResearchDetails"
              class="mt-6 textarea-max-width"
              label="Market research details"
              :labelSrOnly="true"
              :value.sync="researchDetails"
              :rows="getRowCount"
              :maxChars="4000"
              :validateItOnBlur="true"
              :rules="[
                this.$validators.required(`Describe the market research that was 
                  conducted for this effort.`),
                this.$validators.maxLength(
                  4000, 'Limit your description to 4,000 characters or less.'
                )
              ]"
            />

            <v-btn
              id="RestoreSuggestionButton"
              v-if="!isCustom"
              class="secondary font-size-14 px-4 mb-1 mt-1"
              :disabled="isResearchReviewDefault"
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

          </div>
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

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ConfirmRestoreDefaultTextModal from "../components/ConfirmRestoreDefaultTextModal.vue";

import { FairOpportunityDTO } from "@/api/models";
import { getCSPCompanyName } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { format, parseISO } from "date-fns";
import _ from "lodash";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    ATATSVGIcon,
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
  }
})

export default class MarketResearchReview extends Vue {
  public isCustom = false;
  public cspName = "";
  public generatedSuggestion = "";
  public researchDetails = "";
  public researchDetailsGenerated = "";
  public researchDetailsCustom = "";
  public showRestoreModal = false;

  public get pagewHeaderIntro(): string {
    return this.isCustom ? "Tell us about" : "Let’s review";
  }

  public isResearchReviewDefault = false;
  @Watch("researchDetails")
  public researchDetailsChanged(): void {
    this.isResearchReviewDefault = this.researchDetails === this.generatedSuggestion;
  }
  public confirmRestoreDefaultText(): void {
    this.showRestoreModal = true;
  }
  public restoreSuggestion(): void {
    this.researchDetails = this.generatedSuggestion;
    this.showRestoreModal = false;
  }
  get btnRestoreIconColor(): string {
    return this.isResearchReviewDefault ? "disabled" : "primary";
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  public get getRowCount(): number {
    return this.isCustom ? 12 : 19;
  }

  public async generateSuggestion(): Promise<void> {
    const needsResearchP = this.savedData?.research_is_csp_only_source_capable === "YES";
    const needsCatalogReviewP = this.savedData?.research_review_catalogs_reviewed === "YES";
    const needsTechniquesP = this.savedData?.research_other_techniques_used !== ""
      && this.savedData?.research_techniques_summary !== "";

    let suggestedText = "";
    if (needsResearchP) {
      suggestedText += "Additional research was conducted "
      const start = this.savedData?.research_start_date;
      const end = this.savedData?.research_end_date;
      if (start) {
        suggestedText += format(new Date(parseISO(start)), "MM/dd/yyyy");
      } if (end) {
        suggestedText += "–" + format(new Date(parseISO(end)), "MM/dd/yyyy")
      }
      suggestedText += " by reviewing the specific capabilities in the JWCC Contracts " +
        "and it was determined that " + this.cspName + " is the only source capable of " + 
        "fulfilling the Government’s minimum needs in the manner and time frame required. " +
        this.savedData?.research_supporting_data + "\n\n"; 
    }

    if (needsCatalogReviewP) {
      suggestedText += "Further research was conducted "
      const start = this.savedData?.research_review_catalogs_start_date;
      const end = this.savedData?.research_review_catalogs_end_date;
      if (start) {
        suggestedText += format(new Date(parseISO(start)), "MM/dd/yyyy");
      } if (end) {
        suggestedText += "–" + format(new Date(parseISO(end)), "MM/dd/yyyy")
      }
      suggestedText += "by reviewing the JWCC contractor's catalogs to determine " +
        "if other similar offerings (to include: " + 
        this.savedData?.cause_product_feature_type + " " +
        "meet or can be modified to satisfy the Government’s requirements. The results " + 
        "have determined that no other offering is suitable as follows: " +
        this.savedData?.research_review_catalogs_review_results + " " +
        "Therefore, it was determined the " + 
        this.savedData?.cause_product_feature_name + " " +
        "is essential to the Government’s requirements and " + this.cspName + " " +
        "is the only source capable of fulfilling the Government’s minimum needs in " +
        "the manner and time frame required. \n\n"
    }

    if (needsTechniquesP) {
      suggestedText += this.savedData?.research_techniques_summary;
    }

    this.researchDetailsSuggested = suggestedText;

  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.cspName = storeData.proposed_csp 
        ? getCSPCompanyName(storeData.proposed_csp) 
        : "this proposed CSP";

      this.isCustom = storeData.research_write_own_explanation === "YES";
      if (!this.isCustom) {
        await this.generateSuggestion();
        this.researchDetails = storeData.research_details_generated as string
          || this.researchDetailsGenerated;
      } else {
        this.researchDetails = storeData.research_details_custom as string;
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>