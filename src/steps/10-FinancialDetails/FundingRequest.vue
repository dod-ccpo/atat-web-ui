<template>
  <div class="mb-7">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            What type of funding request did you use for this acquisition?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-10">
              To complete this section, you will need an authorized funding request to transfer
              funds from your agency to DITCO. We recommend using G-Invoicing to generate your 7600A
              and 7600B, but you will also be able to upload form(s) directly from your computer.
              <a id="LearnMoreFunding" role="button" @click="openSlideoutPanel($event, 'Funding')">
                <span class="">Learn more about funding requests</span>
              </a>
            </p>
            <ATATRadioGroup
              id="FundingTypesRadioGroup"
              :card="true"
              :items="radioButtonItems"
              :rules="[$validators.required('Please select an option')]"
              :value.sync="selectedFundingTypes"
              class="max-width-640 mb-7"
              name="radioButton-card"
            />
            <ATATExpandableLink aria-id="AboutMissingFundingRequest">
              <template v-slot:header>
                What if I don’t have a funding request yet?
              </template>
              <template v-slot:content>
                <p>
                  Every agency manages the transfer of funds differently, so we recommend contacting
                  your agency’s resource management division or financial department to determine
                  the best method for initiating a funding request.
                </p>
                <p>
                  G-Invoicing is the long-term solution for Federal Program Agencies (FPAs) to
                  manage their intragovernmental (IGT) Buy/Sell transactions. This is the preferred
                  system for generating and maintaining your GT&Cs and Orders with DITCO.
                  <a id="LearnMoreGInvoicing" role="button"
                     @click="openSlideoutPanel($event, 'Ginvoice')">
                    <span>Learn more about G-Invoicing</span>
                  </a>
                </p>
                <p>
                  However, until your agency migrates to G-Invoicing, we will still allow you to
                  upload forms that were generating using your agency’s Enterprise Resource Planning
                  (ERP) system.
                </p>
                <p>
                  Whether using G-Invoicing or your ERP, you must obtain a signature from your
                  authorized financial point of contact before you can proceed with this section.
                </p>
              </template>
            </ATATExpandableLink>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import { RadioButton, SlideoutPanelContent } from "../../../types/Global";
import FundingRequestLearnMore from "@/steps/10-FinancialDetails/FundingRequestLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import GInvoiceLearnMore from "@/steps/10-FinancialDetails/GInvoiceLearnMore.vue";
import { hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { FundingRequestDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import Vue from "vue";


@Component({
  components: {
    ATATRadioGroup,
    ATATExpandableLink,
    FundingRequestLearnMore,
    GInvoiceLearnMore,
  },
})

export default class FundingPlanType extends Mixins(SaveOnLeave) {
  private selectedFundingTypes = "";
  private radioButtonItems: RadioButton[] = [
    {
      id: "FSFCheckbox",
      label: "Fiscal Service Forms (7600A and 7600B)",
      value: "FSF",
      description: `Import from G-Invoicing or manually upload your completed forms.
        <div class='badge badge-blue d-inline-block mt-1'>Recommended</div>`
    },
    {
      id: "MIPRCheckbox",
      label: "Military Interdepartmental Purchase Request (MIPR)",
      value: "MIPR",
      description: "Manually upload your completed DD Form 448.",
    }
  ];
  private savedData: FundingRequestDTO = {
    fundingRequestType: "",
  };

  private get currentData(): FundingRequestDTO {
    return {
      fundingRequestType: this.selectedFundingTypes,
    };
  };


  public async openSlideoutPanel(e: Event, panelType: string): Promise<void> {
    if (panelType === "Ginvoice") {
      const gInvoice: SlideoutPanelContent = {
        component: GInvoiceLearnMore,
        title: "Learn More",
      };
      await SlideoutPanel.setSlideoutPanelComponent(gInvoice);
    } else {
      const funding: SlideoutPanelContent = {
        component: FundingRequestLearnMore,
        title: "Learn More",
      };
      await SlideoutPanel.setSlideoutPanelComponent(funding);
    }
    this.$nextTick(()=>{
      if (e && e.currentTarget) {
        const opener = e.currentTarget as HTMLElement;
        SlideoutPanel.openSlideoutPanel(opener.id);
      };
    });
  };

  public async loadOnEnter(): Promise<void> {
    this.selectedFundingTypes = await AcquisitionPackage.fundingRequestType || "";
    this.savedData.fundingRequestType = await AcquisitionPackage.fundingRequestType || "";
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        AcquisitionPackage.setFundingRequestType(this.currentData.fundingRequestType || "");
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
</script>
