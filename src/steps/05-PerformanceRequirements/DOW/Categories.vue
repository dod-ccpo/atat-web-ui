<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            What type of {{ requirementName }} do you need?
          </h1>
          <div class="copy-max-width">
            <p id="CheckboxGroupLabel">
              Select all that apply to your contracting effort.
            </p>

            <ATATCheckboxGroup
              id="CheckboxGroup"
              aria-describedby="CheckboxGroupLabel"
              :value.sync="selectedOptions"
              :items="checkboxItems"
              :card="false"
              class="copy-max-width"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered.sync="otherValueEntered"
              :otherValueRequiredMessage="otherValueRequiredMessage"
              :rules="[
                $validators.required(requiredMessage)
              ]"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "../../../../types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})

export default class PerformanceRequirements extends Vue {
  // requirementName will be pulled from data in future ticket
  public requirementName = "Developer Tools and Services";

  public requiredMessage = `Please select at least one type of offering. If you 
    no longer need ${this.requirementName}, select the “I don’t need 
    these cloud resources” button below.`;

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "OTHER";
  public otherValueEntered = "";
  public otherSelected = "";

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
  }

  public selectedOptions: string[] = [];

  // checkboxItems will be pulled from data in future ticket
  private checkboxItems: Checkbox[] = [
    {
      id: "DevSecOPS", // may need to create ids (for Cypress) on the fly
      label: "DevSecOPS",
      value: "DevSecOPS", 
    },
    {
      id: "DeveloperToolsAndServices",
      label: "Data Management",
      value: "DeveloperToolsAndServices", 
    },
    {
      id: "Applications",
      label: "Migration Tools",
      value: "Applications", 
    },
    {
      id: "MachineLearning",
      label: "Transformation Tools",
      value: "MachineLearning", 
    },
    {
      id: "Networking",
      label: "Cloud Development Tools",
      value: "Networking", 
    },
    {
      id: "Security",
      label: "Cloud Audit/Monitoring Tools",
      value: "Security", 
      description: "Requires a waiver from DISA CIO",
    },
    {
      id: "DatabaseWithStorage",
      label: "Cyber Tools",
      value: "DatabaseWithStorage", 
      description: "Requires a waiver from DISA CIO",
    },
    // "Other" will be an option for all requirements and may not come from the store?
    // -- to be addressed in future ticket
    {
      id: "Other",
      label: "Other",
      value: this.otherValue, 
    }    
  ];
  
}

</script>
