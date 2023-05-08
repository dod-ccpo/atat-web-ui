<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="mb-3">
              Why is {{ csp }}
              the only source capable of meeting your requirements?
            </h1>
            <p>
              In the field below, discuss {{ csp }}’s unique capabilities, experience, or
              expertise that make it the only CSP capable of performing the required work.
              We’ve suggested language to help you get started, but you can edit the
              description based on your unique requirements.
            </p>
            <ATATExpandableLink
                aria-id="UniqueSourceMoreInfo"
            >
              <template v-slot:header>
                Instructions for this portion of the J&A
              </template>
              <template v-slot:content>
                <p class="mb-3">
                  Your explanation should clearly show that {{cspAdditionalInstructions}} is
                  the ONLY source capable of performing the required work. Do not indicate
                  that your source is the "only known source” unless you fully describe the
                  process undertaken to make that determination (including items such
                  as "sources sought" synopsis posted on the Federal Business Opportunities
                  website.)
                </p>
                <span v-if="showLogicalFollowOnInstructions">
                  <p class="mb-3">
                    Because you cited “logical follow-on” as the exception, your explanation
                    should quantify substantial duplication of cost and unacceptable delay.
                    Be sure to include the following:
                  </p>
                  <ol class="_atat-ul">
                  <li>
                    Provide an estimate of the cost to the Government that
                    would be duplicative and explain how the estimate was derived.
                  </li>
                  <li>
                    Supply rationale for unacceptable delays.
                  </li>
                  <li>
                    Discuss why the requirement continues and why it would be of
                    benefit to the Government for {{ csp }} to continue work.
                  </li>
                  <li>
                    Specify how recent the previous competitive order was issued
                    and the number of times this exception has been used.
                  </li>
                  <li>
                    Discuss why the other Indefininte Delivery, Indefinite Quantity
                    (IDIQ) holders could not meet the stated requirement.
                  </li>
                </ol>
              </span>
              </template>
            </ATATExpandableLink>
            <ATATTextArea
                id="descriptionOfJustification"
                class="max-width-740"
                :rows="11"
                :value.sync="uniqueSourceExplanation"
                maxChars="2500"
                :turnRulesOff.sync="turnRulesOff"
                :rules="[
                $validators.required( //notSameAsDefault is not a requirement for this screen
                  'Explain why ' + csp + ' is the only CSP capable of ' +
                   'performing the required work.', suggestedText
                ),
                $validators.maxLength(
                  2500,
                  'Please limit your description to 2500 characters or less'
                ),
              ]
              "
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
                  :color="restoreIconColor"
              />
              Restore to suggestion
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <ATATDialog
        id="UniqueSourceModal"
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
          Your description will be reverted to the default suggested language based
          on your responses to the previous questionnaire. Any changes that you made
          to this field will not be saved.
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
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATExpandableLink,
    ATATTextArea,
    ATATSVGIcon,
    ATATDialog
  }
})

export default class UniqueSource extends Mixins(SaveOnLeave) {
  private csp = "";
  private cspAdditionalInstructions = "";
  private showLogicalFollowOnInstructions = false;

  public suggestedText = "";
  public uniqueSourceExplanation = this.suggestedText;
  public showRestoreModal = false;
  public turnRulesOff = false;

  /**
   * Dynamically derives the restore button icon color based on the state.
   */
  public get restoreIconColor(): string {
    return this.isMinGovReqExpDefaultUnmodified ? "disabled" : "primary";
  }

  /**
   * Restore button's state should be disabled if the user does not change the
   * default text or does a manual restore to default.
   */
  private get isMinGovReqExpDefaultUnmodified(): boolean {
    return this.suggestedText === this.uniqueSourceExplanation;
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
    this.uniqueSourceExplanation = this.suggestedText;
    this.showRestoreModal = false;
  }

  /**
   * Sets the default text if the user did not already update and save the default
   * explanation.
   */
  public setSuggestedText(): void {
    this.suggestedText = this.csp + " possesses the knowledge, skills, capabilities, " +
        "certification, clearance, and experience required to continue the program " +
        "without a break or degradation in critical mission services. Given these " +
        "critical mission requirements, " + this.csp + " is the only contractor that is " +
        "capable of performing the necessary services for the DoD within the current " +
        "required timeline.";
  }

  public cancelClicked(): void {
    this.showRestoreModal = false;
  }

  private get currentData(): FairOpportunityDTO {
    return {
      why_csp_is_only_capable_source: this.uniqueSourceExplanation
    };
  }

  private get savedData(): FairOpportunityDTO {
    return {
      why_csp_is_only_capable_source: AcquisitionPackage
        .fairOpportunity?.why_csp_is_only_capable_source || ""
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  /**
   * Gets the fair opportunity store data. Uses the proposed cloud service provider and
   * sets the suggested text and default suggested text for unique source explanation. Sets
   * few other component variables based on the fair opportunity data.
   */
  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.fairOpportunity;
    if (storeData) {
      this.csp = storeData.proposed_csp ? storeData.proposed_csp : "this CSP";
      this.setSuggestedText();
      this.uniqueSourceExplanation = storeData.why_csp_is_only_capable_source ?
        storeData.why_csp_is_only_capable_source : this.suggestedText;
      this.cspAdditionalInstructions = storeData.proposed_csp ? storeData.proposed_csp :
        "the chosen source";
      this.showLogicalFollowOnInstructions =
          (storeData.exception_to_fair_opportunity === "YES_FAR_16_505_B_2_I_C");
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
