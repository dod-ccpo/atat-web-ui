
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
            :value.sync="selectedPackagingEtcOptions"
            :hasOtherValue="true"
            :otherValue.sync="otherValue"
            :otherValueRequiredMessage="otherValueRequiredMessage"
            :noneValue="noneApplyValue"
            :items="checkboxItems"
            name="checkboxes"
            :card="false"
            class="copy-max-width"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "../../../types/Global";


@Component({
  components: {
    ATATCheckboxGroup,
  }
})

export default class PackagingPackingAndShipping extends Vue {
  @Watch("selectedPackagingEtcOptions")
  protected selectedPackagingEtcChanged(newVal: string[]): void {
    // EJY is any of this necessary?
    if (newVal.indexOf(this.noneApplyValue) > -1) {
      const noneApplyIndex = this.prevSelectedPackagingEtcOptions.indexOf(this.noneApplyValue);
      if (newVal.length > 1 && noneApplyIndex === -1) {
        // uncheck the other options
        this.selectedPackagingEtcOptions = [this.noneApplyValue];
        this.otherValue = "";
      } else if (newVal.length > 1) {
        // remove "None Apply"
        this.selectedPackagingEtcOptions.splice(noneApplyIndex, 1);
      }
    }
    this.prevSelectedPackagingEtcOptions = this.selectedPackagingEtcOptions;
  }

  public selectedPackagingEtcOptions: string[] = [];
  public prevSelectedPackagingEtcOptions: string[] = [];

  public otherValue = "";
  public otherValueRequiredMessage 
    = "Please enter your packaging, packing and shipping instructions."

  public noneApplyValue = "None Apply";
  private checkboxItems: Checkbox[] = [
    {
      id: "YesCheckbox",
      label: `When transferring physical media between locations, the 
        contractor shall provide a certified courier or other method of 
        maintaining a secure chain of custody over tapes and other media being 
        moved to and from a defined, secured off-site storage location. The 
        contractor shall provide flexibility in courier pick-up and delivery 
        time.`,
      value: "Yes", // EJY - what should this value be? the entire string?
      description: "",
    },
    {
      id: "OtherCheckbox",
      label: "Other",
      value: "Other",
      description: "",
    },
    {
      id: "NoneApply",
      label: "None of these apply to my acquisition.",
      value: this.noneApplyValue,
      description: "",
    },    
  ];

}
</script>
