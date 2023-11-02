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
          <div style="max-width: 240px">
            <ATATRadioGroup
              :card="true"
           
              id="GInvoicingOptions"
              :items="requireFundingOptions"
              :value="requireFundingSelection"
              @update:value="requireFundingSelection = $event"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { RadioButton } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  mixins: [SaveOnLeave],
  components: {
    ATATRadioGroup,
  },
})
class RequireFundingDocuments extends Vue {
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
    await AcquisitionPackage.setValidateNow(true);
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setContractingShopRequireFundingDocuments(
          this.requireFundingSelection
        );
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  private hasChanged(): boolean {
    return this.requireFundingSelection !== this.savedRequireFundingSelected;
  }
}

export default toNative(RequireFundingDocuments)
</script>
