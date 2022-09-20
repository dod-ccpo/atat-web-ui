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
            <ProjectTitle
              label="Project/Requirement Title"
              :rules="[
                $validators.required('Please enter your project title'),
                $validators.maxLength(60, 'Title cannot exceed 60 characters'),
              ]"
              :currentTitle.sync="currentTitle"
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 textarea-max-width">
            <ProjectScope
              label="What is the scope of your requirement?"
              :projectScope.sync="projectScope"
              helpText="Briefly describe the type of resources and services to be
                acquired, and what is necessary to achieve mission specific
                outcomes for this particular requirement (e.g., move DITCO’s contract
                writing system to a cloud environment)."
              :rules="[
                $validators.required(
                  'Please describe the scope of your requirement'
                ),
                $validators.maxLength(
                  300,
                  'Please limit your description to 300 characters or less'
                ),
              ]"
            />
          </div>
          <div class="d-flex align-start flex-column mt-6">
            <EmergencyDeclarationSupport
              legend="Is this requirement in support of an emergency declaration?"
              :emergencyDeclaration.sync="emergencyDeclaration"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Mixins, Watch } from "vue-property-decorator";

import ProjectTitle from "./components/ProjectTitle.vue"
import ProjectScope from "./components/ProjectScope.vue";
import EmergencyDeclarationSupport from "./components/EmergencyDeclarationSupport.vue";

import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { ProjectOverviewDTO } from "@/api/models";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ProjectTitle,
    ProjectScope,
    EmergencyDeclarationSupport,
  },
})
export default class ProjectOverview extends Mixins(SaveOnLeave) {
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";

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
      emergency_declaration: this.emergencyDeclaration,
    };
  }

  private get savedData(): ProjectOverviewDTO {
    return {
      title: AcquisitionPackage.projectOverview?.title || "",
      scope: AcquisitionPackage.projectOverview?.scope || "",
      emergency_declaration: AcquisitionPackage.projectOverview?.emergency_declaration || "",
    };
  }

  @Watch("currentTitle")
  public projectTitleChange(newTitle: string): void {
    this.projectTitle = newTitle;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    });

    if (storeData) {
      this.currentTitle = storeData.title;
      this.projectScope = storeData.scope;
      if (
        storeData.emergency_declaration &&
        storeData.emergency_declaration.length > 0
      ) {
        this.emergencyDeclaration = storeData.emergency_declaration;
      }
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData({
          data: this.currentData,
          storeProperty: StoreProperties.ProjectOverview,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
