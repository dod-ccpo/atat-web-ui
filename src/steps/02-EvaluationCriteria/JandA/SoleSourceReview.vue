<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pageHeaderIntro }} the cause of your sole source situation
          </h1>
          <div class="copy-max-width">
            <p class="mb-4" v-if="!useCustomTextOnLoad">
              Based on what you’ve told us, we’ve suggested language to explain the 
              factors that led to your decision to solicit only one source for this 
              project. You can edit any details to meet your requirements, but be sure
              to include all relevant information from the following instructions.
            </p>
            <p class="mb-4" v-else-if="allSectionsNO">
              Your project has an uncommon cause for an exception to fair opportunity, 
              so unfortunately, we were not able to suggest language to help you 
              complete this portion of the J&A. In the field below, please explain 
              the factors that led to your decision to solicit only one source for 
              this project. Be sure to include any relevant details from the following 
              instructions.
            </p>
            <p class="mb-4" v-else>
              In the field below, please explain the factors that led to your decision
              to solicit only one source for this project. Be sure to include any 
              relevant details from the following instructions.
            </p>

            <ATATExpandableLink aria-id="Instructions">
              <template v-slot:header>
                Instructions for this portion of the J&A
              </template>
              <template v-slot:content>
                <ul class="_atat-ul">
                  <li>
                    If full and open competition would be feasible had more time been 
                    available, discuss other factors that impacted the decision to 
                    solicit only one source (e.g., time required to conduct a competitive 
                    procurement; consideration of phase-in/phase-out requirements; 
                    complexity of requirement; etc.). 
                  </li>
                  <li>
                    If the required delivery date could have been satisfied using full 
                    and open competition on the date the requirement first became known, 
                    provide an explanation for the delay in submitting the requirement.
                  </li>
                  <li>
                    If normal contracting methods could not have satisfied the required 
                    delivery date, describe the circumstances that caused this emergency 
                    and how they will be prevented in the future. 
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>
            
            <RestoreSuggestionAlert :showAlert="showAlert" />

            <ATATTextArea 
              id="SoleSourceSituation"
              class="mt-6 textarea-max-width"
              label="Cause of your sole source situation"
              :labelSrOnly="true"
              :value.sync="soleSourceCause"
              :autoGrow="true"
              :rows="10"
              minHeight="200"
              :maxChars="2500"
              :validateItOnBlur="true"
              :noResize="false"
              :rules="[
                this.$validators.required(`Enter an explanation for the cause of 
                  your sole source situation.`),
                this.$validators.maxLength(2500)
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
              section="soleSource"
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
import SaveOnLeave from "@/mixins/saveOnLeave";
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ConfirmRestoreDefaultTextModal from "../components/ConfirmRestoreDefaultTextModal.vue";
import ExplanationButtons from "../components/ExplanationButtons.vue";
import GoToQuestionnaire from "../components/GoToQuestionnaire.vue";
import RestoreSuggestionAlert from "../components/RestoreSuggestionAlert.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import { FairOpportunityDTO } from "@/api/models";
import {routeNames} from "@/router/stepper";

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

export default class SoleSourceReview extends Mixins(SaveOnLeave) {
  public projectTitle = AcquisitionPackage.projectTitle;
  
  public soleSourceCause = "";
  public soleSourceCauseGenerated = "";
  public soleSourceCauseCustom = "";
  public defaultSuggestion = "";

  public showRestoreModal = false;
  public showConfirmToCustomExplanationModal = false;

  public useCustomText = false;
  public useCustomTextOnLoad = false;
  public replaceCustomWithDefault = false;
  public allSectionsNO = false;
  public routeNames = routeNames;

  public showAlert = false;
  public hasFormBeenEdited = false;
  public hasSuggestedTextBeenEdited = false;
  public explanation = AcquisitionPackage.fairOppExplanations.soleSource;

  public get pageHeaderIntro(): string {
    return this.useCustomTextOnLoad ? "Tell us about" : "Let’s review";
  } 
  public get showChangeToCustomButton(): boolean {
    return !this.useCustomText && this.soleSourceCauseCustom.length > 0;
  }
  public get showChangeToDAPPSButton(): boolean {
    return this.useCustomText && this.soleSourceCauseGenerated.length > 0;
  }
  public get showRestoreSuggestionButton(): boolean {
    return this.soleSourceCauseGenerated !== undefined && this.soleSourceCauseGenerated.length > 0;
  }
  public get restoreButtonNeedsMargin(): boolean {
    return this.showChangeToCustomButton || this.showChangeToDAPPSButton;
  }
  public get displayHelpLink(): boolean {
    return this.explanation.hadExplanationOnLoad as boolean;
  }
  public get userEditedDefaultSuggestion(): boolean {
    return this.useCustomText 
      ? this.soleSourceCauseGenerated !== this.defaultSuggestion
      : this.soleSourceCause !== this.defaultSuggestion;
  }

  public async restoreSuggestion(): Promise<void> {
    this.soleSourceCause = this.defaultSuggestion;
    this.soleSourceCauseGenerated = this.defaultSuggestion;
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
    this.soleSourceCauseCustom = this.soleSourceCause;
    this.soleSourceCause = this.soleSourceCauseGenerated;
    this.useCustomText = false;
    this.explanation.useCustomText = false;
  }

  public async changeToCustomExplanation(): Promise<void> {
    this.soleSourceCauseGenerated = this.soleSourceCause;
    this.soleSourceCause = this.soleSourceCauseCustom || "";
    this.useCustomText = true;
    this.explanation.useCustomText = true;
  }

  private get getIconColor():string {
    return this.userEditedDefaultSuggestion ? "primary" : "disabled";
  }

  public async goToQuestionnaire(): Promise<void> {
    await AcquisitionPackage.doSetFairOppBackToReview(true);
    this.$router.push({
      name: routeNames.SoleSourceCause,
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
      cause_of_sole_source_generated: this.soleSourceCauseGenerated as string,
      cause_of_sole_source_custom: this.soleSourceCauseCustom as string,
      cause_of_sole_source_for_docgen: this.useCustomText ? "CUSTOM" : "GENERATED"
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
      this.allSectionsNO = storeData.cause_migration_addl_time_cost === "NO"
        && storeData.cause_govt_engineers_training_certified === "NO"
        && storeData.cause_product_feature_peculiar_to_csp === "NO";

      this.soleSourceCauseCustom = storeData.cause_of_sole_source_custom as string;
      this.soleSourceCauseGenerated = storeData.cause_of_sole_source_generated as string;

      this.useCustomText = this.explanation.useCustomText as boolean;
      this.useCustomTextOnLoad = this.explanation.useCustomText as boolean;
      this.replaceCustomWithDefault = AcquisitionPackage.replaceCustomWithGenerated;
      
      this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
      this.hasFormBeenEdited = this.explanation.formEdited as boolean;
      this.showAlert = !this.replaceCustomWithDefault 
        && this.hasSuggestedTextBeenEdited && this.hasFormBeenEdited;

      await AcquisitionPackage.generateFairOpportunitySuggestion("SoleSource");
      this.defaultSuggestion = this.explanation.defaultSuggestion as string;
      
      if (!this.useCustomText) {
        if (!this.hasSuggestedTextBeenEdited || this.replaceCustomWithDefault) {
          // if suggested text hasn't been edited, or user navigated to the form
          // while using "custom" text, automatically set to the default generated suggestion
          this.soleSourceCause = this.defaultSuggestion;
          if (this.replaceCustomWithDefault) {
            this.soleSourceCauseGenerated = this.defaultSuggestion;
          }
        } else {
          // since user edited the default suggestion, user is shown alert and must click
          // the "Restore default suggestion" to view the new suggested text
          this.soleSourceCause = this.soleSourceCauseGenerated as string;
        }
      } else {
        this.soleSourceCause = this.soleSourceCauseCustom as string;
      }

      await AcquisitionPackage.setReplaceCustomWithGenerated(
        { section: "soleSource", val: false }
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
      this.soleSourceCauseCustom = this.soleSourceCause.trim();
    } else {
      this.soleSourceCauseGenerated = this.soleSourceCause.trim();
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
