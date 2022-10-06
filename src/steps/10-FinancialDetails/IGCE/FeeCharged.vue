<!-- eslint-disable camelcase -->
<!-- eslint-disable camelcase -->
<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Does your contracting office charge a fee for processing task orders?
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-10">
            Based on what you previously told us, your cost estimate will
            include a 1% external ordering agency fee. If there is an additional
            fee associated with using your contracting office, then we will
            include a percentage in your IGCE.
          </p>
        </div>
        <ATATRadioGroup
          id="isFeeChargedOptions"
          :value.sync="feeCharged"
          :items="items"
          name="is-fee-charged"
          card="true"
          :rules="[$validators.required('Please select an option')]"
        >
        </ATATRadioGroup>
        <hr v-if="feeCharged==='YES'" />
        <ATATTextField
          v-if="feeCharged==='YES'"
          label="What percentage of the total price does your contracting office charge?"
          id="ContractPricePercentage"
          placeHolder="1-20"
          suffix="%"
          width="150"
          :value.sync="feePercentage"
          :rules="[
             $validators.required('Please enter your contracting office’s fee.'),
             $validators.isBetween(1, 20, 'The percentage must be less than or equal to 20%.'),
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"
import { RequirementsCostEstimateDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField
  },
})
export default class FeeCharged  extends Mixins(SaveOnLeave)  {
  private feeCharged = "";
  private feePercentage = "";
  private items = [
    {
      id: "YES",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "NO",
      label: "No.",
      value: "NO",
    },
  ];

  private get currentData(): RequirementsCostEstimateDTO {
    return {
      feePercentage: this.feeCharged==="YES" ? this.feePercentage : "",
      feeCharged: this.feeCharged
    };
  }

   private savedData: RequirementsCostEstimateDTO = {
     feePercentage: "",
     feeCharged: ""
   };


   private hasChanged(): boolean {
     return hasChanges(this.currentData, this.savedData);
   }
   
   public async loadOnEnter(): Promise<void> {
     //const storeData = await AcquisitionPackage.
     //loadData<RequirementsCostEstimateDTO>({storeProperty: 
     //StoreProperties.RequirementsCostEstimate});
     const storeData = 
    await AcquisitionPackage.getRequirementsCostEstimate();
     if (storeData) {
       this.savedData.feePercentage = storeData.feePercentage;
       this.savedData.feeCharged = storeData.feeCharged;
       this.feePercentage = storeData.feePercentage || "";
       this.feeCharged = storeData.feeCharged || ""
     }
   }

   protected async saveOnLeave(): Promise<boolean> {
     if (this.hasChanged()) {
       //await AcquisitionPackage
       //     .saveData<RequirementsCostEstimateDTO>({data: this.currentData, 
       //     storeProperty: StoreProperties.RequirementsCostEstimate});
       await AcquisitionPackage.setRequirementsCostEstimate(
         this.currentData
       );
        
     }
     return true;
   }
   public async mounted(): Promise<void> {
     await this.loadOnEnter();
   }


}
</script>

