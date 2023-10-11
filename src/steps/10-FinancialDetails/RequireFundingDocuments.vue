<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Does your Contracting Office require funding documents for submission
          of your acquisition package?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            Your Contracting Office may require an interagency agreement and/or
            a funding request to procure JWCC cloud resources or support
            services on your agency’s behalf (e.g., Fiscal Service Forms 7600A/B
            or Military Interdepartmental Purchase Request (MIPR)).
          </p>
        </div>
        <div style="max-width: 180px">
          <ATATRadioGroup
            :card="true"
            class="max-width-640"
            id="GInvoicingOptions"
            :items="requireFundingOptions"
            :value.sync="requireFundingSelection"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { RadioButton } from "types/Global";
import FinancialDetails from "@/store/financialDetails";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class RequireFundingDocuments extends Mixins(SaveOnLeave) {
  private requireFundingSelection = "YES";
  private requireFundingOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];

  async loadFundingRequestData(): Promise<void> {
    await FinancialDetails.loadIFPData();
  }

  public async mounted(): Promise<void> {
    console.log("mounted");
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>
