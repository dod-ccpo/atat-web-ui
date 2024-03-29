<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="mb-3">
              Tell us about the impact of this requirement
            </h1>
            <p class="copy-max-width mb-10">
              In the field below, describe the detrimental effects to the mission
              of the requesting activity or to the Government, if other than an
              exception to fair opportunity were pursued.
            </p>
            <ATATTextArea
                id="descriptionOfImpact"
                ref="descriptionOfImpactRef"
                class="max-width-740"
                :rows="11"
                :value="impactOfRequirementExplanation"
                @update:value="impactOfRequirementExplanation = $event"
                maxChars="2500"
                :rules="[
                $validators.required(
                  'Describe the impact of your requirement.'
                ),
                $validators.maxLength(
                  2500,
                  'Limit your description to 2,500 characters or less.'
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
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import {FairOpportunityDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from 'types/Global'
import ATATTextArea from "@/components/ATATTextArea.vue";
 

@Component({
  components: {
    ATATTextArea
  }
})

class ImpactOfRequirement extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

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
    this.impactOfRequirementExplanation = this.impactOfRequirementExplanation.trim();
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
 
export default toNative(ImpactOfRequirement)
</script>
