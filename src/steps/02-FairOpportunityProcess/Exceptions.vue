<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s see if you qualify for an exception to the fair opportunity process
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
                Each Cloud Service Provider (CSP) available within the JWCC contract must be given
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
                We will help you complete justification documentation, if needed.
              </p>
            </template>
          </ATATAlert>

          <ATATRadioGroup
            class="copy-max-width mb-10"
            id="ExceptionRadioOptions"
            legend="Based on your market research, do any of the following exceptions to fair 
              opportunity apply to your acquisition?"
            :items="exceptionOptions"
            :value.sync="selectedException"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { FairOpportunityDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATAlert,
    ATATRadioGroup,
  },
})

export default class Exceptions extends Mixins(SaveOnLeave) {
  private selectedException = "";
  private exceptionOptions: RadioButton[] = [
    {
      id: "OnlyOneCSPCapable",
      label: `Only one CSP is capable of providing the supplies or services required at the level 
        of quality required because the supplies or services ordered are unique or highly 
        specialized. <span class="text-base">FAR 16.505(b)(2)(i)(B)</span>`,
      value: "YES_FAR_16_505_B_2_I_B",
    },
    {
      id: "AllFair",
      label: `The order must be issued on a sole-source basis in the interest of economy and 
        efficiency because it is a logical follow-on to an order already issued under the JWCC 
        contracts, provided that all awardees were given a fair opportunity to be considered for 
        the original order. <span class="text-base">FAR 16.505(b)(2)(i)(C)</span>`,
      value: "YES_FAR_16_505_B_2_I_C",
    },
    {
      id: "NoneApply",
      label: "None of these exceptions apply to this acquisition.",
      value: "NO_NONE",
    },
  ];
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
    const storeData = await AcquisitionPackage.loadFairOpportunity();
    if (storeData) {
      this.selectedException = storeData.exception_to_fair_opportunity;
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveFairOpportunity(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
