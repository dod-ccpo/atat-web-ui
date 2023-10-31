<template>
  <v-form ref="form" lazy-validation>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          What type of funding document will you use for this acquisition?
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            To complete this section and proceed with submittal of your requirement, 
            you must have a certified funding document to transfer funds to your Contracting
            Office. We recommend using Government Invoicing (G-Invoicing) to generate your 7600A
            and 7600B, but you will also be able to upload form(s) directly from your computer.
            <a id="LearnMoreFunding"
                role="button"
                tabindex="0"
                @click="openSlideoutPanel($event, 'Funding')"
                @keydown.enter="openSlideoutPanel($event, 'Funding')"
                @keydown.space="openSlideoutPanel($event, 'Funding')">
              <span class="">Learn more about funding requests</span>
            </a>
          </p>
          <ATATRadioGroup
            id="FundingTypesRadioGroup"
            :card="true"
            :items="radioButtonItems"
            :rules="[$validators.required('Please select a type of funding request.')]"
            :value.sync="selectedFundingTypes"
            class="max-width-640 mb-5"
            name="radioButton-card"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Vue, toNative } from "vue-facing-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import { RadioButton, SlideoutPanelContent } from "../../../types/Global";
import FundingRequestLearnMore from "@/steps/10-FinancialDetails/FundingRequestLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import GInvoiceLearnMore from "@/steps/10-FinancialDetails/GInvoiceLearnMore.vue";
import { hasChanges } from "@/helpers";
import FinancialDetails from "@/store/financialDetails";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  mixins: [SaveOnLeave],
  components: {
    ATATRadioGroup,
    ATATExpandableLink,
    FundingRequestLearnMore,
    GInvoiceLearnMore,
  },
})

class FundingPlanType extends Vue {
  private selectedFundingTypes = "";
  private radioButtonItems: RadioButton[] = [
    {
      id: "FSFCheckbox",
      label: "Fiscal Service Form 7600B",
      value: "FS_FORM",
      description: `Import your Order from G-Invoicing or manually upload your completed form.
        <v-chip class="v-chip v-chip--label theme--light v-size--default bg-info-dark
        mr-2"><span class="v-chip__content">Recommended</span></v-chip>`
    },
    {
      id: "MIPRCheckbox",
      label: "Military Interdepartmental Purchase Request (MIPR)",
      value: "MIPR",
      description: "Manually upload your completed DD Form 448.",
    }
  ];
  private savedData ="";

  private get currentData(): string {
    return this.selectedFundingTypes;
  };

  public async openSlideoutPanel(e: Event, panelType: string): Promise<void> {
    const component = panelType === "Ginvoice" ? GInvoiceLearnMore : FundingRequestLearnMore;
    const panelContent: SlideoutPanelContent = {
      component,
      title: "Learn More",
    }
    SlideoutPanel.setSlideoutPanelComponent(panelContent);

    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };

  public async loadOnEnter(): Promise<void> {
    await FinancialDetails.loadFundingRequest();
    this.selectedFundingTypes = FinancialDetails.fundingRequestType || "";
    this.savedData = FinancialDetails.fundingRequestType || "";
  };

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: FundingRequestLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);

    await this.loadOnEnter();
  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {                                       
        await FinancialDetails.saveFundingRequestType(this.currentData || "");
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  };

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  };
};

export default FundingPlanType
</script>
