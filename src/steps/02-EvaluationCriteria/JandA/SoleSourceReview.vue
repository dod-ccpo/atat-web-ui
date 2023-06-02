<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pageHeaderIntro }} the cause of your sole source situation
          </h1>
          <div class="copy-max-width">
            <p class="mb-4" v-if="!isCustomOnLoad">
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

            <v-expand-transition>
              <ATATAlert
                id="ReviewQuestionnaireResponses"
                type="warning"
                v-if="showAlert"
                maxWidth="750"
                class="mt-9 mb-2"
              >
                <template v-slot:content>
                  <p>
                    To view suggested language based on your updated responses to the previous 
                    questionnaire, click “Restore default suggestion” below.
                  </p>
                </template>
              </ATATAlert>
            </v-expand-transition>


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
              @blur="checkIfSuggestionChanged"
              :rules="[
                this.$validators.required(`Enter an explanation for the cause of 
                  your sole source situation.`),
                this.$validators.maxLength(2500)
              ]"
            />

            <div class="d-flex justify-start">
              <v-btn
                id="ChangeToCustomExplanationButton"
                v-if="showChangeToCustomButton"
                class="secondary font-size-14 px-4 mb-1 mt-1"
                :disabled="isCustom"
                @click="changeToCustomExplanation"
              >
                <ATATSVGIcon
                  id="ChangeToCustomExplanationIcon"
                  width="19"
                  height="15"
                  name="SwapVertical"
                  class="mr-1"
                  color="primary"
                />
                Change to custom explanation
              </v-btn>

              <v-btn
                id="ChangeToDAPPSSuggestionButton"
                v-if="showChangeToDAPPSButton"
                class="secondary font-size-14 px-4 mb-1 mt-1"
                @click="changeToDAPPSExplanation"
              >
                <ATATSVGIcon
                  id="ChangeToDAPPSExplanationIcon"
                  width="19"
                  height="15"
                  name="SwapVertical"
                  class="mr-1"
                  color="primary"
                />
                Change to DAPPS explanation
              </v-btn>

              <v-btn
                id="RestoreSuggestionButton"
                v-if="showRestoreSuggestionButton"
                class="secondary font-size-14 px-4 mb-1 mt-1"
                :class="{'ml-5' : restoreButtonNeedsMargin}"
                :disabled="isSoleSourceCauseDefault"
                @click="confirmRestoreDefaultText"
              >
                <ATATSVGIcon
                  id="RestoreSuggestionButtonIcon"
                  width="19"
                  height="15"
                  name="restore"
                  class="mr-1"
                  :color="getIconColor(isSoleSourceCauseDefault)"
                />
                Restore default suggestion
              </v-btn>
            </div>
           
            <ATATExpandableLink v-if="displayHelpSoleSourceLink" aria-id="HelpSoleSource"
              class="mt-5">
              <template v-slot:header>
                I need help generating a response for this portion of the J&A. What do I do?
              </template>
              <template v-slot:content>
                <p class="copy-max-width">
                  Although you previously wrote a custom explanation, DAPPS can provide suggested
                  language for the cause of your sole source situation, based on your responses
                  to a short questionnaire. You’ll be able to edit to our suggestion to meet your
                  requirements, or choose to restore your custom explanation.
                </p>
                <a
                  id="SoleSourceQuestionnaire"
                  @click="goToQuestionnaire"
                  @keydown.enter="goToQuestionnaire"
                  @keydown.space="goToQuestionnaire"
                >
                  <v-btn
                    id="FillOutQuestionnaireButton"
                    class="secondary font-size-14 px-3 mb-1 mt-1"
                  >
                    <ATATSVGIcon
                      id="FillOutQuestionnaireButtonIcon"
                      width="19"
                      height="15"
                      name="dynamicForm"
                      class="mr-1"
                      color="primary"
                    />
                    Fill out the questionnaire
                  </v-btn>
                </a>
              </template>
            </ATATExpandableLink>
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
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ConfirmRestoreDefaultTextModal from "../components/ConfirmRestoreDefaultTextModal.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { currencyStringToNumber, hasChanges, toCurrencyString } from "@/helpers";
import { FairOpportunityDTO } from "@/api/models";
import {routeNames} from "@/router/stepper";
import FairOppExceptions from "../components/FairOppExceptions.vue";
import Steps from "@/store/steps";

@Component({
  components: {
    ATATSVGIcon,
    ATATExpandableLink,
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
    ATATAlert
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

  public isCustom = false;
  public isCustomOnLoad = false;
  public allSectionsNO = false;
  public routeNames = routeNames;
  public get pageHeaderIntro(): string {
    return this.isCustomOnLoad ? "Tell us about" : "Let’s review";
  }
  public showAlert = false;
  public hasFormBeenEdited = false;
  public hasSuggestedTextBeenEdited = false;

  public get showChangeToCustomButton(): boolean {
    return !this.isCustom && this.soleSourceCauseCustom.length > 0;
  }
  public get showChangeToDAPPSButton(): boolean {
    return this.isCustom && this.soleSourceCauseGenerated.length > 0;
  }

  public get showRestoreSuggestionButton(): boolean {
    return this.soleSourceCauseGenerated !== undefined && this.soleSourceCauseGenerated.length > 0;
  }

  public restoreButtonNeedsMargin(): boolean {
    return this.showChangeToCustomButton || this.showChangeToDAPPSButton;
  }

  public get displayHelpSoleSourceLink(): boolean {
    return AcquisitionPackage.hasExplanationOnLoad.soleSourceCause;
  }

  public get getRowCount(): number {
    return this.isCustom ? 12 : 19;
  }

  public isSoleSourceCauseDefault = false;
  @Watch("soleSourceCause")
  public soleSourceCauseChanged(): void {
    this.isSoleSourceCauseDefault = this.soleSourceCause === this.defaultSuggestion;
  }

  public checkIfSuggestionChanged(): void { 
    debugger;
    // EJY come back here and use getter, change var name to not be soleSource specific
    // make sure to check if isCustom ?
    const isEdited = this.isSoleSourceCauseDefault && !this.isCustom;
    AcquisitionPackage.setHasSoleSourceSuggestedTextBeenEdited(isEdited);
  }

  public async restoreSuggestion(): Promise<void> {
    this.soleSourceCause = this.defaultSuggestion;
    this.soleSourceCauseGenerated = this.defaultSuggestion;
    this.hasFormBeenEdited = false;
    await AcquisitionPackage.setHasSoleSourceCauseFormBeenEdited(false);
    debugger;
    await AcquisitionPackage.setHasSoleSourceSuggestedTextBeenEdited(false);
    this.showRestoreModal = false;
    this.isCustom = false;
    this.showAlert = false;
  }

  public confirmRestoreDefaultText(): void {
    this.showRestoreModal = true;
  }

  public async changeToDAPPSExplanation(): Promise<void> {
    this.soleSourceCauseCustom = this.soleSourceCause;
    this.soleSourceCause = this.soleSourceCauseGenerated;
    this.isCustom = false;
    await AcquisitionPackage.setIsSoleSourceTextCustom(false);
  }

  public async changeToCustomExplanation(): Promise<void> {
    this.soleSourceCauseGenerated = this.soleSourceCause;
    this.soleSourceCause = this.soleSourceCauseCustom || "";
    this.isCustom = true;
    await AcquisitionPackage.setIsSoleSourceTextCustom(true);
  }

  private getIconColor(condition: boolean):string {
    return condition ? 'disabled': 'primary';
  }

  public async goToQuestionnaire(): Promise<void> {
    AcquisitionPackage.doSetFairOppBackToReview(true);

    // hide "I want to write my own explanation" button if either generated or custom
    // explanation exists on initialization
    await Steps.setAdditionalButtonHide(true);

    this.$router.push({
      name: routeNames.SoleSourceCause,
      params: {
        direction: "next"
      }   
    });
  }

  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      /* eslint-disable camelcase */
      cause_of_sole_source_generated: this.soleSourceCauseGenerated as string,
      cause_of_sole_source_custom: this.soleSourceCauseCustom as string,
      cause_of_sole_source_for_docgen: this.isCustom ? "CUSTOM" : "GENERATED"
      /* eslint-enable camelcase */      
    }
    return Object.assign(fairOppSaved, formData);
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  public async loadOnEnter(): Promise<void> {
    AcquisitionPackage.doSetFairOppBackToReview(false);

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {

      this.allSectionsNO = storeData.cause_migration_addl_time_cost === "NO"
        && storeData.cause_govt_engineers_training_certified === "NO"
        && storeData.cause_product_feature_peculiar_to_csp === "NO";

      this.soleSourceCauseCustom = storeData.cause_of_sole_source_custom as string;
      this.soleSourceCauseGenerated = storeData.cause_of_sole_source_generated as string;

      this.isCustom = AcquisitionPackage.isSoleSourceTextCustom;
      this.isCustomOnLoad = AcquisitionPackage.isSoleSourceTextCustom;
      
      this.hasSuggestedTextBeenEdited = 
        AcquisitionPackage.hasSoleSourceSuggestedTextBeenEdited;
      this.hasFormBeenEdited = AcquisitionPackage.hasSoleSourceCauseFormBeenEdited;
      this.showAlert = this.hasSuggestedTextBeenEdited && this.hasFormBeenEdited;

      await AcquisitionPackage.generateFairOpportunitySuggestion("SoleSource");
      this.defaultSuggestion = AcquisitionPackage.fairOppDefaultSuggestions.soleSourceCause;

      debugger;
      
      if (!this.isCustom) {
        if (!this.hasSuggestedTextBeenEdited) {
          // if suggested text hasn't been edited, automatically set to the suggestion
          this.soleSourceCause = this.defaultSuggestion;
        } else {
          // since user edited the default suggestion, user is shown alert and must click
          // the "Restore default suggestion" to view the new suggested text
          this.soleSourceCause = storeData.cause_of_sole_source_generated as string;
        }
      } else {
        this.soleSourceCause = storeData.cause_of_sole_source_custom as string;
      }

    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private setAcquisitionPackageSoleSourceVariables(){
    debugger;
    AcquisitionPackage.setHasSoleSourceSuggestedTextBeenEdited(!this.isSoleSourceCauseDefault);
    AcquisitionPackage.setIsSoleSourceTextCustom(this.isCustom);
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.isCustom) {
      this.soleSourceCauseCustom = this.soleSourceCause;
    } else {
      this.soleSourceCauseGenerated = this.soleSourceCause;
    }
    
    this.setAcquisitionPackageSoleSourceVariables();
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
