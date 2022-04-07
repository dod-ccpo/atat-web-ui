<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s start with basic info about your new acquisition
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
              :rules="[
                $validators.required('Please enter your project title'),
                $validators.maxLength(60, 'Title cannot exceed 60 characters'),
              ]"
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
              :rules="[
                $validators.required(
                  'Please describe the scope of your requirement'
                ),
                $validators.maxLength(
                  300,
                  'Please limit your description to 300 characters or less'
                ),
              ]"
              helpText="Briefly describe the type of resources and services to be
              acquired, and what is necessary to achieve mission specific
              outcomes for this particular requirement (e.g., move DITCO’s contract
              writing system to a cloud environment)."
              :value.sync="projectScope"
            />
          </div>
          <div class="d-flex align-start flex-column mt-10">
            <ATATRadioGroup
              id="emergency-declaration-support-requirement"
              legend="Is this requirement in support of an emergency declaration?"
              :value.sync="emergencyDeclaration"
              :items="radioGroupItems"
              name="emergency-declaration-support-requirement-radio-group"
              class="mt-3"
              :rules="[$validators.required('Please select an option')]"
            >
            </ATATRadioGroup>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import ATATTextField from "../../components/ATATTextField.vue";
import ATATTextArea from "../../components/ATATTextArea.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Vue from "vue";
import SaveOnLeave from "@/mixins/saveOnLeave";

import { Component, Mixins } from "vue-property-decorator";
import { RadioButton } from "types/Global";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";
import { hasChanges } from "@/helpers";
import store from "@/store";

@Component({
  components: {
    ATATTextField,
    ATATTextArea,
    ATATRadioGroup,
  },
})
export default class ProjectOverview extends Mixins(SaveOnLeave) {
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
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

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public async validateForm(): Promise<boolean> {
    let valid = false;

    await this.$nextTick(() => {
      valid = this.Form.validate();
    });
    return valid;
  }

  public get projectTitle(): string {
    return AcquisitionPackage.getTitle();
  }

  public set projectTitle(value: string) {
    AcquisitionPackage.setProjectTitle(value);
  }

  private get currentData(): ProjectOverviewDTO {
    return {
      title: this.currentTitle,
      scope: this.projectScope,
      emergency_declaration:
        this.emergencyDeclaration === "yes" ? "true" : "false",
    };
  }

  private get savedData(): ProjectOverviewDTO {
    return {
      title: AcquisitionPackage.projectOverview?.title || "",
      scope: AcquisitionPackage.projectOverview?.scope || "",
      emergency_declaration:
        AcquisitionPackage.projectOverview?.emergency_declaration || "false",
    };
  }

  public onTitleChanged(): void {
    this.projectTitle = this.currentTitle;
  }

  public async mounted(): Promise<void> {
      await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadProjectOverview();
    if (storeData) {
      this.currentTitle = storeData.title;
      this.projectScope = storeData.scope;
      if(storeData.emergency_declaration && storeData.emergency_declaration.length > 0)
      {
        this.emergencyDeclaration = storeData.emergency_declaration === "true" ? "yes" : "no";
      }
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveProjectOverview(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
