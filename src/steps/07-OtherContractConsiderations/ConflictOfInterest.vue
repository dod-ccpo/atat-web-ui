<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Is there a potential Conflict of Interest (COI)?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              An organizational COI is a situation where, because of other relationships
              or activities, a person or company is potentially unable to render impartial 
              assistance or advice to the government, cannot objectively perform contract
              work, or has an unfair competitive advantage. Notification of a potential COI
              will be provided within the Description of Work to the CSPs to address,
              as applicable, when responding to a solicitation.
              <a
                role="button"
                id="CoILearnMore"
                class="_text-link"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel">
                Learn more about COI.
              </a>
            </p>
            <ATATRadioGroup
              ref="COIOptions"
              class="copy-max-width max-width-760"
              id="COIOptions"
              :card="true"
              :items="conflictOfInterestOptions"
              :value="hasConflict"
              @update:value="hasConflict = $event"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <div v-if="hasConflict === 'YES'">
            <hr class="mt-5" />
            <ATATTextArea
              id="Explanation"
              label="Please provide an explanation of your conflict of interest."
              class="width-100"
              :rows="7"
              :rules="[
                $validators.required(
                  'Please provide an explanation of your COI.'
                ),
                $validators.maxLength(
                  1600,
                  'Please limit your description to 1600 characters or less'
                ),
              ]"
              :value="explanation"
              @update:value="explanation = $event"
              maxChars="1600"
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
import { hasChanges } from "@/helpers";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import CoILearnMore from "./CoILearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";
import { RadioButton, SaveOnLeaveRefs, SlideoutPanelContent } from "../../../types/Global";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ContractConsiderationsDTO } from "@/api/models";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
    CoILearnMore,
  },
})
class ConflictOfInterest extends Vue {

  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  private explanation 
    = AcquisitionPackage.contractConsiderations?.conflict_of_interest_explanation || "";
  private savedData: ContractConsiderationsDTO = {};
  private hasConflict 
    = AcquisitionPackage.contractConsiderations?.potential_conflict_of_interest || "";
  private conflictOfInterestOptions: RadioButton[] = [
    {
      id: "Yes",
      label: `Yes. There is a potential COI that may influence which CSP should 
        be awarded this task order.`,
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public get currentData(): ContractConsiderationsDTO {
    return {
      potential_conflict_of_interest: this.hasConflict || "",
      conflict_of_interest_explanation: this.explanation,
      acquisition_package:AcquisitionPackage.packageId
    };
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CoILearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ContractConsiderationsDTO>({
      storeProperty: StoreProperties.ContractConsiderations
    });
    if (storeData) {
      this.savedData = {
        potential_conflict_of_interest: storeData.potential_conflict_of_interest || "",
        conflict_of_interest_explanation : storeData.conflict_of_interest_explanation || "",
      }
    }
  }

  public isChanged(): boolean {
    return hasChanges(this.savedData, this.currentData);
  }

  @Watch('hasConflict')
  private onHasConflictChanged(value: string):void {
    if(value ===  "NO"){
      this.explanation = "";
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.isChanged()) {
        await AcquisitionPackage.saveData({
          data: this.currentData,
          storeProperty: StoreProperties.ContractConsiderations,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}

export default toNative(ConflictOfInterest)
</script>
