<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="mb-3">
              Tell us about the impact of this requirement
            </h1>
            <p>
              In the field below, describe the detrimental effects to the mission
              of the requesting activity or to the Government, if other than an
              exception to fair opportunity were pursued.
            </p>
            <ATATTextArea
                id="impactOfRequirementExplanation"
                class="max-width-740"
                :rows="11"
                :value.sync="impactOfRequirementExplanation"
                maxChars="2500"
                :rules="[
                $validators.required(
                  'Describe the impact of your requirement.'
                ),
                $validators.maxLength(
                  2500,
                  'Please limit your description to 2500 characters or less'
                ),
              ]
              "
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {FairOpportunityDTO} from "@/api/models";
import {hasChanges} from "@/helpers";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea
  }
})

export default class ImpactOfRequirement extends Mixins(SaveOnLeave)  {
  public impactOfRequirementExplanation = "";

  private get currentData(): FairOpportunityDTO {
    return {
      requirement_impact: this.impactOfRequirementExplanation
    };
  }

  private get savedData(): FairOpportunityDTO {
    return {
      requirement_impact: AcquisitionPackage
        .fairOpportunity?.requirement_impact || ""
    };
  }
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
  /**
   * Gets the fair opportunity store data and sets the data required for this component
   */
  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.fairOpportunity;
    if (storeData) {
      this.impactOfRequirementExplanation = storeData.requirement_impact as string;
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
