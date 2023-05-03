<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Did you use G-Invoicing for your funding request?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            If you select "Yes" below, then we will verify a few details and sync 
            your funding request with this effort. Otherwise, you can manually 
            upload forms from your computer. 
            <a
              role="button"
              id="GInvoicingLearnMore"
              class="_text-link"
              tabindex="0"
              @click="openSlideoutPanel"
              @keydown.enter="openSlideoutPanel"
              @keydown.space="openSlideoutPanel"
            >
              Learn more about G-Invoicing
            </a>
          </p>
          <ATATRadioGroup
            class="max-width-640"
            id="GInvoicingOptions"
            :card="true"
            :items="gInvoicingOptions"
            :value.sync="useGInvoicing"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>
        <div v-show="useGInvoicing === 'YES'">
          <hr class="mt-5" />
            <ATATSearch
              id="OrderNumber"
              placeHolder="Find your order in G-Invoicing"
              label="Order Number"
              tooltipText="This is a 20-character value (including hyphens) generated 
                by G-Invoicing. You may also enter 22 characters (including a period 
                and digit at the end) to reference the version number. Your Order Number
                is located in the top section of <strong>your FS Form 7600A</strong>"
              :hideHelpTextOnError="true"
              :validate-on-blur="true"
              :value.sync="gInvoiceNumber"
              helpText="Format: OYYMM-000-000-000000"
              searchType="G-Invoicing"

              :rules="[
                $validators.isMaskValid(
                  ['O[0-9]{4}\-[0-9]{3}-[0-9]{3}-[0-9]{6}(\.[0-9])?$'],
                  `Your order number should be 20 or 22 characters (including hyphens
                    and periods) and use the format:<ul>
                    <li>OYYMM-000-000-000000</li>
                    <li>OYYMM-000-000-000000.0 (with version number)</li></ul>`,
                  true
                )
              ]"
            />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import GInvoiceLearnMore from "@/steps/10-FinancialDetails/GInvoiceLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

import { 
  baseGInvoiceData, 
  RadioButton, 
  SlideoutPanelContent 
} from "../../../types/Global";
import FinancialDetails from "@/store/financialDetails";

import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
    ATATSearch,
    GInvoiceLearnMore,
  },
})
export default class GInvoicing extends Mixins(SaveOnLeave) {

  public useGInvoicing = "";
  public gInvoiceNumber = "";

  private gInvoicingOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes. My General Terms &amp; Conditions (GT&amp;C) and Order are in G-Invoicing.",
      value: "YES",
    },
    {
      id: "No",
      label: "No. I would like to upload my 7600A and 7600B forms.",
      value: "NO",
    }
  ];  

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public get currentData(): baseGInvoiceData {
    return {
      useGInvoicing: this.useGInvoicing,
      gInvoiceNumber: this.gInvoiceNumber,
    }
  }
  
  public savedData: baseGInvoiceData = {
    useGInvoicing: "",
    gInvoiceNumber: "",
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: GInvoiceLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await FinancialDetails.loadFundingRequestFSForm();
    const storeData = FinancialDetails.gInvoicingData;
    if (storeData) {
      this.useGInvoicing = storeData.useGInvoicing;
      this.gInvoiceNumber = storeData.gInvoiceNumber;
      this.savedData = {
        useGInvoicing: this.useGInvoicing,
        gInvoiceNumber: this.gInvoiceNumber,
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        if (this.currentData.useGInvoicing === "NO") {
          this.currentData.gInvoiceNumber = "";
        }
        await FinancialDetails.saveGInvoiceData(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

}
</script>
