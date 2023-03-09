<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you need an architectural design solution to address a known problem or use-case?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              This objective-based requirement is a good option if you need help with: determining
              the most effective cloud resources, tools, or services needed for your project;
              translating functional requirements into a new technology solution; or guidance on
              the strategic direction of your project. We'll gather details about your situation
              and request CSPs to propose a customized cloud solution based on your unique
              objectives.
            </p>
            <div v-if="noEnvNoXaaS() || hasEnvNoXaaS()">
              <ATATAlert
              id="ArchitecturalDesignAlert"
              type="warning"
              class="mb-10 mt-2"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0 font-weight-400 font-size 16">
                  Based on what you previously told us, we recommend selecting “Yes” below.
                  If you don’t need an architectural design solution, you’ll need to revisit
                  <span v-if="noEnvNoXaaS()">
                    <router-link
                    id="CompleteCurrentEnv"
                    :to="{ name: routeNames.CurrentEnvironment }"
                  >
                  Your Current Functions
                  </router-link>
                  or
                  </span>
                  <router-link
                    id="CompleteXaaS"
                    :to="{ name: routeNames.RequirementCategories }"
                  >
                  XaaS
                  </router-link>
                  to define performance requirements for your Description of Work.
                </p>
              </template>
            </ATATAlert>
            </div>
            <ATATRadioGroup
              id="ArchitectureOptions"
              :card="true"
              :width="180"
              :items="radioOptions"
              :value.sync="architectureDesignNeeds.needs_architectural_design_services"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import DescriptionOfWork, { defaultDOWArchitecturalNeeds } from "@/store/descriptionOfWork";
import { ArchitecturalDesignRequirementDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { routeNames } from "@/router/stepper";
import ATATAlert from "@/components/ATATAlert.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";


@Component({
  components: {
    ATATRadioGroup,
    ATATAlert
  }
})

export default class ArchitecturalDesign extends Mixins(SaveOnLeave) {
  public routeNames = routeNames
  public architectureDesignNeeds = defaultDOWArchitecturalNeeds;

  public get hasCurrentEnv(): boolean {
    return CurrentEnvironment.currentEnvironment.current_environment_exists === "YES"
  }

  public get hasXaaSOffering():boolean {
    return DescriptionOfWork.DOWObject[0].serviceOfferingGroupId !=="XaaS_NONE"
  }
  public get isCurrentEnvironmentEmpty():boolean {
    return CurrentEnvironment.currentEnvironment.current_environment_exists === ""
  }
  public get isXaaSOfferingEmpty():boolean {
    return DescriptionOfWork.DOWObject.length === 0
  }
  public noEnvNoXaaS():boolean {
    return !this.hasCurrentEnv && !this.hasXaaSOffering
      && !this.isCurrentEnvironmentEmpty && !this.isXaaSOfferingEmpty
  }

  public hasEnvNoXaaS():boolean {
    return this.hasCurrentEnv && !this.hasXaaSOffering
      && !this.isCurrentEnvironmentEmpty && !this.isXaaSOfferingEmpty
  }
  public radioOptions: RadioButton[] = [
    {
      id: "YesArchitecture",
      value: "YES",
      label: "Yes.",
    },
    {
      id: "NoArchitecture",
      value: "NO",
      label: "No.",
    },
  ];

  public get currentData(): ArchitecturalDesignRequirementDTO {
    return this.architectureDesignNeeds
  };

  /* eslint-disable camelcase */
  public savedData: ArchitecturalDesignRequirementDTO = {
    source: "DOW",
    statement: "",
    applications_needing_design: "",
    data_classification_levels: "",
    external_factors: "",
    acquisition_package: AcquisitionPackage.packageId,
    needs_architectural_design_services:""
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await DescriptionOfWork.getDOWArchitecturalNeeds();
    if (storeData) {
      this.savedData = _.cloneDeep(storeData);
      this.architectureDesignNeeds = _.cloneDeep(storeData)
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData.needs_architectural_design_services,
      this.savedData.needs_architectural_design_services);
  }

  protected async saveOnLeave(): Promise<boolean> {
    const emptyArchObject = {
      statement: "",
      applications_needing_design: "",
      data_classification_levels: "",
      external_factors: "",
    }
    try {
      if (this.hasChanged()) {
        if(this.currentData.needs_architectural_design_services === "NO"){
          let data = Object.assign(this.currentData, emptyArchObject)
          await DescriptionOfWork.setDOWArchitecturalDesign(data);
        }else{
          await DescriptionOfWork.setDOWArchitecturalDesign(this.currentData);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

</script>
