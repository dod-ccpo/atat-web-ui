<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Will government equipment be furnished, provided or acquired under this acquisition?
          </h1>
          <div class="copy-max-width">
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="RecurringOptions"
              :card="true"
              :items="equipmentProvidedOptions"
              :value.sync="selectedEquipmentProvided"
            />
          </div>
          <ATATAlert v-if="isDISA" 
            type="info" :showIcon="true" 
            class="copy-max-width mt-16">
            <template v-slot:content>
              <p class="ma-0">
                As a DISA mission owner, your GFP must be reviewed and approved by the Workforce Services
                Directorate (WSD) Property Office. Once you are ready to submit your acquisition package, 
                we’ll take care of sending your GFP documents for review.
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import { RadioButton } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { GFEOverviewDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import store from "@/store";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert
  },
})

export default class WillGovtEquipBeFurnished extends Mixins(SaveOnLeave) {
  private selectedEquipmentProvided = "";

  private equipmentProvidedOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "Yes",
    },
    {
      id: "No",
      label: "No. GFP/GFE will NOT be furnished to the contractor.",
      value: "No",
    },
  ];

  public get isDISA(): boolean {
    return AcquisitionPackage.selectedServiceOrAgency.value?.toUpperCase() 
              === "DEFENSE_INFORMATION_SYSTEMS_AGENCY";
  }

  private get currentData(): GFEOverviewDTO {
    return {
      gfe_gfp_furnished: this.selectedEquipmentProvided,
    };
  }

  private get savedData(): GFEOverviewDTO {
    return {
      gfe_gfp_furnished: AcquisitionPackage.GFEOverview?.gfe_gfp_furnished || "",
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadGFEOverview();
    console.log(storeData)
    if (storeData) {
      this.selectedEquipmentProvided = storeData.gfe_gfp_furnished !== ""
        ? storeData.gfe_gfp_furnished === "true" ? "Yes" : "No"
        : ""
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveGFEOverview(this.currentData);
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
