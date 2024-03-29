<template>
  <div class="container-max-width">
    <h1 v-if="currentUserIsMissionOwner">
      Ready to submit your acquisition package?
    </h1>
    <h1 v-else>
      Your acquisition package is ready to submit!
    </h1>
    <div class="d-flex mt-3 mb-10">
      <div class="copy-max-width">
        <div v-if="currentUserIsMissionOwner">
          <p class="font-size-20 font-weight-500 mb-3" style="line-height: 1.6;">
            Great news! We have everything ready to send your package to DITCO for processing.
          </p>
          <p class="mt-2 mb-10">
            Upon submission, a Contracting Specialist will review your documents and
            contact you if any changes are required. You’ll continue to have access
            to your completed documents within DAPPS.
          </p>

          <div  class="border1 _border-rounded-more border-base-lighter pa-6 bg-primary-lighter">
            <ATATCheckboxGroup
              id="CertifiedCheckbox"
              aria-describedby="CertifiedCheckbox"
              :value="certified"
              @update:value="certified = $event"
              :items="checkboxItem"
              :boldText="true"
              :card="false"
            />
            <ol class="ml-6">
              <li class="pb-3">
                All information in my package is accurate and complete to the best of my knowledge.
              </li>
              <li>
                All documents requiring certification have been signed and uploaded.
              </li>
            </ol>
          </div>
        </div>

        <div v-else class="mb-10">
          <p> 
            We have notified <strong>{{ missionOwnerName }}</strong> that this package 
            is complete and ready to be submitted to DITCO for processing. You’ll 
            continue to have access to your completed documents within DAPPS. Nothing 
            further is needed from you at this time.
          </p>
          <ATATSVGIcon
            width="680" height="466" name="underReview" color="primary"
          />
        </div>

      </div>
      <CompletePackageCard />
      

    </div>
    <LateFormAlert class="mt-5"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, toNative } from "vue-facing-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import LateFormAlert from "@/portfolios/portfolio/LateFormAlert.vue";
import CompletePackageCard 
  from "@/steps/11-GeneratePackageDocuments/components/CompletePackageCard.vue"
import { User } from "types/Global";

@Component({
  components: {
    CompletePackageCard,
    ATATCheckboxGroup,
    ATATSVGIcon,
    LateFormAlert
  }
})

class ReadyToSubmit extends Vue {
  public currentUserIsMissionOwner = AcquisitionPackage.currentUserIsMissionOwner;
  public get missionOwner(): User {
    return AcquisitionPackage.getPackageMissionOwner;
  }
  public get missionOwnerName(): string {
    return this.missionOwner.fullName as string;
  }

  private certified = [];
  private checkboxItem = [
    {
      id: "Programming",
      label: "By submitting this acquisition, I certify that:",
      value: "true",
    },
  ]

  @Watch('certified')
  public async certifiedChecked(): Promise<void>{
    acquisitionPackage.setDisableContinue(this.certified.length === 0);
  }

  public async loadOnEnter(): Promise<void> {
    await acquisitionPackage.setCurrentUser();
    this.currentUserIsMissionOwner = AcquisitionPackage.currentUserIsMissionOwner;
    await acquisitionPackage.setDisableContinue(true);
  }
  
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}

export default toNative(ReadyToSubmit)
</script>

