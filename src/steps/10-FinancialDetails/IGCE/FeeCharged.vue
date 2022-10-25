<!-- eslint-disable camelcase -->
<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Does your contracting office charge a fee for processing task orders?
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            Based on what you previously told us, your cost estimate will
            include a 1% external ordering agency fee. If there is an additional
            fee associated with using your contracting office, then we will
            include a percentage in your IGCE.
          </p>
        </div>
        <ATATRadioGroup
          id="isFeeChargedOptions"
          width="180"
          :value.sync="isCharged"
          :items="items"
          name="is-fee-charged"
          card="true"
          :rules="[$validators.required('Please select an option')]"
        >
        </ATATRadioGroup>
        <hr class="mt-7" v-if="isCharged==='YES'" />
        <ATATTextField
          v-if="isCharged==='YES'"
          ref = "PercentageTextbox"
          label="What percentage of the total price does your contracting office charge?"
          id="ContractPricePercentage"
          placeHolder="1-20"
          suffix="%"
          width="150"
          @blur="hasErrorMessages"
          :value.sync="percentage"
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
import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCEStore, { Fee } from "@/store/IGCE";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField
  },
})
export default class FeeCharged  extends Mixins(SaveOnLeave)  {
  $refs!: {
    PercentageTextbox: Vue & {
      errorMessages: () => [];
    };
  };


  private isCharged = "";
  private percentage = "";
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

  private get currentData(): Fee {
    return {
      percentage: this.percentage,
      isCharged: this.isCharged
    };
  }

   private savedData: Fee = {
     percentage: "",
     isCharged: ""
   };

   @Watch("isCharged")
   protected evalIsCharged(newVal: string): void {
     if (newVal === "NO"){
       this.percentage = "";
     }
   }

   private hasChanged(): boolean {
     return hasChanges(this.currentData, this.savedData);
   }
   
   public hasErrorMessages(): boolean {
     if (this.$refs.PercentageTextbox){
       return this.$refs.PercentageTextbox.errorMessages.length>0;
     }
     return false;
   }

   public async loadOnEnter(): Promise<void> {
     const storeData: Fee = await IGCEStore.getFeeSpecs();
     if (storeData) {
       this.savedData = storeData;
       this.percentage = storeData.percentage;
       this.isCharged = storeData.isCharged;
     }
   }

   protected async saveOnLeave(): Promise<boolean> {
     if (this.hasChanged()) {
       if (this.hasErrorMessages()){
         this.percentage = "";
       }
       IGCEStore.setFeeSpecs(this.currentData)    
     }
     return true;
   }

   public async mounted(): Promise<void> {
     await this.loadOnEnter();
   }

}
</script>

