<template>
  <fieldset class="no-border">
    
    <template v-if="!isMultiple">
      <div class="d-flex align-center mb-2">
        <label class="form-field-label font-weight-400 mr-1">
          {{ singlePeriodLabel}} 
         </label>
      <ATATTooltip 
        v-if="!isMultiple && showSinglePeriodTooltip"
        :tooltipText="singlePeriodTooltipText"
      />
     
    </div>
      <ATATTextField
        id="SingleAmount"
        width="190"
        class="mr-2"
        type="number"
        :alignRight="true"
        :value.sync="_values[0]"
        :isCurrency="textboxSuffix === ''"
        :appendText="textboxSuffix !== '' ? textboxSuffix : null"
        :tooltipText="showSinglePeriodTooltip ? singlePeriodTooltipText : null"
        :showErrorMessages="true"
        :rules="[
          $validators.required(
            'Enter your estimated price per period.',
          ),
        ]"
      />
    </template>
    <template v-if="isMultiple">
      <div class="d-flex align-center mb-4">
        <label class="form-field-label font-weight-500 mr-1">
          {{ multiplePeriodLabel}} 
        </label>
        <ATATTooltip 
          v-if="isMultiple && showMultiplePeriodTooltip"
          :tooltipText="multiplePeriodTooltipText"
        />
      </div>
      <div
        v-for="(period, idx) in periods"
        :key="idx"
        class="font-weight-500 font-size-14 text-base"
        :class="[
          idx < periods.length - 1 ? 'pb-5' : '',
          ' pl-2 d-flex align-start',
        ]"
        style="border-left: #544496 4px solid"
      >
        <div class="text-right mt-2" style="width: 75px">
          {{ getOption(idx) }}
        </div>
        <div>
          <ATATTextField
            :id="period.period_type"
            type="number"
            width="190"
            class="ml-5"
            :alignRight="true"
            :value.sync="_values[idx]"
            :isCurrency="textboxSuffix === ''"
            :appendText="textboxSuffix !== '' ? textboxSuffix : null"
            :showErrorMessages="true"
            :rules="[
              $validators.required(
                'Enter your estimated price for this period.',
              ),
            ]"
          />
        </div>
      </div>
    </template>
  </fieldset>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import { PeriodDTO } from "@/api/models";

@Component({
  components: {
    ATATTextField,
    ATATTooltip
  }
})
export default class ATATSingleAndMultiplePeriods extends Vue {
  @Prop({default: false}) private isMultiple?: boolean;
  @Prop({default: true}) private showSinglePeriodTooltip?: boolean;
  @Prop({default: false}) private showMultiplePeriodTooltip?: boolean;
  @Prop({default: "Estimated price per period"}) private singlePeriodLabel?: string;
  @Prop({default: "Estimated price per period"}) private multiplePeriodLabel?: string;
  @Prop({default: ''}) private textboxSuffix?: string;
  @Prop({default: "Default Single Textbox Tooltip"}) private singlePeriodTooltipText?: string;
  @Prop({default: "Default Multiple Textbox Tooltip"}) private multiplePeriodTooltipText?: string;
  @Prop() private periods!: PeriodDTO[];

  @PropSync("values", {default: () => []}) private _values!: string[];

  @Watch("isMultiple")
  public isMultipleChanged(newValue: boolean): void {
    if (!newValue) {
      this._values.length = 1;
    }
  }
  public getOption(idx: number): string {
    return idx === 0 ? "Base" : "Option " + idx;
  }

}
</script>
