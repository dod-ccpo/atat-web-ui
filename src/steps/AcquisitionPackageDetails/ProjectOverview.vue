<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s start with basic info about your {{ projectTitle }}
          </h1>
          <p class="page-intro">
            In this section, we will gather some overarching details about your
            project requirements, organization, and points of contact. This
            information will be used to complete your required acquisition forms
            and will also help us to guide you through the JWCC procurement
            process.
          </p>
          <div class="mt-10">
            <ATATTextField
              id="ProjectTitle"
              label="Project/Requirement Title"
              class="input-max-width"
              tooltipText="Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms."
              :value.sync="currentTitle"
              @blur="onTitleChanged"
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 textarea-max-width">
            <ATATTextArea
              id="ProjectScope"
              label="What is the scope of your requirement?"
              class="width-100"
              :rows="7"
              helpText="Briefly describe the type of resources and services to be
              acquired, and what is necessary to achieve mission specific
              outcomes for this particular requirement (e.g., move DITCO’s contract
              writing system to a cloud environment)."
            />
          </div>
          <div class="d-flex align-start flex-column mt-10">
            <ATATRadioGroup
              id="emergency-declaration-support-requirement"
              legend="Is this requirement in support of an emergency declaration?"
              :value.sync="radioValue"
              :items="radioGroupItems"
              name="emergency-declaration-support-requirement-radio-group"
              class="mt-3"
            >
            </ATATRadioGroup>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ATATTextField from "../../components/ATATTextField.vue";
import ATATTextArea from "../../components/ATATTextArea.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue";

import Vue from "vue";

import { Component } from "vue-property-decorator";
import { RadioButton } from "types/Global";

import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATTextField,
    ATATTextArea,
    ATATRadioGroup,
  },
})
export default class ProjectOverview extends Vue {
  private radioValue = "";
  private radioGroupItems: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "yes",
    },
    {
      id: "No",
      label: "No",
      value: "no",
    },
  ];

  private currentTitle = "";

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "new acquisition";
  }

  public set projectTitle(value: string) {
    AcquisitionPackage.setProjectTitle(value);
  }

  public onTitleChanged():void {

    if(this.currentTitle === "" || this.currentTitle == this.projectTitle){
        return;
    }

    this.projectTitle = this.currentTitle;
      
  }
}
</script>
