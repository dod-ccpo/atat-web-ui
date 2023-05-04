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
          <hr />
          <ATATTextArea
            id="ExceptionTextArea"
            label="Briefly discuss any other facts or details supporting the use of this exception"
            :value.sync="exceptionDiscussion"
            :maxChars="1000"
            :rows="6"
            :validateItOnBlur="true"
            :rules="[
                $validators.required('Enter a description for your other supporting factors.'),
                $validators.maxLength(1000)
            ]"
          />

        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import _ from "lodash";
import { RadioButton } from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class OtherSupportingFactors extends Vue {
  public exceptionDiscussion =""
  public exceptionChoices :RadioButton[] = getYesNoRadioOptions("Exception")
  public selectedException = ""


  // private get currentData(): FairOpportunityDTO {
  //   return {
  //     min_govt_requirements: this.minGovReqExplanation,
  //   } as FairOpportunityDTO;
  // }
  //
  // private get savedData(): FairOpportunityDTO {
  //   return {
  //     min_govt_requirements: AcquisitionPackage.fairOpportunity?.min_govt_requirements || "",
  //   } as FairOpportunityDTO;
  // }
  //
  // private hasChanged(): boolean {
  //   return hasChanges(this.currentData, this.savedData);
  // }
  //
  // public async loadOnEnter(): Promise<void> {
  //   const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
  //   if (storeData) {
  //     const minReq = storeData.min_govt_requirements as string;
  //     this.minGovReqExplanation = minReq && minReq.trim().length > 0
  //       ? minReq : this.suggestedText;
  //   }
  // }
  //
  // protected async saveOnLeave(): Promise<boolean> {
  //   this.turnRulesOff = false;
  //   try {
  //     if (this.hasChanged()) {
  //       await AcquisitionPackage.setFairOpportunity(this.currentData)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return true;
  // }

  public async mounted(): Promise<void> {
    // await this.loadOnEnter();
  }
}
</script>
