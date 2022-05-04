
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
      value: "Yes", // EJY - when saving to SNOW, check what the value should be
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

}
</script>
