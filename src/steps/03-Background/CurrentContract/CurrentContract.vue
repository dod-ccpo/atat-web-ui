<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            {{ getHeadline }}
          </h1>
          
          <div class="copy-max-width">
            <p class="mb-8">
              {{ getLeadParagraph }}
            </p>
            <CurrentContractOptions                                  
              :card="true"
              :isWizard="true"
              :selectedOption.sync="currentContractExists"
              :hasExceptionToFairOpportunity="hasExceptionToFairOpportunity"
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
import Steps from "@/store/steps";
import { routeNames } from "@/router/stepper";
import { CurrentContractRouteResolver } from "@/router/resolvers";

@Component({
  components: {
    CurrentContractOptions,
  },
})

export default class CurrentContract extends Mixins(SaveOnLeave) {
  public headline = "";
  public currentContractExists = "";

  private get currentData(): CurrentContractDTO {
    return {
      current_contract_exists: this.currentContractExists,
      acquisition_package: AcquisitionPackage.packageId
    };
  }

  private savedData = {
    current_contract_exists:  AcquisitionPackage.hasCurrentOrPreviousContracts,
    acquisition_package: AcquisitionPackage.packageId
  };

  private get hasExceptionToFairOpportunity(): boolean {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity !== "NO_NONE";
  }

  private get getHeadline(): string {
    return "Do you have a current " + 
      (this.hasExceptionToFairOpportunity ? " or previous " : "") + 
      " contract for this effort?"
  }

  private get getLeadParagraph(): string {
    const contract = this.hasExceptionToFairOpportunity ? "contract(s)" : "contract";
    return "If your acquisition is a follow-on requirement, we’ll gather details about your " +
      contract + ". Your current contract will serve as a background on multiple documents " +
      "within your final acquisition package, as applicable."
  }

  public async mounted(): Promise<void> {
    // if second option in step 2 Exception to Fair Opportunity is selected
    // skip this page. Use route resolver to determine where to go
    const hasLogicalFollowOn = AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity
      === "YES_FAR_16_505_B_2_I_C";
    if (hasLogicalFollowOn) {
      const routeName = CurrentContractRouteResolver(Steps.prevStepName)
      this.$router.push({
        name: routeName,
      }).catch(() => console.log("error Navigating to DAPPS Checklist"));      
    }   
    await this.loadOnEnter();     
  }  

  public async loadOnEnter(): Promise<void> {
    this.savedData.current_contract_exists =
      await AcquisitionPackage.hasCurrentOrPreviousContracts;
    this.currentContractExists = this.savedData.current_contract_exists as string;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      const hasCurrentContract = this.currentData.current_contract_exists as string;
      await AcquisitionPackage.setHasCurrentOrPreviousContracts(
        hasCurrentContract
      )
      if (this.hasChanged()) {
        // always clear existing Contracts if form value has changed
        await AcquisitionPackage.clearCurrentContractInfo();
        if (hasCurrentContract==="NO"){
          // update store && snow
          const noContract = initialCurrentContract();
          noContract.current_contract_exists = "NO";
          noContract.instance_number= 0;
          noContract.acquisition_package = AcquisitionPackage.packageId;
          AcquisitionPackage.updateCurrentContractsSNOW([noContract]);
        }
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
