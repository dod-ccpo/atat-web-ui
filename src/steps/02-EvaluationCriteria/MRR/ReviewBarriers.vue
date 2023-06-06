<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pageHeaderIntro }} plans to remove barriers to fair opportunity
          </h1>
          <div class="copy-max-width">

            <p v-if="allSectionsNO">
              Unfortunately, we were not able to suggest language to help you complete
              this portion of the J&A. In the field below, briefly describe the actions
              proposed to remove or overcome barriers that led to the exception to fair
              opportunity. If a J&A was prepared to support any related prior procurements,
              explain the results of any actions taken to remove barriers.
            </p>
            <p v-else-if="!useCustomTextOnLoad">
              In the field below, briefly describe the actions proposed to remove
              or overcome barriers that led to the exception to fair opportunity.
              If a J&A was prepared to support any related prior procurements,
              explain the results of any actions taken to remove barriers.
            </p>
            <p v-else>
              Based on what you’ve told us, we’ve suggested language to describe the 
              actions proposed to remove barriers to fair opportunity. You can edit 
              any details to meet yourrequirements.
            </p>

            <RestoreSuggestionAlert :showAlert="showAlert" />

            <ATATTextArea
              id="BarriersTextArea"
              class="textarea-max-width"
              label="Plans to remove barriers to fair opportunity"
              :labelSrOnly="true"
              :value.sync="barriersToOpportunity"
              :autoGrow="true"
              :rows="10"
              minHeight="200"
              :maxChars="2500"
              :validateItOnBlur="true"
              :noResize="false"
              :rules="[
                  $validators.required('Describe the actions proposed to remove barriers to fair' +
                  ' opportunity..'),
                  $validators.maxLength(2500,'Limit your description to 2,500 characters or less.')
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
              section="plansToRemoveBarriers"
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
import ATATTextArea from "@/components/ATATTextArea.vue";
import ConfirmRestoreDefaultTextModal
  from "@/steps/02-EvaluationCriteria/components/ConfirmRestoreDefaultTextModal.vue";
import ExplanationButtons from "../components/ExplanationButtons.vue";
import GoToQuestionnaire from "../components/GoToQuestionnaire.vue";
import RestoreSuggestionAlert from "../components/RestoreSuggestionAlert.vue"

import { FairOpportunityDTO } from "@/api/models";
import _ from "lodash";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import { routeNames } from "@/router/stepper";

@Component({
  components: {
    ATATSVGIcon,
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
    ExplanationButtons,
    GoToQuestionnaire,
    RestoreSuggestionAlert,
  },
})

export default class ReviewBarriers extends Mixins(SaveOnLeave){
  public barriersToOpportunity = "";
  public defaultSuggestion = "";
  public showRestoreModal = false;
  public plansToRemoveCustom = "";
  public plansToRemoveGenerated = "";
  public allSectionsNO = false;

  public useCustomText = false;
  public useCustomTextOnLoad = false;
  public replaceCustomWithDefault = false;
  public routeNames = routeNames;

  public showAlert = false;
  public hasFormBeenEdited = false;
  public hasSuggestedTextBeenEdited = false;
  public explanation = AcquisitionPackage.fairOppExplanations.plansToRemoveBarriers;

  public get userEditedDefaultSuggestion(): boolean {
    return this.useCustomText 
      ? this.plansToRemoveGenerated !== this.defaultSuggestion
      : this.barriersToOpportunity !== this.defaultSuggestion;
  }

  public get showChangeToCustomButton(): boolean {
    return !this.useCustomText && this.plansToRemoveCustom.length > 0;
  }
  public get showChangeToDAPPSButton(): boolean {
    return this.useCustomText && this.plansToRemoveCustom.length > 0;
  }
  public get showRestoreSuggestionButton(): boolean {
    return this.plansToRemoveGenerated !== undefined && this.plansToRemoveGenerated.length > 0;
  }
  public get restoreButtonNeedsMargin(): boolean {
    return this.showChangeToCustomButton || this.showChangeToDAPPSButton;
  }
  public get displayHelpLink(): boolean {
    // eslint-disable-next-line max-len 
    return this.explanation.hadExplanationOnLoad as boolean;
  }

  public restoreSuggestion(): void {
    this.barriersToOpportunity = this.defaultSuggestion;
    this.plansToRemoveGenerated = this.defaultSuggestion;
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

  private get getIconColor():string {
    return this.userEditedDefaultSuggestion ? "primary" : "disabled";
  }

  public async changeToDAPPSSuggestion(): Promise<void> {
    this.plansToRemoveCustom = this.barriersToOpportunity;
    this.barriersToOpportunity = this.plansToRemoveGenerated;
    this.useCustomText = false;
    this.explanation.useCustomText = false;
  }

  public async changeToCustomExplanation(): Promise<void> {
    this.plansToRemoveGenerated = this.barriersToOpportunity;
    this.barriersToOpportunity = this.plansToRemoveCustom || "";
    this.useCustomText = true;
    this.explanation.useCustomText = true;
  }

  public async goToQuestionnaire(): Promise<void> {
    AcquisitionPackage.doSetFairOppBackToReview(true);
    this.$router.push({
      name: routeNames.RemoveBarriers,
      params: {
        direction: "next"
      }   
    });
  }

  public get pageHeaderIntro(): string {
    return this.useCustomTextOnLoad ? "Tell us how your agency" : "Let’s review your agency’s";
  }

  private get currentData(): FairOpportunityDTO {
    /* eslint-disable camelcase */
    return {
      barriers_plans_to_remove_custom: this.plansToRemoveCustom,
      barriers_plans_to_remove_generated: this.plansToRemoveGenerated,
      barriers_plans_to_remove_for_docgen: this.useCustomText ? "CUSTOM" : "GENERATED",
    } as FairOpportunityDTO;
    /* eslint-enable camelcase */
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    await AcquisitionPackage.doSetFairOppBackToReview(false);

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.allSectionsNO = storeData.barriers_follow_on_requirement === "NO" &&
        storeData.barriers_agency_pursuing_training_or_certs === "NO" &&
        storeData.barriers_planning_future_development === "NO" &&
        storeData.barriers_j_a_prepared === "NO";
 
      this.plansToRemoveCustom = storeData.barriers_plans_to_remove_custom as string;
      this.plansToRemoveGenerated = storeData.barriers_plans_to_remove_generated as string;

      this.useCustomText = this.explanation.useCustomText as boolean;
      this.useCustomTextOnLoad = this.explanation.useCustomText as boolean;
      this.replaceCustomWithDefault = AcquisitionPackage.replaceCustomWithGenerated;

      /* eslint-disable max-len */
      this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
      this.hasFormBeenEdited = this.explanation.formEdited as boolean;
      /* eslint-enable max-len */

      this.showAlert = !this.replaceCustomWithDefault 
        && this.hasSuggestedTextBeenEdited && this.hasFormBeenEdited;


      AcquisitionPackage.generateFairOpportunitySuggestion("RemoveBarriers");
      this.defaultSuggestion = this.explanation.defaultSuggestion as string;

      if (!this.useCustomText) {
        if (!this.hasSuggestedTextBeenEdited || this.replaceCustomWithDefault) {
          // if suggested text hasn't been edited, or user navigated to the form
          // while using "custom" text, automatically set to the default generated suggestion
          this.barriersToOpportunity = this.defaultSuggestion;
          if (this.replaceCustomWithDefault) {
            this.plansToRemoveGenerated = this.defaultSuggestion;
          }
        } else {
          // since user edited the default suggestion, user is shown alert and must click
          // the "Restore default suggestion" to view the new suggested text
          this.barriersToOpportunity = this.plansToRemoveGenerated as string;
        }
      } else {
        this.barriersToOpportunity = this.plansToRemoveCustom as string;
      }

      await AcquisitionPackage.setReplaceCustomWithGenerated(
        { section: "plansToRemoveBarriers", val: false }
      );


    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.useCustomText) {
      this.plansToRemoveCustom = this.barriersToOpportunity.trim();
    } else {
      this.plansToRemoveGenerated = this.barriersToOpportunity.trim();
    }
    this.explanation.formEdited = false;

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
