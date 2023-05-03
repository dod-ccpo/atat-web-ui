<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Now let’s see if you need a Market Research Report (MRR)
          </h1>
          <p>
            There is a signed MRR that applies to all task orders issued
            under the JWCC Contract, except for those acquisitions with an
            exception to fair opportunity. This means that your final acquisition
            package will require a Sole Source MRR, unless one of the following
            contract actions applies to this effort.
          </p>
          <ATATRadioGroup
              id="MRRNeed"
              legend="Do any of the following contract actions apply to this acquisition?"
              tooltipText="DISA does not require MRRs for undefinitized contract actions (UCAs),
              bridge contract actions, or FAR 52.217-8 Option to Extend Services."
              :value.sync="selectedMRRNeed"
              :items="mrrNeedOptions"
              name="fair-opportunity-exceptions-radio-group"
              class="copy-max-width mb-10 mt-3"
              :rules="[$validators.required('Please select an option')]"
          />
          <ATATAlert
              v-if="selectedMRRNeed !== ''"
              id="MRRNeedInfoAlert"
              :type="mrrNeedInfoAlertType"
              :showIcon="false"
              class="copy-max-width my-10"
          >
            <template v-slot:content>
              <p v-if="displayNotNoneAlert">
                Based on your contract action, your final acquisition package does NOT
                require a Sole Source MRR.
              </p>
              <p v-if="displayNoneApplyAlert">
                Your final acquisition package will require a
                <strong>
                  Sole Source MRR.
                </strong>
                We’ll help you complete all of your required documentation.
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import {RadioButton} from "../../../../types/Global";
import ATATAlert from "@/components/ATATAlert.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {FairOpportunityDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATRadioGroup
  }
})

export default class MRRNeed extends Mixins(SaveOnLeave) {
  private selectedMRRNeed = "";
  private mrrNeedOptions: RadioButton[] = [
    {
      id: "UndefinitizedContractAction",
      label: `Undefinitized contract action (UCA)`,
      value: "1" // TODO
    },
    {
      id: "BridgeContractAction",
      label: `Bridge contract action`,
      value: "2" // TODO
    },
    {
      id: "OptionToExtend",
      label: `Option to Extend Services (<a href="https://www.acquisition.gov/far/52.217-8"
        id="OptionToExtendLink" class="_external-link" target="_blank">FAR 52.217-8</a>)`,
      value: "3" // TODO
    },
    {
      id: "NoneApply",
      label: "None of these contract actions apply to this acquisition",
      value: "NO_NONE" // TODO
    },
  ];

  public get displayNotNoneAlert(): boolean {
    return this.selectedMRRNeed === "1"
        || this.selectedMRRNeed === "2"
        || this.selectedMRRNeed === "3";
  }

  public get displayNoneApplyAlert(): boolean {
    return this.selectedMRRNeed === "NO_NONE";
  }

  public get mrrNeedInfoAlertType(): string {
    return this.displayNotNoneAlert ? "info" : "warning";
  }

  private get currentData(): FairOpportunityDTO {
    return {
      exception_to_fair_opportunity: this.selectedMRRNeed // TODO
    };
  }

  private get savedData(): FairOpportunityDTO {
    return {
      exception_to_fair_opportunity: AcquisitionPackage // TODO
        .fairOpportunity?.exception_to_fair_opportunity || "" // TODO
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.fairOpportunity;
    if (storeData) {
      this.selectedMRRNeed = storeData.exception_to_fair_opportunity as string; // TODO
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
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
