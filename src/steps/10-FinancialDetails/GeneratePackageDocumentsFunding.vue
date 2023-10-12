<template>
  <v-form ref="form" lazy-validation>

    <v-container class="container-max-width">
      <v-row>
        <v-col cols="12">
          <div v-if="packageDocComponent">
            <component
                :is="packageDocComponent"
                :isErrored="isErrored"
                :isGenerating.sync="isGenerating"
                @regenerate="displayGeneratingDocumentsComponent()"
            />
          </div>
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
import GeneratingDocumentsFunding from "./components/GeneratingDocumentsFunding.vue";
import ReviewDocumentsFunding from "./components/ReviewDocumentsFunding.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

@Component({
  components: {
    GeneratingDocumentsFunding,
    ReviewDocumentsFunding
  }
})
export default class GeneratePackageDocumentsFunding extends Mixins(SaveOnLeave) {

  public isGenerating = false;
  private isErrored = false;
  private docJobStatus = "" ;

  public packageDocComponent: Vue.Component =
    this.$route.params.direction === "next"
      ? GeneratingDocumentsFunding
      : ReviewDocumentsFunding

  get isDitco(): boolean {
    return AcquisitionPackage.acquisitionPackage?.contracting_shop ==="DITCO"
  }

  @Watch("isGenerating")
  public watchIsGenerating(generateDocs: boolean): void{
    generateDocs ? this.displayGeneratingDocumentsComponent() : this.displayReviewComponent()
    this.toggleNavigationElements(generateDocs);
  }


  public toggleNavigationElements(value: boolean): void {
    (document.getElementById('stepperNavigation') as HTMLElement).hidden = value;
    (document.getElementsByTagName('footer'))[0].hidden = value;
  }

  async displayGeneratingDocumentsComponent(): Promise<void>{
    await AcquisitionPackage.saveDocGenStatus('IN_PROGRESS')
    this.isErrored = false;
    this.isGenerating = true;
    this.toggleNavigationElements(true);
    this.packageDocComponent = GeneratingDocumentsFunding;
    await this.getStatus();
  }

  public async getStatus(): Promise<void> {
    const checkDocJobStatus = (async ()=> {
      console.log("DocJobStatus checked")
      await this.getDocJobStatus();
      console.log("Status:", this.docJobStatus)
      if (this.docJobStatus.toUpperCase() === "SUCCESS"
          || this.docJobStatus.toUpperCase() === "FAILURE") {
        clearInterval(intervalId);
        this.displayReviewComponent();
      }
    });
    const intervalId = window.setInterval(checkDocJobStatus, 3000);
  }

  public displayReviewComponent(): void{
    this.isGenerating = false;
    this.toggleNavigationElements(false)
    this.packageDocComponent = ReviewDocumentsFunding;
    this.isErrored = this.docJobStatus.toUpperCase() === "FAILED";
  }

  public async getDocJobStatus(): Promise<void> {
    this.docJobStatus = await AcquisitionPackage.getDocGenStatus(
      AcquisitionPackage.packageId.toUpperCase() || "")
  }

  public async mounted(): Promise<void> {
    await this.getDocJobStatus();
    if (this.docJobStatus === "NOT_STARTED" || this.docJobStatus === "IN_PROGRESS") {
      await this.displayGeneratingDocumentsComponent();
    } else {
      this.displayReviewComponent();
    }
  }

  public async saveOnLeave(): Promise<boolean> {
    this.isGenerating = false; //to restore bottom navigation
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}
</script>