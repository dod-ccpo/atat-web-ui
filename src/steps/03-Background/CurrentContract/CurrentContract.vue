<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1   class="page-header mb-3">
            {{ getHeadline() }}
          </h1>
          
          <div class="copy-max-width">
            <p class="mb-8">
              {{ getLeadParagraph() }}
            </p>
            <CurrentContractOptions                                  
              :card="true"
              :isWizard="true"
              :selectedOption.sync="currentContractExists"
              :hasExceptionToFairOpportunity="hasExceptionToFairOpportunity()"
              :rules="[$validators.required('Please select an option')]"            
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";

import CurrentContractOptions from "./components/CurrentContractOptions.vue"

import AcquisitionPackage, 
{initialCurrentContract, StoreProperties} from "@/store/acquisitionPackage";

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
  public headline = "";

  private get currentData(): CurrentContractDTO {
    return {
      current_contract_exists: this.currentContractExists,
    };
  }

  private hasExceptionToFairOpportunity(): boolean {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity !== "NO_NONE";
  }

  private getHeadline():string{
    return "Do you have a current " + 
      (this.hasExceptionToFairOpportunity() ? " or previous " : "") + 
      " contract for this effort?"
  }

  private getLeadParagraph():string{
    const contract = this.hasExceptionToFairOpportunity() ? "contract(s)" : "contract";
    return "If your acquisition is a follow-on requirement, we’ll gather details about your " +
      contract + ". Your current contract will serve as a background on multiple documents " +
      "within your final acquisition package, as applicable."
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
        let data = this.currentData;
        if (data.current_contract_exists === "NO") {
          data = initialCurrentContract();
          data.current_contract_exists = "NO"
        }
        await AcquisitionPackage.saveData<CurrentContractDTO>({data,
          storeProperty: StoreProperties.CurrentContract});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
