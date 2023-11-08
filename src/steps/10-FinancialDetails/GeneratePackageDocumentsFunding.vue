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
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import GeneratingDocumentsFunding from "./components/GeneratingDocumentsFunding.vue";
import ReviewDocumentsFunding from "./components/ReviewDocumentsFunding.vue";
import { From, SaveOnLeaveRefs, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    GeneratingDocumentsFunding,
    ReviewDocumentsFunding
  }
})

class GeneratePackageDocumentsFunding extends Vue {

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

  public packageDocComponent: (typeof Vue) | null = null;

  @Watch("isGenerating")
  public watchIsGenerating(generateDocs: boolean): void{
    generateDocs ? this.displayGeneratingDocumentsComponent() : this.displayReviewComponent();
    this.toggleNavigationElements(generateDocs);
  }


  public toggleNavigationElements(value: boolean): void {
    const stepperNavigation = document.getElementById('stepperNavigation');
    const footer = document.getElementsByTagName('footer')[0];

    if (stepperNavigation) {
      stepperNavigation.hidden = value;
    }

    if (footer) {
      footer.hidden = value;
    }
  }

  async displayGeneratingDocumentsComponent(): Promise<void>{
    await AcquisitionPackage.saveDocGenStatus('IN_PROGRESS');
    this.isErrored = false;
    this.isGenerating = true;
    this.toggleNavigationElements(true);
    this.packageDocComponent = GeneratingDocumentsFunding;
    await this.getStatus();
  }

  public async getStatus(): Promise<void> {
    const checkDocJobStatus = async () => {
      await this.getDocJobStatus();
      if (
        this.docJobStatus.toUpperCase() === "SUCCESS"
        || this.docJobStatus.toUpperCase() === "FAILURE"
      ) {
        clearInterval(intervalId);
        this.displayReviewComponent();
      }
    };

    const intervalId = window.setInterval(() => {
      checkDocJobStatus().catch((err) => {
        console.error('Error checking dock job status:', err);
        clearInterval(intervalId);
      });
    }, 3000);
  }

  public displayReviewComponent(): void {
    this.isGenerating = false;
    this.toggleNavigationElements(false);
    this.packageDocComponent = ReviewDocumentsFunding;
    this.isErrored = this.docJobStatus.toUpperCase() === "FAILED";
  }

  public async getDocJobStatus(): Promise<void> {
    this.docJobStatus = await AcquisitionPackage.getDocGenStatus(
      AcquisitionPackage.packageId.toUpperCase() || "");
  }

  public async determineComponent() {
    await this.getDocJobStatus();
    if (this.docJobStatus === "NOT_STARTED" || this.docJobStatus === "IN_PROGRESS") {
      await this.displayGeneratingDocumentsComponent();
    } else {
      this.displayReviewComponent();
    }
  }

  public async mounted(): Promise<void> {
    this.packageDocComponent =  this.$route.query.direction !== "previous"
      ? GeneratingDocumentsFunding
      : ReviewDocumentsFunding;
    await this.determineComponent();
  }

  public async saveOnLeave(): Promise<boolean> {
    this.isGenerating = false; // restores bottom navigation
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}

export default toNative(GeneratePackageDocumentsFunding)
</script>