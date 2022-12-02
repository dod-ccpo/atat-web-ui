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
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup
  }
})

export default class ReplicateAndOptimize extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;

  public radioOptions: RadioButton[] = [
    {
      id: "YesReplicate",
      value: "YES_REPLICATE",
      label: "I need my current functions replicated using JWCC offerings.",
      description: `CSP needs to perform a “lift and shift” to recreate my environment 
        and configurations, as is.`
    },
    {
      id: "YesOptimize",
      value: "YES_OPTIMIZE",
      label: "I need my current functions optimized using JWCC offerings.",
      description: `CSP needs to evaluate my environment configurations and propose 
        an improved/modernized solution.`
    },
    {
      id: "NoReplicateOrOptimize",
      value: "NO",
      label: "No. My current environment does not meet my current needs.",
      description: `I want to identify new cloud resources and support requirements 
        for this acquisition.`
    },
  ];

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
