<template>
  <v-row>
    <v-col>
      <div class="d-flex">
        <div class="ml-10 width-100">
          <div class="bg-primary-lighter width-100 border-rounded-more pa-6">
            <div class="d-flex">
              <div class="pr-5">
                <ATATSVGIcon
                    name="calendar"
                    :width="34"
                    :height="37"
                    color="primary"
                />
              </div>
              <div>
                <span id="PeriodLength" class="h3">
                  Base period length: {{ periodLengthStr }}
                </span>
                <p class="mb-0">
                  Your funding plan may not exceed this period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {Component, Prop, Watch} from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import {PeriodDTO} from "@/api/models";
import Vue from "vue";

@Component({
  components: {
    ATATSVGIcon
  },
})
export default class IncFundingPlanBasePeriod extends Vue {
  @Prop({ default: [] }) private periods!: PeriodDTO[];
  periodLengthStr = "";

  /**
   * Using the @periods passed into this component,  constructs the period length string.
   */
  @Watch("periods") // since periods get loaded asynchronously by parent, watch is needed.
  public async constructPeriodLength(): Promise<void> {
    const basePeriod = this.periods.find((p) => p.period_type === "BASE");
    if (basePeriod) {
      const unitCount: number = parseInt(basePeriod.period_unit_count);
      let unit = basePeriod.period_unit.toLowerCase();
      this.periodLengthStr = unitCount + " " + (unitCount > 1 ? unit + "s" : unit);
    }
  }
}
</script>
