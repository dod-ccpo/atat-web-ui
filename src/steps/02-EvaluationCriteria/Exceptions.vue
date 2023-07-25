<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s see if you qualify for an exception to fair opportunity
            </h1>

            <ATATAlert
              id="FairOpportunityAlert"
              type="callout"
              :showIcon="false"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <h2>Fair opportunity</h2>
                <p class="mt-2 mb-0">
                  Each Cloud Service Provider (CSP) available within the JWCC Contract must be given
                  a fair opportunity to be considered for task orders exceeding the micro-purchase
                  threshold, unless a statutory exception applies. Any exceptions will require
                  written justification, in accordance with
                  <a
                    href="https://www.acquisition.gov/far/16.505"
                    target="_blank"
                    class="_text-link"
                    id="ExceptionExternalLink"
                  >
                    <span class="_external-link">FAR 16.505(b)(2)</span>
                  </a>.
                  <!--We will help you complete justification documentation, if needed.-->
                </p>
              </template>
            </ATATAlert>

            <FairOppExceptions 
              legend="Based on your market research, do any of the following exceptions to fair 
                opportunity apply to your acquisition?"
              classes="copy-max-width mb-10 mt-3"
              :selectedException.sync="selectedException"
              :rules="[$validators.required('Please select an option')]"            
            />

            <ATATAlert
              v-if="evalAlertDisplay"
              id="JandAMMRWarningAlert"
              :type="evalAlertType"
              :showIcon="true"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <div v-if="alertIsWarning">
                  <p>
                    Your final acquisition package will require a <strong>Justification & 
                    Approval (J&A).</strong> We’ll help you complete all of your required 
                    justification documentation.
                  </p>
                  <p v-if="isUncommonSelected">
                    Note: This exception to fair opportunity process is rarely approved by the
                    Contracting Office. To obtain approval, you will likely need to provide
                    additional justification during the acquisition review process.
                  </p>
                </div>
                <div v-else>
                  <p>
                    Your final acquisition package does NOT require a Justification & 
                    Approval (J&A). If there are other exceptions that apply to this effort 
                    that we did not address, please contact your Contracting Office.
                  </p>
                  <p>
                    That’s all the information we need for this section.
                  </p>
                </div>
              </template>
            </ATATAlert>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import FairOppExceptions from "./components/FairOppExceptions.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import { FairOpportunityDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATAlert,
    FairOppExceptions,
  },
})

export default class Exceptions extends Mixins(SaveOnLeave) {

  private selectedException 
    = AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity as string;

  /**
   * Returns whether the ATATAlert should be displayed or not
   */
  get evalAlertDisplay(): boolean {
    return this.selectedException !== "";
  }

  /**
   * Returns the type value for the ATATAlert component, based
   * on the selected exception option.
   */
  get evalAlertType(): string {
    return  this.selectedException !== "" && this.selectedException !== "NO_NONE" ?
      "warning" : "info";
  }

  public get alertIsWarning(): boolean {
    return this.evalAlertType === "warning";
  }
  public get isUncommonSelected(): boolean {
    return this.selectedException === "YES_FAR_16_505_B_2_I_A";
  }

  private get currentData(): FairOpportunityDTO {
    return {
      exception_to_fair_opportunity: this.selectedException,
    };
  }

  private get savedData(): FairOpportunityDTO {
    return {
      exception_to_fair_opportunity: AcquisitionPackage
        .fairOpportunity?.exception_to_fair_opportunity || "",
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.fairOpportunity;
    if (storeData) {
      this.selectedException = storeData.exception_to_fair_opportunity as string;
    }

  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
      // if user changed from `NO_NONE` OR to `NO_NONE`
      // clear current contract info from STORE & SNOW
      if (this.hasChangedFromToNoNone()){
        await AcquisitionPackage.clearCurrentContractInfo();
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  public hasChangedFromToNoNone():boolean{
    return this.savedData.exception_to_fair_opportunity !== "NO_NONE" &&
      this.currentData.exception_to_fair_opportunity === "NO_NONE";
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
