
<template>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you have a current contract for this effort?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              If your acquisition is a follow-on requirement, 
              we’ll gather some details about your contract next.
            </p>
            <ATATRadioGroup                                  
              class="copy-max-width mb-10 max-width-740"
              id="currentContractOptions"
              :card="true"
              :items="currentContractOptions" 
              :value.sync="currentContractExists"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractExistsDTO } from "@/models/BackgroundDTOs";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class CurrentContract extends Mixins(SaveOnLeave) {
  private currentContractOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes. There is a current contract for this effort.",
      value: "true",
    },
    {
      id: "No",
      label: "No. This is a new requirement.",
      value: "false",
    },
  ];

  public get currentContractExists(): string {
    const exists = AcquisitionPackage.currentContractExists?.current_contract_exists;
    return exists || "";
  }

  public set currentContractExists(value: string) {
    debugger;
    AcquisitionPackage.setCurrentContractExists({ current_contract_exists: value });
  }

  private get currentData(): CurrentContractExistsDTO {
    return {
      current_contract_exists: this.currentContractExists,
    };
  }

  private storeData: CurrentContractExistsDTO = { current_contract_exists: "" };

  public async mounted(): Promise<void> {
      await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    debugger;
    this.storeData = await AcquisitionPackage.loadCurrentContractExists();
    if (this.storeData) {
      if (this.storeData.current_contract_exists && this.storeData.current_contract_exists.length) {
        this.currentContractExists = this.storeData.current_contract_exists;
      }
    } else {
      AcquisitionPackage.setCurrentContractExists(this.currentData);
    }
  }

  private hasChanged(): boolean {
    debugger;
    return hasChanges(this.currentData, this.storeData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveCurrentContractExists(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
