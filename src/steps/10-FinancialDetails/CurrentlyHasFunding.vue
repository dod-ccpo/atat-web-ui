<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you currently have funding for your acquisition package?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-7">
              Your Contracting Office may require an interagency agreement (e.g., Fiscal Service
              Form 7600A/General Terms & Conditions (GT&C) agreement) and/or a funding request
              (e.g., Fiscal Service Form 7600B or Military Interdepartmental Purchase Request
              (MIPR)) to procure cloud service offerings from JWCC on your agency’s behalf.
            </p>
            <ATATRadioGroup
                :card="true"
                :items="radioButtonItems"
                :rules="[$validators.required('Please select an option.')]"
                :value="selectedHasFunding"
                @update:value="selectedHasFunding = $event"
                class="max-width-640 mb-5"
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
import { RadioButton } from "../../../types/Global";
import { hasChanges } from "@/helpers";
import FinancialDetails from "@/store/financialDetails";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {isDitcoUser} from "@/store/acquisitionPackage";
import {routeNames} from "@/router/stepper";
import Steps from "@/store/steps";

@Component({
  mixins: [SaveOnLeave],
  components: {
    ATATRadioGroup
  }
})

class CurrentlyHasFunding extends Vue {
  private selectedHasFunding = "";
  private radioButtonItems: RadioButton[] = [
    {
      id: "HasFundingCheckbox",
      label: "Yes. I have a GT&C, as well as a FS Form 7600B or MIPR.",
      value: "HAS_FUNDING"
    },
    {
      id: "NoFundingCheckbox",
      label:
          "No. I need to obtain funding documents.<br/>" +
          "We’ll generate a draft of your package to submit to your financial office next.",
      value: "NO_FUNDING",
    }
  ];
  private savedData = "";

  private get currentData(): string {
    return this.selectedHasFunding;
  };

  public async loadOnEnter(): Promise<void> {
    await FinancialDetails.loadFundingRequirement();
    this.selectedHasFunding = FinancialDetails.fundingRequirement?.has_funding || "";
    this.savedData = FinancialDetails.fundingRequirement?.has_funding || "";
  };

  public async mounted(): Promise<void> {
    this.addNavigation();
    await this.loadOnEnter();
  };

  private addNavigation() {
    const from = 
      [routeNames.GeneratingPackageDocumentsFunding, routeNames.GTC, routeNames.RFD]
    const displayCurrentlyHasFunding = from.some(page => page == Steps.prevStepName)
    if (!isDitcoUser() && !displayCurrentlyHasFunding) {
      this.$router.push({
        name: routeNames.RFD,
      })
    }
  }


  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await FinancialDetails.setHasFunding(this.selectedHasFunding);
        await FinancialDetails.saveFundingRequirement();
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

export default toNative(CurrentlyHasFunding)
</script>
