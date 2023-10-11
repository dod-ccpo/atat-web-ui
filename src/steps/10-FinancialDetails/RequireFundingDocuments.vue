<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Does your Contracting Office require funding documents for
            submission of your acquisition package?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Your Contracting Office may require an interagency agreement
              and/or a funding request to procure JWCC cloud resources or
              support services on your agency’s behalf (e.g., Fiscal Service
              Forms 7600A/B or Military Interdepartmental Purchase Request
              (MIPR)).
            </p>
          </div>
          <div style="max-width: 180px">
            <ATATRadioGroup
              :card="true"
              class="max-width-640"
              id="GInvoicingOptions"
              :items="requireFundingOptions"
              :value.sync="requireFundingSelection"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { RadioButton } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class RequireFundingDocuments extends Mixins(SaveOnLeave) {
  private savedRequireFundingSelected = "";
  private requireFundingSelection = "";
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

  public async loadOnEnter(): Promise<void> {
    this.savedRequireFundingSelected =
      AcquisitionPackage.acquisitionPackage
        ?.contracting_shop_require_funding_documents_for_submission_of_package ||
      "";
    this.requireFundingSelection = this.savedRequireFundingSelected;
  }

  public async mounted(): Promise<void> {
    this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      AcquisitionPackage.setContractingShopRequireFundingDocuments(
        this.requireFundingSelection
      );
    }
    return true;
  }

  private hasChanged(): boolean {
    return this.requireFundingSelection !== this.savedRequireFundingSelected;
  }
}
</script>
