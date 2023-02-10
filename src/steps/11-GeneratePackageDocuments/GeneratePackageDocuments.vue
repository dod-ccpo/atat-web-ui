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
              @regenerate="generateDocuments()"            
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
import GeneratingDocuments from "./components/GeneratingDocuments.vue";
import ReviewDocuments from "./components/ReviewDocuments.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import acquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    GeneratingDocuments,
    ReviewDocuments
  }
})
export default class GeneratingPackageDocuments extends Mixins(SaveOnLeave) {

  public isGenerating = true;
  private isErrored = false;
  private docJobStatus = "" ;

  public packageDocComponent = GeneratingDocuments;
  get isDitco():boolean {
    return AcquisitionPackage.acquisitionPackage?.contracting_shop ==="DITCO"
  }
  
  @Watch("isGenerating")
  public watchIsGenerating(generateDocs: boolean): void{
    if (generateDocs){
      this.generateDocuments();
    }

    this.toggleNavigation(generateDocs);
  }


  public toggleNavigation(value: boolean): void {
    (document.getElementById('stepperNavigation') as HTMLElement).hidden = value;
    (document.getElementsByTagName('footer'))[0].hidden = value;
  }

  async generateDocuments(): Promise<void>{
    await AcquisitionPackage.saveDocGenStatus('IN_PROGRESS')
    this.isErrored = false;
    this.isGenerating = true;
    this.toggleNavigation(true);
    this.packageDocComponent = GeneratingDocuments;
    await this.getStatus();
  }
 
  public async getStatus(): Promise<void> {
    const intervalId = setInterval(() => checkDocJobStatus(), 3000);

    const checkDocJobStatus: unknown = (async ()=> {
      await this.getDocJobStatus();
      ["COMPLETE", "FAILED"].some(
        (status)=>{
          if (status === this.docJobStatus.toUpperCase()){
            clearInterval(intervalId);
            this.isGenerating = false;
            this.toggleNavigation(false)
            this.packageDocComponent = ReviewDocuments;
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
    await this.generateDocuments();
    this.isGenerating = true;
  }

  public async saveOnLeave(): Promise<boolean> {
    this.isGenerating = false; //to restore bottom navigation
    await AcquisitionPackage.setValidateNow(true);
    if(this.isDitco){
      await AcquisitionPackageSummary.updateAcquisitionPackageStatus({
        acquisitionPackageSysId: AcquisitionPackage.acquisitionPackage?.sys_id||"",
        newStatus: "WAITING_FOR_SIGNATURES"
      })
    }
    return true;
  }
}
</script>
