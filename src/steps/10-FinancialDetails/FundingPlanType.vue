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
              <a role="button" id="LearnMoreFunding" @click="openSlideoutPanel">
                <span class="">Learn more about funding requests</span>
              </a>
            </p>
            <ATATRadioGroup
              id="FundingTypesRadioGroup"
              :card="true"
              :items="radioButtonItems"
              :value.sync="selectedFundingTypes"
              class="max-width-640 mb-7"
              name="radioButton-card"
              :rules="[$validators.required('Please select an option')]"
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
                  <a>
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
import { Component, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import { RadioButton, SlideoutPanelContent } from "../../../types/Global";
import vue from "vue";
import FundingRequestLearnMore from "@/steps/10-FinancialDetails/FundingRequestLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

@Component({
  components: {
    ATATRadioGroup,
    ATATExpandableLink,
    FundingRequestLearnMore,
  },
})

export default class FundingPlanType extends vue {
  private firmFixedPriceSelected = "";
  private timeAndMaterialsSelected = "";

  private selectedFundingTypes = "";
  private justification = "";
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

  @Watch("selectedContractTypes")
  protected selectedContractTypesChanged(newSelections: string[]): void {
    this.firmFixedPriceSelected = newSelections.indexOf("FFP") > -1 ? "true" : "false";
    this.timeAndMaterialsSelected = newSelections.indexOf("T&M") > -1 ? "true" : "false";
  }

  @Watch("timeAndMaterialsSelected")
  protected selectedTMChanged(newVal: string): void {
    if (newVal === "false") {
      this.justification = "";
    }
  }
  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: FundingRequestLearnMore,
      title: "Learn More",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }
}
</script>
