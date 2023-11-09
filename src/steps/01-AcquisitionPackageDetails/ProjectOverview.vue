<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s start with basic info about your new acquisition
          </h1>
          <p class="page-intro">
            In this section, we will gather overarching details about your
            project requirements, organization, and points of contact. This
            information will be used to complete your required acquisition forms
            and will also help us to guide you through the JWCC procurement
            process.
          </p>
          <div class="mt-10">
            <ProjectTitle
              ref="ProjectTitleRef"
              label="Project/Requirement Title"
              :rules="[
                $validators.required('Please enter your project title'),
                $validators.maxLength(60, 'Title cannot exceed 60 characters'),
              ]"
              :currentTitle="currentTitle"
              @update:currentTitle="currentTitle = $event"
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 textarea-max-width">
            <ProjectScope
              ref="ProjectScopeRef"
              label="What is the scope of your requirement?"
              :projectScope="projectScope"
              @update:projectScope="projectScope = $event"
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
              ref="EmergencyDeclarationRadioExternal"
              legend="Is this requirement in support of an emergency declaration?"
              :emergencyDeclaration="emergencyDeclaration"
              @update:emergencyDeclaration="emergencyDeclaration = $event"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <div class="d-flex align-start flex-column mt-6">
            <CJADC2Initiative
              ref="CJADC2RadioExternal"
              legend='Is this package in support of the Combined Joint All-Domain Command and
                Control (CJADC2) initiative?'
              helpText = "CJADC2 is the Department of Defense’s (DoD’s) concept to connect sensors 
                from all of the military services-Air Force, Army, Marine Corps, Navy, 
                and Space Force-into a single network."
              :cjadc2Initiative="cjadc2Initiative"
              @update:cjadc2Initiative="cjadc2Initiative = $event"
              :cjadc2Percentage="cjadc2Percentage"
              @update:cjadc2Percentage="cjadc2Percentage = $event"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <hr/>
          <div class="d-flex align-start flex-column mt-10 textarea-max-width">
            <ProjectDisclaimer
              ref="disclaimerGroupLabelRef"
              groupLabelId="disclaimerGroupLabel"
              :selectedDisclaimer="selectedDisclaimer"
              @update:selectedDisclaimer="selectedDisclaimer = $event"
              :rules="[$validators.required(`You must acknowledge compliance with your 
              Military-specific policies.`)]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch , Vue, toNative, Hook} from "vue-facing-decorator";

import ProjectTitle from "./components/ProjectTitle.vue"
import ProjectScope from "./components/ProjectScope.vue";
import EmergencyDeclarationSupport from "./components/EmergencyDeclarationSupport.vue";
import CJADC2Initiative from "./components/cjadc2Initiative.vue";
import ProjectDisclaimer from "./components/ProjectDisclaimer.vue"
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";
import { To, From, beforeRouteLeaveFunction, SaveOnLeaveRefs } from "@/mixins/saveOnLeave";
import { ProjectOverviewDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import {  YesNo } from "types/Global";
 
@Component({
  components: {
    ProjectTitle,
    ProjectScope,
    EmergencyDeclarationSupport,
    CJADC2Initiative,
    ProjectDisclaimer,
    ATATTextField
  },
})
class ProjectOverview extends Vue {

  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    debugger;
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch(() => false)
  }

  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private projectDisclaimer = "";
  private selectedDisclaimer: string[] = [];
  private cjadc2Initiative = "";
  private cjadc2Percentage = ""; 

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
      project_disclaimer: this.selectedDisclaimer[0] as YesNo,
      cjadc2: this.cjadc2Initiative,
      cjadc2_percentage: this.cjadc2Percentage || "",
    }
  }

  private get savedData(): ProjectOverviewDTO {
    const poObj = AcquisitionPackage.projectOverview as ProjectOverviewDTO;
    return {
      title: poObj.title,
      scope: poObj.scope,
      emergency_declaration: poObj.emergency_declaration,
      project_disclaimer: poObj.project_disclaimer,
      cjadc2: poObj.cjadc2,
      cjadc2_percentage: poObj.cjadc2_percentage 
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

    const storeData = AcquisitionPackage.projectOverview
      || await AcquisitionPackage.loadData<ProjectOverviewDTO>({
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
      if (
        storeData.project_disclaimer
      ){
        this.projectDisclaimer = storeData.project_disclaimer
        if(this.projectDisclaimer === "YES"){
          this.selectedDisclaimer.push("YES")
        }
      }
      if( storeData.cjadc2){
        this.cjadc2Initiative = storeData.cjadc2;
        this.cjadc2Percentage = this.cjadc2Initiative === "YES"
          ? storeData.cjadc2_percentage as string
          : "";
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

export default toNative(ProjectOverview)
</script>
