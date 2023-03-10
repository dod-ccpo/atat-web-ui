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
              If your current environment does not meet your current requirements,
              select “No” below, and the instance details that you previously provided
              will serve only as background information within your Description of Work.
            </p>

            <ATATRadioGroup
                class="mb-5"
              id="ReplicateOptimizeOptions"
              :card="true"
              :items="radioOptions"
              :value.sync="currEnvDTO.current_environment_replicated_optimized"
              :rules="[$validators.required('Please select an option.')]"
             />

            <ATATExpandableLink aria-id="ROFAQ">
              <template v-slot:header>
                What does it mean to replicate or optimize current functions?
              </template>
              <template v-slot:content>
                <p class="mb-4">
                  During the solicitation process, Cloud Service Providers (CSPs) will
                  be asked to reference the instance details you previously provided
                  within the Background section and deliver a quote/proposal based on
                  your choice to either “replicate” or “optimize” your current functions.
                </p>
                <ul>
                  <li class="pb-2">
                    To replicate your current functions, a CSP will be expected to perform
                    a “lift and shift” to recreate your environment and configurations, as is.
                  </li>
                  <li class="pb-4">
                    To optimize your current functions, a CSP will be expected to evaluate
                    your current environment configurations and propose an improved or
                    modernized solution.
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>
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
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import Steps from "@/store/steps";
import { routeNames } from "@/router/stepper";

@Component({
  components: {
    ATATExpandableLink,
    ATATRadioGroup
  }
})

export default class ReplicateAndOptimize extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;

  public radioOptions: RadioButton[] = [
    {
      id: "YesReplicate",
      value: "YES_REPLICATE",
      label: "Replicate my current functions."
    },
    {
      id: "YesOptimize",
      value: "YES_OPTIMIZE",
      label: "Optimize my current functions."
    },
    {
      id: "NoReplicateOrOptimize",
      value: "NO",
      label: "No. I don’t want to replicate or optimize my current functions."
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
    const comingFrom = Steps.prevStepName;
    if (comingFrom !== routeNames.DOWLandingPage && comingFrom !== routeNames.ReplicateDetails) {
      this.$router.push({
        name: routeNames.DOWLandingPage,
      }).catch(() => console.log("error navigating to DOW Landing Page"));      
    }
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
