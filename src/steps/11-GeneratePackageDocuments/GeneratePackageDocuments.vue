<template>
  <v-form ref="form" lazy-validation>

    <v-container class="container-max-width">
      <v-row>
        <v-col cols="12">
          <GeneratingDocuments v-if="isGenerating"/>
          <ReviewDocuments 
            v-if="docsAreReady"
            :isErrored="isErrored"
            @regenerate="generateDocuments()"
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

  private isGenerating = true;
  public docsAreReady = false;
  private isErrored = false;
  private docJobStatus = "" ;
  private packageDocuments = [];
  
  @Watch('isGenerating')
  public toggleNavigation(): void {
    let el = document.getElementById('stepperNavigation');
    if(el) { el.hidden = this.isGenerating; }
  }

  async generateDocuments(): Promise<void>{
    await AcquisitionPackage.saveDocGenStatus('IN_PROGRESS')
    this.isErrored = false;
    this.isGenerating = true;
    this.getStatus();
  }
 
  public async getStatus(): Promise<void> {
    const intervalId = setInterval(() => checkDocJobStatus(), 3000);

    const checkDocJobStatus: unknown = (async ()=> {
      await this.getDocJobStatus();
      ["COMPLETE", "FAILED"].some(
        (status)=>{
          console.log(intervalId)
          if (status === this.docJobStatus.toUpperCase()){
            clearInterval(intervalId);
            this.isGenerating = false;
            this.docsAreReady = true;
            this.isErrored = status === "FAILED";
          }
        }
      )
    });
  }

  public async getDocJobStatus(): Promise<void> {
    this.docJobStatus = await AcquisitionPackage.getDocGenStatus(
        AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "")
  } 

  public async mounted(): Promise<void> {
    await this.getDocJobStatus();
    this.generateDocuments();
  }

  public async saveOnLeave(): Promise<boolean> {
    this.isGenerating = false; //to restore bottom navigation
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}
</script>