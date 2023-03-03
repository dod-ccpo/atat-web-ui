<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you want to replicate or optimize your current environment within this acquisition?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              Based on your response, we’ll include a task within your Description 
              of Work to help CSPs better understand your current performance 
              requirements in relation to your current environment. You will have 
              an opportunity to add more JWCC offerings later, if needed.
            </p>
            <div v-if="hasCurrentEnv && !hasArchitecturalDesign && !hasXaaSOffering">
              <ATATAlert 
              id="ReplicateAndOptimizeAlert"
              type="warning"
              class="mb-10 mt-2"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0 font-weight-400 font-size 16">
                  Based on what you previously told us, we recommend selecting either
                  “Replicate” or “Optimize” below. If you don’t have requirements
                  related to your current functions, you’ll need to revisit
                  <router-link 
                    id="CompleteArchitectural"
                    :to="{ name: routeNames.ArchitecturalDesign }"
                  >
                  Architectural Design Solution
                  </router-link>
                  or 
                  <router-link 
                    id="CompleteXaaS"
                    :to="{ name: routeNames.RequirementCategories }"
                  >
                  XaaS
                  </router-link>
                  to define requirements for
                  your Description of Work.
                </p>
              </template>
            </ATATAlert>
            </div>
            <ATATRadioGroup 
              id="ReplicateOptimizeOptions"
              :card="true"
              :items="radioOptions"
              :value.sync="currEnvDTO.current_environment_replicated_optimized"
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
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import { routeNames } from "@/router/stepper";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATAlert from "@/components/ATATAlert.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert,
  }
})

export default class ReplicateAndOptimize extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  public routeNames = routeNames
  public radioOptions: RadioButton[] = [
    {
      id: "YesReplicate",
      value: "YES_REPLICATE",
      label: "We need the current functions replicated using JWCC offerings.",
      description: `CSP needs to perform a “lift and shift” to recreate the environment 
        and configurations, as is.`
    },
    {
      id: "YesOptimize",
      value: "YES_OPTIMIZE",
      label: "We need the current functions optimized using JWCC offerings.",
      description: `CSP needs to evaluate the environment configurations and propose 
        an improved/modernized solution.`
    },
    {
      id: "NoReplicateOrOptimize",
      value: "NO",
      label: "No. The current environment does not meet the current needs.",
      description: `We want to identify new cloud resources and support requirements 
        for this acquisition.`
    },
  ];

  public get hasCurrentEnv(): boolean {
    return CurrentEnvironment.currentEnvironment.current_environment_exists === "YES"
  }

  public get hasArchitecturalDesign():boolean {
    return CurrentEnvironment.currentEnvironment.needs_architectural_design_services === "YES"
  }
  public get hasXaaSOffering():boolean {
    if(DescriptionOfWork.DOWObject.length === 0)return false
    return DescriptionOfWork.DOWObject[0].serviceOfferingGroupId !=="XaaS_NONE"
  }

  public get currentData(): Record<string, string> {
    return {
      replicatedOrOptimized: this.currEnvDTO.current_environment_replicated_optimized,
    }
  };

  public savedData: Record<string, string> = {
    replicatedOrOptimized: ""
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
      this.savedData.replicatedOrOptimized = storeData.current_environment_replicated_optimized;
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  


}

</script>
