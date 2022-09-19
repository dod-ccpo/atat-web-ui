<template>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you have a current contract for this effort?
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If your acquisition is a follow-on requirement, we’ll gather some 
              details about your contract next. Your procurement history will serve 
              as a background on multiple documents within your final acquisition 
              package, including the Requirements Checklist and Description of Work.
            </p>
            <CurrentContractOptions                                  
              :card="true"
              :items="currentContractOptions" 
              :selectedOption.sync="currentContractExists"
              :rules="[$validators.required('Please select an option')]"            
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";

import CurrentContractOptions from "./components/CurrentContractOptions.vue"

import AcquisitionPackage, {StoreProperties} from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractDTO } from "@/api/models";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    CurrentContractOptions,
  },
})

export default class CurrentContract extends Mixins(SaveOnLeave) {

  public currentContractExists = "";

  private get currentData(): CurrentContractDTO {
    return {
      current_contract_exists: this.currentContractExists,
    };
  }

  private savedData: CurrentContractDTO = { 
    current_contract_exists: "" 
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.
      loadData<CurrentContractDTO>({storeProperty: StoreProperties.CurrentContract})
    if (storeData) {
      if (Object.prototype.hasOwnProperty.call(storeData, 'current_contract_exists')) {
        this.savedData = {
          current_contract_exists: storeData.current_contract_exists,
        }
        this.currentContractExists = storeData.current_contract_exists || "";
      }
    } else {
      AcquisitionPackage.setCurrentContract(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData<CurrentContractDTO>({data: this.currentData,
          storeProperty: StoreProperties.CurrentContract});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
