<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Do you want to include any other facts to support the use of the 
            “logical follow-on” exception?
          </h1>
          <ATATRadioGroup
            id="ProductFeature"
            name="ProductFeature"
            card="true"
            width="180"
            :value.sync="selectedException"
            :items="exceptionChoices"
            :rules="[$validators.required('Please select an option.')]"
          />
          <div v-if="selectedException === 'YES'">
            <hr />
            <ATATTextArea
              class="textarea-max-width"
              id="ExceptionTextArea"
              label="Briefly discuss any other
              facts or details supporting the use of this exception"
              :value.sync="exceptionDiscussion"
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
import { Component, Mixins } from "vue-property-decorator";
import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import _ from "lodash";
import { RadioButton } from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class OtherSupportingFactors extends Mixins(SaveOnLeave) {
  /* eslint-disable camelcase */
  public exceptionDiscussion =""
  public exceptionChoices :RadioButton[] = getYesNoRadioOptions("Exception")
  public selectedException = ""


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
