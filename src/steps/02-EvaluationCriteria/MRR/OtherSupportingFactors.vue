<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Do you want to include any other facts to support the use of the 
            “{{ fairOpportunitySelection }}” exception?
          </h1>
          <ATATRadioGroup
            id="ProductFeature"
            ref="ProductFeatureRef"
            name="ProductFeature"
            card="true"
            width="180"
            :value="selectedException"
            @update:value="selectedException = $event"
            :items="exceptionChoices"
            :rules="[$validators.required('Please select an option.')]"
          />
          <div v-if="selectedException === 'YES'">
            <hr />
            <ATATTextArea
              class="textarea-max-width"
              id="ExceptionTextArea"
              ref="ExceptionTextAreaRef"
              label="Briefly discuss any other
              facts or details supporting the use of this exception"
              :value="exceptionDiscussion"
              @update:value="exceptionDiscussion = $event"
              :maxChars="1000"
              :rows="6"
              :validateItOnBlur="true"
              :rules="[
                $validators.required('Enter a description for your other supporting factors.'),
                $validators.maxLength(1000)
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
import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import _ from "lodash";
import { RadioButton, SaveOnLeaveRefs } from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
  }
})

class OtherSupportingFactors extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  /* eslint-disable camelcase */
  public exceptionDiscussion =""
  public exceptionChoices :RadioButton[] = getYesNoRadioOptions("Exception")
  public selectedException = ""

  private get fairOpportunitySelection(): string {
    const fairOpp = AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
    let headline = "";
    switch (fairOpp){
    case "YES_FAR_16_505_B_2_I_A":
      headline = "unusual and compelling urgency"
      break;
    case "YES_FAR_16_505_B_2_I_B":
      headline = "unique or highly specialized capabilities"
      break;
    case "YES_FAR_16_505_B_2_I_C":
      headline = "logical follow-on";
      break;
    default:
      break;
      
    }
    return headline;
  }

  private get currentData(): FairOpportunityDTO {
    return {
      other_facts_to_support_logical_follow_on: this.selectedException,
      other_facts_to_support_logical_follow_on_details: this.exceptionDiscussion,
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      other_facts_to_support_logical_follow_on: AcquisitionPackage.fairOpportunity?.
        other_facts_to_support_logical_follow_on || "",
      other_facts_to_support_logical_follow_on_details: AcquisitionPackage.fairOpportunity?.
        other_facts_to_support_logical_follow_on_details || "",
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.selectedException = storeData.other_facts_to_support_logical_follow_on||""
      this.exceptionDiscussion = storeData.other_facts_to_support_logical_follow_on_details||""
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if(this.currentData.other_facts_to_support_logical_follow_on === 'NO'){
      this.currentData.other_facts_to_support_logical_follow_on_details = ""
    }
    this.exceptionDiscussion = this.exceptionDiscussion.trim();
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

export default toNative(OtherSupportingFactors)
</script>
