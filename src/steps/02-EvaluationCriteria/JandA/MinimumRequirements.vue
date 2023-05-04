<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="mb-3">
              Tell us about your minimum government requirements
            </h1>
            <p class="mb-10 copy-max-width">
              In the field below, explain what is being supported and provide any
              information regarding your verified minimum requirements. Discuss, if
              applicable, how the required delivery/performance date impacted the
              decision to restrict competition. You can fill in the blank to complete
              the suggested sentences or write your own explanation.
            </p>
            <ATATTextArea
                id="minGovReqExplanation"
                class="max-width-740"
                :rows="11"
                :value.sync="minGovReqExplanation"
                maxChars="1000"
                :turnRulesOff.sync="turnRulesOff"
                :rules="[
                  $validators.notSameAsDefault(
                    'Enter your minimum government requirements.', suggestedText,
                  ),
                  $validators.maxLength(
                    1000, 'Please limit your description to 1000 characters or less'
                  ),
                ]"
            />
            <v-btn
                id="RestoreMinGovReqExplanationButton"
                class="secondary font-size-14 px-4 mb-1 mt-1"
                :disabled="isMinGovReqExpDefaultUnmodified"
                @click="onRestoreMinGovReqExpClick"
            >
              <ATATSVGIcon
                  id="RestoreMinGovReqExplanationButtonIcon"
                  width="18"
                  height="18"
                  name="restore"
                  class="mr-1"
                  :color="btnRestoreIconColor"
              />
              Restore to suggestion
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <ATATDialog
        id="UpdateClassificationsModal"
        :showDialog="showRestoreModal"
        title="Restore to suggestion?"
        no-click-animation
        okText="Restore"
        width="470"
        @ok="okClicked"
        @cancelClicked="cancelClicked"
    >
      <template #content>
        <p class="body mb-5">
          Your description will be reverted to the default suggested language.
          Any changes that you made to this field will not be saved.
        </p>
      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";
import {FairOpportunityDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDialog from "@/components/ATATDialog.vue";

/**
 * This component handles all the functionality related to capturing the minimum
 * government requirements. Also handles loading and saving the data.
 */
@Component({
  components: {
    ATATTextArea,
    ATATSVGIcon,
    ATATDialog
  }
})

export default class MinimumRequirements extends Mixins(SaveOnLeave) {
  public suggestedText =
    "The cloud offerings must continue at their current level in order to support...\n\n" +
    "These offerings include..."
  public minGovReqExplanation = this.suggestedText;
  public showRestoreModal = false;
  public turnRulesOff = false;
  /**
   * Dynamically derives the restore button icon color based on the state.
   */
  public get btnRestoreIconColor(): string {
    return this.isMinGovReqExpDefaultUnmodified ? "disabled" : "primary";
  }

  /**
   * Restore button's state should be disabled if the user does not change the
   * default text or does a manual restore to default.
   */
  public get isMinGovReqExpDefaultUnmodified(): boolean {
    return this.suggestedText === this.minGovReqExplanation;
  }

  /**
   * Since the user can only click the button if the text changes from the default, this
   * function simply sets the state such that the modal gets opened.
   */
  public onRestoreMinGovReqExpClick(): void {
    this.showRestoreModal = true;
  }

  /**
   * Upon confirming the restore, the text gets reset to default and the state is
   * set such that the modal gets closed.
   */
  public okClicked(): void {
    this.turnRulesOff = true;
    this.minGovReqExplanation = this.suggestedText;
    this.showRestoreModal = false;
  }

  public cancelClicked(): void {
    this.showRestoreModal = false;
  }

  private get currentData(): FairOpportunityDTO {
    return {
      min_govt_requirements: this.minGovReqExplanation,
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      min_govt_requirements: AcquisitionPackage.fairOpportunity?.min_govt_requirements || "",
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      const minReq = storeData.min_govt_requirements as string;
      this.minGovReqExplanation = minReq && minReq.trim().length > 0
        ? minReq : this.suggestedText;
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    this.turnRulesOff = false;
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
