<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Now let’s find out more about your procurement
          </h1>
          <ATATTextArea
            id="procurementText"
            ref="procurementTextRef"
            class="max-width-740"
            label="Discuss the constraints of your procurement"
            :helpText="procurementParagraphText"
            :rows="11"
            :value="procurementText"
            @update:value="procurementText = $event"
            maxChars="2500"
            :rules="[
                  $validators.required(
                    'Enter the constraints of your procurement.'
                  ),
                  $validators.maxLength(
                    2500, 'Please limit your description to 2500 characters or less'
                  ),
                ]"
          />
          <hr />
          <ATATRadioGroup
            class="mb-10"
            id="ExistingEnv"
            ref="ExistingEnvRef"
            :legend="'Is there an existing environment that would enable ' + cspName +
             ' to immediately support a task order award?'"
            :value="existingEnv"
            @update:value="existingEnv = $event"
            :items="existingEnvOptions"
            :rules="[$validators.required('Please select an option.')]"
          />
          <div v-if="existingEnv === 'YES'">
            <ATATTextArea
              id="procurementImpact"
              ref="procurementImpactRef"
              class="max-width-740"
              label="How does your previous procurement impact this contracting effort?"
              helpText="Review the suggested language and edit any details based on your unique
               requirements."
              :rows="11"
              :value="procurementImpact"
              @update:value="procurementImpact = $event"
              maxChars="1000"
              :rules="[
                  $validators.required(
                    'Describe how your previous procurement impacts this effort. '
                  ),
                  $validators.maxLength(
                    1000, 'Please limit your description to 1000 characters or less'
                  ),
                ]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import _ from "lodash";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "../../../../types/Global";
import { FairOpportunityDTO } from "@/api/models";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from 'types/Global'

@Component({
  components:{
    ATATTextArea,
    ATATRadioGroup
  }
})

class ProcurementDiscussion extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public procurementParagraphText = "Identify any schedule requirements, unique" +
    " features and mandatory requirements, or the existence of" +
    " proprietary data, copyrighted information or a patent which" +
    " restrict competition. "
  public procurementText = "";
  public suggestedImpactText = ""
  public procurementImpact = "";
  public cspName = ""
  public existingEnv = ""
  public existingEnvOptions: RadioButton[] = getYesNoRadioOptions("existingEnvOptions")

  private get currentData(): FairOpportunityDTO {
    return {
      /* eslint-disable camelcase */
      procurement_discussion: this.procurementText,
      procurement_has_existing_env: this.existingEnv,
      procurement_previous_impact: this.procurementImpact
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      procurement_discussion: AcquisitionPackage.fairOpportunity?.procurement_discussion || "",
      procurement_has_existing_env: AcquisitionPackage.fairOpportunity?.
        procurement_has_existing_env || "",
      procurement_previous_impact: AcquisitionPackage.fairOpportunity?.
        procurement_previous_impact || "",
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      const farSelected = storeData.exception_to_fair_opportunity
      if(farSelected === "YES_FAR_16_505_B_2_I_A"){
        this.procurementParagraphText += "Since you cited the “unusual and compelling" +
          " urgency” authority, include a justification for the minimum" +
          " quantity or period of performance. These milestones should be" +
          " as realistic, firm, and proactive as possible."
      }
      this.suggestedImpactText = "Since there is already an existing" +
        " environment, the CSP is immediately able to shift to" +
        " supporting the resultant award associated with this contract action, it" +
        " would minimize any associated transition costs for the Government. In addition," +
        " another contractor would not be positioned to leverage investments made" +
        " to date to most efficiently meet the objectives of the task order for " +
        "the anticipated PoP."
      this.procurementText = storeData.procurement_discussion || ""
      this.procurementImpact = storeData.procurement_previous_impact || this.suggestedImpactText
      this.existingEnv = storeData.procurement_has_existing_env || ""
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if(this.currentData.procurement_has_existing_env === "NO"){
      this.currentData.procurement_previous_impact = ""
    }
    this.procurementText = this.procurementText.trim();
    this.procurementImpact = this.procurementImpact.trim();
    
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

export default toNative(ProcurementDiscussion )
</script>
