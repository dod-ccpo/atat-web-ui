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
              ref="CurrentContractOptionsRef"                               
              :card="true"
              :isWizard="true"
              :selectedOption="currentContractExists"
              @update:selectedOption="currentContractExists = $event"
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
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";

import CurrentContractOptions from "./components/CurrentContractOptions.vue"

import AcquisitionPackage, 
{initialCurrentContract} from "@/store/acquisitionPackage";

import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { CurrentContractDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import Steps from "@/store/steps";
import { CurrentContractRouteResolver } from "@/router/resolvers";
import { SaveOnLeaveRefs } from "types/Global";

@Component({
  components: {
    CurrentContractOptions,
  },
})

class CurrentContract extends Vue {
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public headline = "";
  public currentContractExists = "";
  public noContract: CurrentContractDTO = {};
  private saveOnLeaveError: string| unknown = "";
  private hasLoaded = false

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
    await this.addNavigation()
    await this.loadOnEnter();     
  }  

  public async addNavigation(): Promise<void> {
    const hasLogicalFollowOn = AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity
      === "YES_FAR_16_505_B_2_I_C";
    if (hasLogicalFollowOn) {
      const routeName = CurrentContractRouteResolver(Steps.prevStepName)
      try{
        await this.$router.push({
          name: routeName,
        })
      }catch(error){
        console.log("error Navigating to DAPPS Checklist")
      };      
    }   
  }

  public async loadOnEnter(): Promise<void> {
    this.savedData.current_contract_exists = AcquisitionPackage.hasCurrentOrPreviousContracts;
    this.currentContractExists = this.savedData.current_contract_exists;
    this.hasLoaded = true
  }

  private hasChanged(): boolean {
    if (!this.hasLoaded) return false
    return hasChanges(this.currentData, this.savedData)
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
          this.noContract = initialCurrentContract();
          this.noContract.current_contract_exists = "NO";
          this.noContract.instance_number= 0;
          this.noContract.acquisition_package = AcquisitionPackage.packageId;
          await AcquisitionPackage.updateCurrentContractsSNOW([this.noContract]);
          this.noContract = {};
        }
      }
    } catch (error) {
      console.log(error);
      this.saveOnLeaveError = error as string;
    }

    return true;
  }

}

export default toNative(CurrentContract)
</script>
