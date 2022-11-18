<template>
  <v-form ref="form">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you need an architectural design solution to address a known problem
            or use-case related to your current environment?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              If needed, we’ll gather details about your architectural design requirements next.
            </p>

            <ATATRadioGroup 
              id="ArchitectureOptions"
              :card="true"
              :items="radioOptions"
              :value.sync="currEnvDTO.needs_architectural_design_services"
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

  public get currentData(): Record<string, string> {
    return {
      needsArchitectureDesign: this.currEnvDTO.needs_architectural_design_services,
    }
  };

  public savedData: Record<string, string> = {
    needsArchitectureDesign: ""
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
      this.savedData.needsArchitectureDesign = storeData.needs_architectural_design_services;
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        // TODO - which store to save to?
        CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
        AcquisitionPackage.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

</script>
