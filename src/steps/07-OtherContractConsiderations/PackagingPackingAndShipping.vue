
<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you need to include packaging, packing, or shipping instructions?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              This is not common for most cloud computing acquisitions. However,
              you may have a situation, like an on-premises to cloud migration, 
              where you need to transfer data on hard drives to a CSP.            
            </p>
            <p id="SelectMessage">
              Select all that apply to your contracting effort.
            </p>
          </div>
          <ATATCheckboxGroup
            id="PackagingEtcCheckboxes"
            :value.sync="selectedOptions"
            :hasOtherValue="true"
            :otherValue="otherValue"
            :otherValueEntered.sync="otherValueEntered"
            :otherValueRequiredMessage="otherValueRequiredMessage"
            :noneValue="noneApplyValue"
            :items="checkboxItems"
            name="checkboxes"
            :card="false"
            class="copy-max-width"
            :rules="[
              $validators.required('Please select an option.')
            ]"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Mixins} from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { ContractConsiderationsDTO } from "@/api/models";
import { Checkbox } from "../../../types/Global";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})

export default class PackagingPackingAndShipping extends Mixins(SaveOnLeave) {
  private saved: ContractConsiderationsDTO = {};
  public selectedOptions: string[] = [];
  public otherValueEntered = "";
  public otherValueRequiredMessage 
    = "Please enter your packaging, packing and shipping instructions."

  public otherValue = "OTHER";
  public noneApplyValue = "NONE";
  private checkboxItems: Checkbox[] = [
    {
      id: "YesCheckbox",
      label: `When transferring physical media between locations, the 
        contractor shall provide a certified courier or other method of 
        maintaining a secure chain of custody over tapes and other media being 
        moved to and from a defined, secured off-site storage location. The 
        contractor shall provide flexibility in courier pick-up and delivery 
        time.`,
      value: "CONTRACTOR_PROVIDED", 
      description: "",
    },
    {
      id: "OtherCheckbox",
      label: "Other",
      value: this.otherValue,
      description: "",
    },
    {
      id: "NoneApply",
      label: "None of these apply to my acquisition.",
      value: this.noneApplyValue,
      description: "",
    },    
  ];


  public get current(): ContractConsiderationsDTO {
    return {
      contractor_required_training: this.selectedOption || "UNSELECTED",
    };
  }
  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadContractConsiderations();
    this.saved = {
      contractor_required_training: storeData.contractor_required_training || 'UNSELECTED',
    }
    if (storeData) {
      if(storeData.contractor_required_training == 'UNSELECTED') {
        this.selectedOption ='';
      }
      this.selectedOption = storeData.contractor_required_training === "UNSELECTED" ? ""
        : storeData.contractor_required_training || "UNSELECTED"
    }
  }

  public isChanged(): boolean {
    return hasChanges(this.saved, this.current);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.isChanged()) {
        await AcquisitionPackage.saveContractConsiderations(this.current);
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
