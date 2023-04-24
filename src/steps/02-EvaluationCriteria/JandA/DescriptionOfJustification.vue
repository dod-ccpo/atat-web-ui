<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s work on your justification for this exception to fair opportunity
          </h1>
          <p v-if="selectedException === 'YES_FAR_16_505_B_2_I_B'">
            Briefly describe how this action requires use of the “unique or highly
            specialized capabilities” exception. Discuss the events, history, and
            circumstances that led to the current situation requiring use of procedures
            for other than fair opportunity competition. Your rationale should include
            a discussion of CSP name's unique qualifications for fulfilling the order
            requirements.
          </p>
          <p v-else-if="selectedException === 'YES_FAR_16_505_B_2_I_C'">
            Briefly describe how this action requires use of the “logical follow-on”
            exception. Discuss the events, history, and circumstances that led to the
            current situation requiring use of procedures for other than fair opportunity
            competition. Your rationale should describe why the relationship between the
            initial order issued under JWCC and the follow-on is logical (e.g., in terms
            of scope, period of performance, or value).
          </p>
          <div v-else-if="selectedException === 'YES_FAR_16_505_B_2_I_A'">
            <p>
              Briefly describe how this action requires use of the “unusual and compelling
              urgency” exception. Discuss the events, history, and circumstances that led
              to the current situation requiring use of procedures for other than fair
              opportunity competition. Your rationale should document the required delivery
              schedule and lead-times involved, including a chronological explanation of events
              that caused the exigent situation.
            </p>
            <ATATExpandableLink aria-id="ContactFAQ2">
              <template v-slot:header>
                What else should I include in my description of the justification?
              </template>
              <template v-slot:content>
                <p>
                  Be sure to explain any actual or apparent time lags between events.
                  At the very least, include:
                </p>
                <ul>
                  <li>
                    Discussion and dates of when requirement became known by the requesting agency
                  </li>
                  <li>
                    The required performance/delivery date
                  </li>
                  <li>
                    Events that happened before the Contracting Office was notified of the
                    requirement
                  </li>
                  <li>
                    When the Contracting Office was advised of the requirement
                  </li>
                  <li>
                    When the purchase request was received by the Contracting Office
                  </li>
                  <li>
                    When vendors will be/were contacted
                  </li>
                  <li>
                    When proposals are/were due
                  </li>
                  <li>
                    When award will be/was made
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>
          </div>

          <ATATTextArea
              id="descriptionOfJustification"
              class="max-width-740"
              :rows="7"
              :rules="
              [
                $validators.required(
                  'Enter a description of your justification for ' +
                   'this exception to fair opportunity.'
                ),
                $validators.maxLength(
                  1000,
                  'Please limit your description to 1000 characters or less'
                ),
              ]
              "
              :value.sync="justficationDescription"
              maxChars="1000"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import ATATTextArea from "@/components/ATATTextArea.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {FairOpportunityDTO} from "@/api/models";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import _ from "lodash";
import {hasChanges} from "@/helpers";

@Component({
  components: {
    ATATExpandableLink,
    ATATTextArea
  },
})

export default class DescriptionOfJustification extends Mixins(SaveOnLeave) {
  justficationDescription = "";
  selectedException = "";

  private get currentData(): FairOpportunityDTO {
    return {
      // eslint-disable-next-line camelcase
      justification: this.justficationDescription,
    } as FairOpportunityDTO;
  }
  private get savedData(): FairOpportunityDTO {
    return {
      // eslint-disable-next-line camelcase
      justification: AcquisitionPackage.fairOpportunity?.justification || "",
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.selectedException = storeData.exception_to_fair_opportunity;
      this.justficationDescription = storeData.justification as string;
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
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
