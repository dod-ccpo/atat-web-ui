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

          <ATATAlert 
            id="LocationChangeAlert"
            class="copy-max-width"
            type="warning"
            v-if="warningMessage"
          >
            <template slot="content">
              <p class="mb-0">
                NOTE: {{ warningMessage }}
              </p>
            </template>
          </ATATAlert>

        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      id="ChangeEnvLocationModal"
      :showDialog="showConfirmDialog"
      :title="'Delete all ' + deleteInstanceTypeStr + ' instances?'" 
      no-click-animation
      :okText="'Delete all ' + deleteInstanceTypeStr + ' instances'" 
      width="450"
      @ok="deleteInstances"
      @cancelClicked="cancelDeleteInstances"
    >    
      <template #content>
        <p class="body" :class="{'mb-0' : changeFromEnv === 'HYBRID' }">
          This action will permanently delete all {{ deleteInstanceTypeStr }} 
          instances that you already entered.
        </p>
        <p v-if="changeFromEnv !== 'HYBRID'" class="mb-0 body">
          If you need to add {{ theOtherEnvTypeStr }} instances to your current 
          environment summary, consider changing to a hybrid environment instead.
        </p>
      </template>
    </ATATDialog>

  </v-form>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { EnvironmentLocation, RadioButton, ToastObj } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { CurrentEnvironmentDTO, CurrentEnvironmentInstanceDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import Toast from "@/store/toast";

import CurrentEnvironment,
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert,
    ATATDialog,
  },
})
export default class CurrentEnvironmentLocation extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  public showConfirmDialog = false;
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

  public changeFromEnv = "";
  public changeToEnv = "";

  public warningMessage = "";
  public warningMessages: Record<string, string> = {
    CLOUD: `Changing to an on-premise environment will delete all cloud instances 
      that you already entered.`,
    ON_PREM: `Changing to a cloud environment will delete all on-premise instances
      that you already entered.`,
    HYBRID: `Changing to a cloud environment will delete all on-premise instances 
      that you already entered. And vice versa, changing to an on-premise environment 
      will delete all cloud instances.`
  }

  public get envInstances(): CurrentEnvironmentInstanceDTO[] {
    return CurrentEnvironment.currentEnvInstances;
  };

  public get hasCloudInstances(): boolean {
    return this.hasInstances("CLOUD");
  }

  public get hasOnPremInstances(): boolean {
    return this.hasInstances("ON_PREM");
  }

  public hasInstances(type: string): boolean {
    const onPremEnvs = this.envInstances.filter(obj => obj.instance_location === type);
    return onPremEnvs && onPremEnvs.length > 0;
  }

  public get deleteInstanceType(): string {
    return this.changeToEnv === "CLOUD" ? "ON_PREM" : "CLOUD";
  }
  public get deleteInstanceTypeStr(): string {
    return this.changeToEnv === "CLOUD" ? "on-premise" : "cloud";
  }
  public get theOtherEnvTypeStr(): string {
    return this.changeToEnv === "CLOUD" ? "cloud" : "on-premise";
  }


  @Watch("currentEnvironmentLocation")
  public locationChange(newVal: string): void {
    this.changeToEnv = newVal;
    if (
      newVal === "ON_PREM" && this.hasCloudInstances || 
      newVal === "CLOUD" && this.hasOnPremInstances
    ) {
      this.showConfirmDialog = true;
    }
  }

  public cancelDeleteInstances(): void {
    this.showConfirmDialog = false;
  }

  public async deleteInstances(): Promise<void> {
    const instancesToDelete = this.envInstances.filter(
      obj => obj.instance_location === this.deleteInstanceType
    );
    instancesToDelete.forEach(async (instance) => {
      if (instance.sys_id) {
        await CurrentEnvironment.deleteEnvironmentInstance(instance.sys_id);
        await CurrentEnvironment.clearEnvClassifications(this.deleteInstanceType);
      }
    });
    this.showConfirmDialog = false;
    const instanceTypeDeleted = this.changeToEnv === "CLOUD" ? "On-premise" : "Cloud";
    this.instanceRemovedToast.message = instanceTypeDeleted + " instances deleted";
    Toast.setToast(this.instanceRemovedToast);

    const envInstances = await CurrentEnvironment.getCurrentEnvironmentInstances();
    await CurrentEnvironment.setCurrentEnvInstanceNumber(envInstances.length);
  }

  public instanceRemovedToast: ToastObj = {
    type: "success",
    message: "",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  private savedData: Record<string, string> = {
    env_location: "",
  }

  private get currentData(): Record<string, string> {
    return {
      env_location: this.currentEnvironmentLocation || "",
    };
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.currentEnvironmentLocation = storeData.env_location;
      this.savedData = {
        env_location: storeData.env_location,
      }
      if (storeData.env_location) {
        this.warningMessage = this.warningMessages[storeData.env_location];
        this.changeFromEnv = storeData.env_location;
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
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
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
