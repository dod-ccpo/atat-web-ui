<template>
  <v-form ref="form" lazy-validation>

    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <GeneratingDocuments v-if="isGenerating"/>
        </v-col>
      </v-row>
    </v-container>

  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import GeneratingDocuments from "./components/GeneratingDocuments.vue"

@Component({
  components: {
    GeneratingDocuments
  }
})
export default class GeneratePackageDocuments extends Mixins(SaveOnLeave) {

  private isGenerating = false;

  @Watch('isGenerating')
  public toggleNavigation(): void {
    let el = document.getElementById('stepperNavigation');
    
    if(el)
      el.hidden = this.isGenerating;
  }

  public async mounted(): Promise<void> {
    this.isGenerating = true;
  }

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}
</script>