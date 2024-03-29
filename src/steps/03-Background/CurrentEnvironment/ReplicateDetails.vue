<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us more about your requirements to {{ replicateOrOptimize }} your environment
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-6">
              Use vendor-neutral language in your responses. This will be added 
              to your Description of Work, so avoid including any company names 
              or vendor-unique brand, product, or titles that could impact full 
              and open competition.
            </p>

            <ATATTextArea 
              id="Statement"
              ref="StatementRef"
              class="textarea-max-width mb-10"
              :value="currEnvDTO.statement_replicated_optimized"
              @update:value="currEnvDTO.statement_replicated_optimized = $event"
              label="Provide a detailed statement identifying the outcomes and 
                objectives for this requirement"
              :helpText="'Include any information that would help a CSP to ' 
                + replicateOrOptimize + ' this environment using JWCC offerings.'"
              :maxChars="800"
              :rules="[$validators.required('Enter a description for your requirement.')]"
            />

            <ATATRadioGroup 
              id="GrowthOptions"
              ref="GrowthOptionsRef"
              class="mb-8"
              legend="Do you anticipate additional growth?"
              :card="false"
              :items="additionalGrowthOptions"
              :value="currEnvDTO.additional_growth"
              @update:value="currEnvDTO.additional_growth = $event"
              :rules="[$validators.required('Please select an option.')]"
            />

            <ATATTextField 
              v-if="currEnvDTO.additional_growth === 'YES'"
              id="CapacityPercentage"
              ref="CapacityPercentageRef"
              class="mb-8"
              :width="120"
              label="What percentage of additional capacity do you anticipate each year?"
              suffix="%"
              type="number"
              :value="currEnvDTO.anticipated_yearly_additional_capacity"
              @update:value="currEnvDTO.anticipated_yearly_additional_capacity = $event"
              :rules="[$validators.required('Enter a percentage for your anticipated growth.')]"
            />

            <ATATRadioGroup 
              id="PhasedOptions"
              ref="PhasedOptionsRef"
              class="mb-8"
              :legend="'Do you need a phased approach for ' + replicatingOrOptimizing
                + ' your current functions?'"
              :card="false"
              :items="phasedApproachOptions"
              :value="currEnvDTO.has_phased_approach"
              @update:value="currEnvDTO.has_phased_approach = $event"
              :rules="[$validators.required('Please select an option.')]"
             />

            <ATATTextArea 
              v-if="currEnvDTO.has_phased_approach === 'YES'"
              id="PhasedApproachSchedule"
              ref="PhasedApproachScheduleRef"
              class="textarea-max-width mb-10"
              :value="currEnvDTO.phased_approach_schedule"
              @update:value="currEnvDTO.phased_approach_schedule = $event"
              label="What is your schedule for this phased approach?"
              :maxChars="500"
              :rules="[$validators.required('Enter details about your phased approach schedule.')]"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { RadioButton, SaveOnLeaveRefs } from "types/Global";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
  }
})

class ReplicateDetails extends Vue {

    
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public currEnvDTO = defaultCurrentEnvironment;
  public replicateOrOptimize = "";
  public replicatingOrOptimizing = "";
  public additionalGrowthOptions: RadioButton[] = [
    {
      id: "YesGrowth",
      value: "YES",
      label: "Yes.",
    },
    {
      id: "NoGrowth",
      value: "NO",
      label: "No.",
    },
  ];

  public phasedApproachOptions: RadioButton[] = [
    {
      id: "YesPhased",
      value: "YES",
      label: "Yes.",
    },
    {
      id: "NoPhased",
      value: "NO",
      label: "No.",
    },
  ];

  @Watch("currEnvDTO", {deep: true})
  public currEnvDTOUpdate(newVal: Record<string, string | number | null>): void {
    if (newVal.additional_growth === "NO") {
      // eslint-disable-next-line camelcase
      this.currEnvDTO.anticipated_yearly_additional_capacity = null;
    }
    if (newVal.has_phased_approach === "NO") {
      // eslint-disable-next-line camelcase
      this.currEnvDTO.phased_approach_schedule = "";
    }
  }

  public get currentData(): Record<string, string | number | null> {
    return {
      statement: this.currEnvDTO.statement_replicated_optimized,
      additionalGrowth: this.currEnvDTO.additional_growth,
      yearlyCapacity: this.currEnvDTO.anticipated_yearly_additional_capacity,
      phasedApproach: this.currEnvDTO.has_phased_approach,
      phasedSchedule: this.currEnvDTO.phased_approach_schedule,
    }
  };

  public savedData: Record<string, string | number | null> = {
    statement: "",
    additionalGrowth: "",
    yearlyCapacity: null,
    phasedApproach: "",
    phasedSchedule: "",
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
      this.savedData = {
        statement: storeData.statement_replicated_optimized,
        additionalGrowth: storeData.additional_growth,
        yearlyCapacity: storeData.anticipated_yearly_additional_capacity,
        phasedApproach: storeData.has_phased_approach,
        phasedSchedule: storeData.phased_approach_schedule,
      }
      this.replicateOrOptimize 
        = this.currEnvDTO.current_environment_replicated_optimized === "YES_REPLICATE"
          ? "replicate" : "optimize"
      this.replicatingOrOptimizing
        = this.currEnvDTO.current_environment_replicated_optimized === "YES_REPLICATE"
          ? "replicating" : "optimizing"
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

export default toNative(ReplicateDetails)
</script>
