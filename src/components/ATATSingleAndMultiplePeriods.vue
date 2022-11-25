<template>
  <fieldset class="no-border">
    <template v-if="!isMultiple">
      <ATATTextField
        id="SingleAmount"
        :label="singlePeriodLabel"
        width="190"
        class="mr-2"
        :alignRight="true"
        :value.sync="_values[0]"
        :isCurrency="textboxSuffix === ''"
        :appendText="textboxSuffix !== '' ? textboxSuffix : null"
        :tooltipText="showSinglePeriodTooltip ? singlePeriodTooltipText : null"
        :showErrorMessages="true"
        :rules="[
          $validators.required(
            'Enter you estimated price per period.',
          ),
        ]"
      />
    </template>
    <template v-if="isMultiple">
      <div
        v-for="(period, idx) in _periods"
        :key="idx"
        :class="[
          idx < _periods.length - 1 ? 'pb-5' : '',
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
            :label="multiplePeriodLabel"
            width="190"
            class="ml-5"
            :alignRight="true"
            :value.sync="_values[idx]"
            :isCurrency="textboxSuffix === ''"
            :appendText="textboxSuffix !== '' ? textboxSuffix : null"
            :tooltipText="showMultiplePeriodTooltip ? multiplePeriodTooltipText : null"
            :showErrorMessages="true"
            :rules="[
              $validators.required(
                'Enter you estimated price for this period.',
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
import { PeriodDTO } from "@/api/models";

@Component({
  components: {
    ATATTextField
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

  @PropSync("periods", {default: []}) private _periods: PeriodDTO[];
  @PropSync("values", {default: [""]}) private _values: string[];

  public sanitizeValue(idx: number, val: string): void {
    if (parseInt(val) === 0) {
      this._values[idx] = "";
    }
  }

  public getOption(idx: number): string {
    return idx === 0 ? "Base" : "Option " + idx;
  }
    
}
</script>