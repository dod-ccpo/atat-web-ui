<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pagewHeaderIntro }} your market research details
          </h1>
          <div class="copy-max-width">
            <p class="mb-4" v-if="!useCustomTextOnLoad">
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

            <ATATExpandableLink aria-id="Instructions">
              <template v-slot:header>
                Instructions for this portion of the J&A
              </template>
              <template v-slot:content>
                <ul class="_atat-ul">
                  <li>
                    Research must have been meaningful and conducted within the 
                    previous 12 months.
                  </li>
                  <li>
                    Include a detailed description and results of the market research 
                    (including who, what, when, where, why and the outcome) or a 
                    statement discussing why it was not conducted.
                  </li>
                  <li>
                    Fully analyze any alternative strategies to using an exception
                    to fair opportunity and indicate a good faith effort to consider 
                    viable alternatives.
                  </li>
                  <li>
                    For more information about market research procedures, reference 
                    <a id="FARProceduresLink"
                      href="https://www.acquisition.gov/far/10.002" 
                      target="_blank" 
                    >FAR <span class="_external-link">10.002</span></a>.
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>

            <RestoreSuggestionAlert :showAlert="showAlert" />

            <ATATTextArea 
              id="ResearchDetails"
              class="mt-6 textarea-max-width"
              label="Market research details"
              :labelSrOnly="true"
              :value.sync="researchDetails"
              :autoGrow="true"
              :rows="10"
              minHeight="200"
              :maxChars="4000"
              :validateItOnBlur="true"
              :noResize="false"
              :rules="[
                this.$validators.required(`Describe the market research that was 
                  conducted for this effort.`),
                this.$validators.maxLength(
                  4000, 'Limit your description to 4,000 characters or less.'
                )
              ]"
            />

            <ExplanationButtons 
              :showChangeToCustomButton="showChangeToCustomButton"
              :showChangeToDAPPSButton="showChangeToDAPPSButton"
              :showRestoreSuggestionButton="showRestoreSuggestionButton"
              :isRestoreDisabled="!userEditedDefaultSuggestion"
              :btnRestoreIconColor="getIconColor"
              :restoreButtonNeedsMargin="restoreButtonNeedsMargin"
              @changeToCustomExplanation="changeToCustomExplanation"
              @changeToDAPPSSuggestion="changeToDAPPSSuggestion"
              @confirmRestoreDefaultText="confirmRestoreDefaultText"
            />

            <GoToQuestionnaire 
              v-if="displayHelpLink"
              section="researchDetails"
              @goToQuestionnaire="goToQuestionnaire"
            />          

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
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ConfirmRestoreDefaultTextModal from "../components/ConfirmRestoreDefaultTextModal.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATAlert from "@/components/ATATAlert.vue";
import ExplanationButtons from "../components/ExplanationButtons.vue";
import GoToQuestionnaire from "../components/GoToQuestionnaire.vue";
import RestoreSuggestionAlert from "../components/RestoreSuggestionAlert.vue"

import { FairOpportunityDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { routeNames } from "@/router/stepper";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATSVGIcon,
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
    ExplanationButtons,
    GoToQuestionnaire,
    RestoreSuggestionAlert,
  }
})

export default class MarketResearchReview extends Mixins(SaveOnLeave) {
  public defaultSuggestion = "";
  public researchDetails = "";
  public researchDetailsGenerated = "";
  public researchDetailsCustom = "";
  public showRestoreModal = false;

  public useCustomText = false;
  public useCustomTextOnLoad = false;
  public replaceCustomWithDefault = false;
  public allSectionsNO = false;
  public routeNames = routeNames;
  public showAlert = false;
  public hasFormBeenEdited = false;
  public hasSuggestedTextBeenEdited = false;
  public explanation = AcquisitionPackage.fairOppExplanations.researchDetails;

  public get pagewHeaderIntro(): string {
    return this.useCustomTextOnLoad ? "Tell us about" : "Let’s review";
  }

  public get showChangeToCustomButton(): boolean {
    return !this.useCustomText && this.researchDetailsCustom.length > 0;
  }
  public get showChangeToDAPPSButton(): boolean {
    return this.useCustomText && this.researchDetailsGenerated.length > 0;
  }
  public get showRestoreSuggestionButton(): boolean {
    return this.researchDetailsGenerated !== undefined && this.researchDetailsGenerated.length > 0;
  }
  public get restoreButtonNeedsMargin(): boolean {
    return this.showChangeToCustomButton || this.showChangeToDAPPSButton;
  }
  public get displayHelpLink(): boolean {
    return this.explanation.hadExplanationOnLoad as boolean;
  }
  public get userEditedDefaultSuggestion(): boolean {
    return this.useCustomText 
      ? this.researchDetailsGenerated !== this.defaultSuggestion
      : this.researchDetails !== this.defaultSuggestion;
  }

  public restoreSuggestion(): void {
    this.researchDetails = this.defaultSuggestion;
    this.researchDetailsGenerated = this.defaultSuggestion;
    this.hasFormBeenEdited = false;
    this.explanation.formEdited = false;
    this.explanation.defaultSuggestionEdited = false;
    this.showRestoreModal = false;
    this.useCustomText = false;
    this.showAlert = false;
  }

  public confirmRestoreDefaultText(): void {
    this.showRestoreModal = true;
  }

  public async changeToDAPPSSuggestion(): Promise<void> {
    this.researchDetailsCustom = this.researchDetails;
    this.researchDetails = this.researchDetailsGenerated;
    this.useCustomText = false;
    this.explanation.useCustomText = false;
  }

  public async changeToCustomExplanation(): Promise<void> {
    this.researchDetailsGenerated = this.researchDetails;
    this.researchDetails = this.researchDetailsCustom || "";
    this.useCustomText = true;
    this.explanation.useCustomText = true;
  }

  private get getIconColor():string {
    return this.userEditedDefaultSuggestion ? "primary" : "disabled";
  }

  public async goToQuestionnaire(): Promise<void> {
    await AcquisitionPackage.doSetFairOppBackToReview(true);
    this.$router.push({
      name: routeNames.MarketResearchEfforts,
      params: {
        direction: "next"
      }   
    }).catch((e: Error) => console.error(e));
  }

  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      /* eslint-disable camelcase */
      research_details_generated: this.researchDetailsGenerated as string,
      research_details_custom: this.researchDetailsCustom as string,
      research_details_for_docgen: this.useCustomText ? "CUSTOM" : "GENERATED"
      /* eslint-enable camelcase */
    }
    return Object.assign(fairOppSaved, formData);
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  public async loadOnEnter(): Promise<void> {
    await AcquisitionPackage.doSetFairOppBackToReview(false);

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {

      this.allSectionsNO = storeData.research_is_csp_only_source_capable === "NO" 
        && storeData.research_review_catalogs_reviewed !== "YES"

      this.researchDetailsCustom = storeData.research_details_custom as string;
      this.researchDetailsGenerated = storeData.research_details_generated as string;

      this.useCustomText = this.explanation.useCustomText as boolean;
      this.useCustomTextOnLoad = this.explanation.useCustomText as boolean;
      this.replaceCustomWithDefault = AcquisitionPackage.replaceCustomWithGenerated;

      this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
      this.hasFormBeenEdited = this.explanation.formEdited as boolean;
      this.showAlert = !this.replaceCustomWithDefault 
        && this.hasSuggestedTextBeenEdited && this.hasFormBeenEdited;

      await AcquisitionPackage.generateFairOpportunitySuggestion("ResearchDetails");
      
      this.defaultSuggestion = this.explanation.defaultSuggestion as string;

      if (!this.useCustomText) {
        if (!this.hasSuggestedTextBeenEdited || this.replaceCustomWithDefault) {
          // if suggested text hasn't been edited, or user navigated to the form
          // while using "custom" text, automatically set to the default generated suggestion
          this.researchDetails = this.defaultSuggestion;
          if (this.replaceCustomWithDefault) {
            this.researchDetailsGenerated = this.defaultSuggestion;
          }
        } else {
          // since user edited the default suggestion, user is shown alert and must click
          // the "Restore default suggestion" to view the new suggested text
          this.researchDetails = this.researchDetailsGenerated as string;
        }
      } else {
        this.researchDetails = this.researchDetailsCustom as string;
      }

      await AcquisitionPackage.setReplaceCustomWithGenerated(
        { section: "researchDetails", val: false }
      );
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.useCustomText) {
      this.researchDetailsCustom = this.researchDetails.trim();
    } else {
      this.researchDetailsGenerated = this.researchDetails.trim();
    }

    this.explanation.formEdited = false;
    this.explanation.defaultSuggestionEdited = this.userEditedDefaultSuggestion
    this.explanation.useCustomText = this.useCustomText;

    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }


}
</script>