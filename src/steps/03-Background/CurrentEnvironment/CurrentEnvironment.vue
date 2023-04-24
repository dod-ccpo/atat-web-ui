<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you have a current environment to rehost?
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If you select “Yes” below, we’ll gather details about your current environment. 
              This info will be included in your Description of Work to provide CSPs with a better 
              understanding of what currently exists. This environment may not align with your 
              current requirements that you outlined in Contract Details.
            </p>
            <ATATRadioGroup
              id="ExistingEnvOptions"
              :card="true"
              :items="existingEnvOption"
              :rules="[$validators.required('Please select an option')]"
              :value.sync="currentEnvironmentExists"
              class="copy-max-width mb-10 max-width-740"
              width="380"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import { RadioButton, YesNo } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";

import { CurrentEnvironmentDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class HasCurrentEnvironment extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;

  private existingEnvOption: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No, current environment does not exist.",
      value: "NO",
    },
  ];
  public currentEnvironmentExists: YesNo = "";
  private get currentData(): Record<string, string> {
    return {
      // eslint-disable-next-line camelcase
      current_environment_exists: this.currentEnvironmentExists || "",
    };
  }

  private savedData: Record<string, string> = {
    // eslint-disable-next-line camelcase
    current_environment_exists: "",
  }



  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.currentEnvironmentExists = storeData.current_environment_exists;
      this.savedData = {
        // eslint-disable-next-line camelcase
        current_environment_exists: storeData.current_environment_exists,
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }


  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        Object.assign(this.currEnvDTO, this.currentData);
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>

