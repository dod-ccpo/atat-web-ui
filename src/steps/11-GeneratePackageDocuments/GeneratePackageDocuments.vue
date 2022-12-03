<template>
  <v-form ref="form" lazy-validation>

    <v-container class="container-max-width">
      <v-row>
        <v-col cols="12">
          <GeneratingDocuments v-if="isGenerating"/>
          <ReviewDocuments 
            v-if="!isGenerating"
            @regenerate="regeneratePackage()"
          />
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
import GeneratingDocuments from "./components/GeneratingDocuments.vue";
import ReviewDocuments from "./components/ReviewDocuments.vue";

@Component({
  components: {
    GeneratingDocuments,
    ReviewDocuments
  }
})
export default class GeneratingPackageDocuments extends Mixins(SaveOnLeave) {

  private isGenerating = false;

  private packageDocuments = [];

  @Watch('isGenerating')
  public toggleNavigation(): void {
    let el = document.getElementById('stepperNavigation');
    
    if(el)
      el.hidden = this.isGenerating;
  }

  async regeneratePackage(): Promise<void>{
    this.isGenerating = true;
    await this.generateDocuments();
  }

  async generateDocuments(): Promise<void> {
    // Stubbed out for now
    setTimeout(() => {
      this.isGenerating = false;
    }, 5000);
  }

  public async mounted(): Promise<void> {
    this.isGenerating = true;
    if(this.packageDocuments.length === 0)
      this.generateDocuments();
  }

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}
</script>