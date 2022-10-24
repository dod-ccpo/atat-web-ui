<template>
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
          :value.sync="currentData.capacity"
          :items="items"
          name="surge-capacity"
          card="true"
          :rules="[$validators.required('Please select an option for your surge capacity.')]"
        >
        </ATATRadioGroup>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCEStore, { SurgeRequirements } from "@/store/IGCE";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class SurgeCapacity extends Mixins(SaveOnLeave) {
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

  private currentData: SurgeRequirements = {
    capacity: "",
    capabilities: ""
  }

  private savedData: SurgeRequirements = {
    capacity: "",
    capabilities: ""
  };
  
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await IGCEStore.getSurgeRequirements();
    if (storeData) {
      this.savedData = storeData;
      this.currentData = storeData;
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      await IGCEStore.setSurgeRequirements(this.currentData);
    }
    return true;
  }

}
</script>

