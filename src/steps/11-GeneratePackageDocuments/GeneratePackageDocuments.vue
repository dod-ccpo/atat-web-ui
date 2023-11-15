<template>
  <v-form ref="form" lazy-validation>

    <v-container class="container-max-width">
      <v-row>
        <v-col cols="12">
          <div v-if="packageDocComponent">
            <component 
              :is="packageDocComponent" 
              :isErrored="isErrored"
              :isGenerating="isGenerating"
              @update:isGenerating="isGenerating = $event"
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
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";
import { From, SaveOnLeaveRefs, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import GeneratingDocuments from "./components/GeneratingDocuments.vue";
import ReviewDocuments from "./components/ReviewDocuments.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

@Component({
  components: {
    GeneratingDocuments,
    ReviewDocuments
  }
})
class GeneratingPackageDocuments extends Vue {

  $refs!: SaveOnLeaveRefs
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, form: this.$refs.form, nextTick: this.$nextTick,
    }).catch(() => false)
  }

  public isGenerating = false;
  private isErrored = false;
  private docJobStatus = "" ;

  public packageDocComponent: (typeof Vue) = 
    this.$route?.query.direction === "next"
      ? GeneratingDocuments
      : ReviewDocuments

  get isDitco():boolean {
    return AcquisitionPackage.acquisitionPackage?.contracting_shop ==="DITCO"
  }
  
  @Watch("isGenerating")
  public watchIsGenerating(generateDocs: boolean): void{
    if (generateDocs){
      this.displayGeneratingDocumentsComponent();
    }
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
    this.packageDocComponent = GeneratingDocuments;
    await this.getStatus();
  }
 
  public async getStatus(): Promise<void> {
    const intervalId = window.setInterval(() => checkDocJobStatus(), 3000);

    const checkDocJobStatus = (async ()=> {
      await this.getDocJobStatus();
      ["SUCCESS", "FAILURE"].some(
        (status)=>{
          if (status === this.docJobStatus.toUpperCase()){
            clearInterval(intervalId);
            this.displayReviewComponent();
          }
        }
      )
    });
  }

  public displayReviewComponent(): void{
    this.isGenerating = false;
    this.toggleNavigationElements(false)
    this.packageDocComponent = ReviewDocuments;
    this.isErrored = this.docJobStatus.toUpperCase() === "FAILED";
  }

  public async getDocJobStatus(): Promise<void> {
    this.docJobStatus = await AcquisitionPackage.getDocGenStatus(
      AcquisitionPackage.packageId.toUpperCase() || "")
  } 

  public async mounted(): Promise<void> {
    await this.getDocJobStatus();
    if (this.$route?.query.direction === "next"){
      await this.displayGeneratingDocumentsComponent();
    } else {
      await this.displayReviewComponent();
    }
  }

  public async saveOnLeave(): Promise<boolean> {
    this.isGenerating = false; //to restore bottom navigation
    await AcquisitionPackage.setValidateNow(true);
    if(this.isDitco){
      await AcquisitionPackageSummary.updateAcquisitionPackageStatus({
        acquisitionPackageSysId: AcquisitionPackage.packageId,
        newStatus: "WAITING_FOR_SIGNATURES"
      })
    }
    return true;
  }
}

export default toNative(GeneratingPackageDocuments)
</script>
