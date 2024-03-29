<template>
<div>
  <ATATTextArea
    :value="_anticipatedNeedUsage"
    @update:value="_anticipatedNeedUsage = $event"
    :id="'AnticipatedNeedUsage_' + ((index as number) + 1)"
    :ref="'AnticipatedNeedUsage_' + ((index as number) + 1)"
    :label="label"
    :helpText="usageHelpText"
    class="width-100 mb-10 max-width-740"
    :rows="5"
    :maxChars="maxCharCount"
    :rules="[
      $validators.required('Provide your statement of objective.'),
      $validators.maxLength(maxCharCount as unknown as number,
       'Description is to be ' + maxCharCount + ' characters or less.')
    ]"
  />
  <div>
    <ATATRadioGroup
      class="copy-max-width mb-10 mt-0"
      :id="'EntireDuration_' + ((index as number) + 1)"
      :ref="'EntireDuration_' + ((index as number) + 1)"
      :legend="durationLabel ||
        `Do you need this ${typeForDuration} for the entire duration of your task order?`"
      :items="entireDurationOptions"
      :value="_entireDuration"
      @update:value="_entireDuration = $event"
      :tooltipText="durationToolTip"
      :rules="[
        $validators.required(
          'Please select an option.'
        )
      ]"
    />
    <div v-if="_entireDuration === 'NO'">
      <p :id="'PeriodsLabel_' + ((index as number) + 1)" class="_checkbox-group-label">
        In which base and/or option periods do you need this {{ typeForDuration }}?
      </p>
      <ATATCheckboxGroup
        :id="'PeriodsCheckboxes_' + ((index as number) + 1)"
        :aria-describedby="'PeriodsLabel_' + ((index as number) + 1)"
        :ref="'PeriodsCheckboxes_' + ((index as number) + 1)"
        :value="_selectedPeriods"
        @update:value="_selectedPeriods = $event"
        :items="availablePeriodCheckboxItems"
        :card="false"
        :disabled="isPeriodsDataMissing"
        :rules="periodCheckboxRules"
        class="copy-max-width"
        :validateOnLoad="true"
      />
      <ATATAlert
        :ref="'PeriodRequirementsAlert_' + ((index as number) + 1)"
        :id="'PeriodRequirementsAlert_' + ((index as number) + 1)"
        v-if="isPeriodsDataMissing === true"
        type="warning"
        class="copy-max-width mb-10"
      >
        <template v-slot:content>
          <p class="mb-0" :id="'PeriodIntro_' + ((index as number) + 1)">
            Your period of performance details are missing. To select specific base or
            option periods for this {{ typeForDuration }},
            <router-link
              :id="'ContractDetailsLink_' + ((index as number) + 1)"
              :to="{ name: routeNames.PeriodOfPerformance }"
            >revisit the Contract Details section
            </router-link>
          </p>
        </template>
      </ATATAlert>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, toNative } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom"
import ATATTextArea from "@/components/ATATTextArea.vue";
import {
  Checkbox,
  RadioButton,
  ValidationRule
} from "../../../types/Global";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import {routeNames} from "@/router/stepper";

@Component({
  components: {
    ATATTextArea,
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert,
  }
})

class AnticipatedDurationandUsage extends Vue {
  @PropSync("anticipatedNeedUsage") public _anticipatedNeedUsage!: string;
  @PropSync("entireDuration")public _entireDuration!: string;
  @PropSync("selectedPeriods")public _selectedPeriods!: string[]; 
  
  @Prop() private index!: string | number;
  @Prop({required: true}) private typeForUsage!: string;
  @Prop({required: true}) private typeForDuration!: string;
  @Prop({default: `Statement of objectives for the anticipated 
    need or usage`}) private label?: string;
  @Prop({default: ""}) private durationLabel?: string;
  @Prop({default: "800"}) private maxCharCount?: string;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];

  public routeNames = routeNames;
  public periodCheckboxRules: ValidationRule[] = [];
  public entireDurationOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "YES",
    },
    {
      id: "No",
      label: "No",
      value: "NO",
    },
  ];

  // when user selects "YES", remove periods from needed array.
  // when user selects "NO", pre-select base period
  @Watch("_entireDuration")
  public entireDurationChanged(newVal: string): void {
    if (this.availablePeriodCheckboxItems.length>0){
      this._selectedPeriods = newVal === "NO" && this.availablePeriodCheckboxItems[0].value !== "" 
        ? [this.availablePeriodCheckboxItems[0].value]
        : [];
    }

    this.periodCheckboxRules = newVal === "NO" 
      ? [this.$validators.required('Please select at least one base or option period.')]
      : [];
  }

  public get usageHelpText(): string {
    let firstSentence = "";
    switch(this.typeForUsage) {
    case "service":
      firstSentence = `Use vendor-neutral language to describe the desired outcome 
        (purpose and usage) of the expected services.`;
      break;
    case "training":
      firstSentence = `Use vendor-neutral language to describe the purpose of 
        the expected training.`;
      break;
    case "requirement":
      firstSentence = `Use vendor-neutral language to describe the purpose and usage 
        of the expected tools and capabilities.`;
      break;
    case "instance":
      firstSentence = `Use vendor-neutral language.`;
      break;
    case "cds":
      firstSentence = `Use vendor-neutral language to describe the purpose and usage.`;
      break;
    }

    const secondSentence = `Provide a functional description of the requirement without 
    including any company names or vendor-unique brand, product, or titles.`;
    return firstSentence + " " + secondSentence;
  }

  public get durationToolTip(): string {
    return `Performance period details will be used to generate a cost estimate for
    this ${this.typeForDuration} later.`;
  }

}
export default toNative(AnticipatedDurationandUsage)
</script>
