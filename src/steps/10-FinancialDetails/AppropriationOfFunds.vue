<template>
  <v-container class="container-max-width mb-7" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">Let’s find out more about your appropriation of funds</h1>
        <div class="copy-max-width">
          <p>
            Based on what you told us about your exception to fair opportunity, we need to know
            more about where these funds will be coming from. Your responses below, along with
            your total estimated value generated in the Requirements Cost Estimate section,
            will be included in your Justification and Approval (J&A).
          </p>
          <div class="max-width-740">
            <ATATRadioGroup id="fundTypes" 
              legend="What type of funds are planned for this acquisition?" 
              :items="fundTypes" 
              :value.sync="selectedFundType"
              :rules="[
                  $validators.required('Please select type of funds.'),
                ]" 
              class="mb-10" 
              >
            </ATATRadioGroup>
            <ATATRadioGroup id="ContactAffiliation" 
              legend="What fiscal year funds are planned for this acquisition?" 
              :items="fiscalYearFunds" 
              :value.sync="selectedFiscalYear"
              class="mb-10" 
              >
            </ATATRadioGroup>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { RadioButton } from "types/Global";


@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class AppropriationOfFunds extends Mixins(SaveOnLeave) {
  private selectedFundType = "";
  private fundTypes: RadioButton[] = [
    {
      id: "O&M",
      label: "Operations & Maintenance",
      value: "O_M",
    },
    {
      id: "RDT_E",
      label: "Research, Development, Test & Evaluation",
      value: "RDT_E",
    },
    {
      id: "Procurement",
      label: "Procurement",
      value: "Procurement",
    },
  ];

  private selectedFiscalYear = "";
  get fiscalYearFunds():RadioButton[]{
    const thisMonth = (new Date()).getMonth();
    const thisYear = (new Date()).getUTCFullYear();
    const currentFiscalYear = thisMonth < 9 ? thisYear : thisYear + 1;
    const fiscalYears: RadioButton[] = [];
    
    for (let i=0;i<4;i++){

      const fiscalYear = currentFiscalYear - i;
      const FY = "FY"+ (fiscalYear-2000);

      fiscalYears.push({
        id: FY,
        label: "Fiscal Year " + fiscalYear + " (" + FY + ")",
        value: FY, 
      })
    }
    return fiscalYears;

  }

  protected async saveOnLeave(): Promise<boolean> {
    // try {
    //   if (this.hasChanged()) {
    //     const updated: FundingRequestMIPRFormDTO = {
    //     };
    //     await FinancialDetails.saveFundingRequestMIPRForm(updated);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    return true;
  }


  public async mounted(): Promise<void> {
    // await this.loadOnEnter();


  }



}
</script>
