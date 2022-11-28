<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Where is your current environment located?
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If you have instances in a hybrid environment, then we will gather details about the
              location for each instance later.
            </p>
            <ATATRadioGroup
              id="EnvLocationButtons"
              :card="true"
              :items="envLocationOption"
              :rules="[$validators.required('Please select a type of environment')]"
              :value.sync="currentEnvironmentLocation"
              class="copy-max-width mb-10 max-width-740"
              name="radioButton-card"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { EnvironmentLocation, RadioButton } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { CurrentEnvironmentDTO, CurrentEnvironmentInstanceDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import CurrentEnvironment,
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class CurrentEnvironmentLocation extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  public envInstances: CurrentEnvironmentInstanceDTO[] = [];

  /* eslint-disable camelcase */
  public currentEnvironmentLocation: EnvironmentLocation = "";
  private envLocationOption: RadioButton[] = [
    {
      id: "CloudComputingEnvironment",
      label: "Cloud computing environment",
      value: "CLOUD",
    },
    {
      id: "OnPremises",
      label: "On-premise environment",
      value: "ON_PREM",
    },
    {
      id: "HybridCloudEnvironment",
      label: "Hybrid environment",
      value: "HYBRID",
    },
  ];

  @Watch("currentEnvironmentLocation")
  public locationChange(newVal: string) {
    //
    
  }

  private savedData: Record<string, string> = {
    env_location: "",
  }

  private get currentData(): Record<string, string> {
    return {
      env_location: this.currentEnvironmentLocation || "",
    };
  }

  public get hasCloudEnvs(): boolean {
    return this.envInstances.findIndex(obj => obj.env_location === "ON_PREM")
  }

  public async loadOnEnter(): Promise<void> {
    // TODO - get from ACQPKG store or CURRENV store??
    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.currentEnvironmentLocation = storeData.env_location;
      this.savedData = {
        env_location: storeData.env_location,
      }
    }
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        Object.assign(this.currEnvDTO, this.currentData);
        // TODO - which store to save to?
        CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
        AcquisitionPackage.setCurrentEnvironment(this.currEnvDTO);
        
        CurrentEnvironment.resetCurrentEnvironmentInstance();

        // TODO - wire to proper location for saving after DB is updated
        // await AcquisitionPackage.saveData<CurrentEnvironmentDTO>({
        //   data: this.currentData,
        //   storeProperty: StoreProperties.CurrentEnvironment
        // });
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}
</script>
