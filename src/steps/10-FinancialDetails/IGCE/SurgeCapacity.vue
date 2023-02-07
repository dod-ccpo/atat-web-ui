<template>
  <v-form ref="form" lazy-validation>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Do you want to include surge capacity within the scope of your
          contract?
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            The Government may require surge capabilities during the base or any
            option period. By selecting “Yes” below, surge requirements will be
            within scope of the resultant task order and will be reflected in
            the total estimated price of your IGCE.
          </p>
        </div>
        <ATATRadioGroup
          id="SurgeCapacity"
          class="max-width-640"
          :value.sync="capabilities"
          :items="items"
          name="surge-capacity"
          card="true"
          :rules="[$validators.required('Please select an option for your surge capacity.')]"
        >
        </ATATRadioGroup>
      </v-col>
    </v-row>
  </v-container>
</v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCEStore from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import {RequirementsCostEstimateDTO} from "@/api/models";
import {YesNo} from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class SurgeCapacity extends Mixins(SaveOnLeave) {
  public capacity: number | null = null;
  public capabilities: YesNo = "";
  private items = [
    {
      id: "YES",
      label: "Yes. My project may require surge capabilities in the future.",
      value: "YES",
    },
    {
      id: "NO",
      label: "No.",
      value: "NO",
    },
  ];

  get currentData(): RequirementsCostEstimateDTO["surge_requirements"] {
    return{
      capacity: this.capacity,
      capabilities: this.capabilities
    }
  }

  private savedData: RequirementsCostEstimateDTO["surge_requirements"] = {
    capacity: null,
    capabilities: ""
  };

   @Watch("capabilities")
  protected changeSelection(): void {
    if (this.capabilities !== "YES") {
      this.capacity = null;
    }
  }
  
   private hasChanged(): boolean {
     return hasChanges(this.currentData, this.savedData);
   }

   public async loadOnEnter(): Promise<void> {
     const store = await IGCEStore.getRequirementsCostEstimate();
     this.savedData = store.surge_requirements;
     this.capabilities = store.surge_requirements.capabilities;
     this.capacity = store.surge_requirements.capacity as number;
   }

   public async mounted(): Promise<void> {
     await this.loadOnEnter();
   }

   protected async saveOnLeave(): Promise<boolean> {
     if (this.hasChanged()) {
       const store = await IGCEStore.getRequirementsCostEstimate();
       store.surge_requirements = this.currentData;
       await IGCEStore.setRequirementsCostEstimate(store);
       await IGCEStore.saveRequirementsCostEstimate();
     }
     return true;
   }

}
</script>

