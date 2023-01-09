<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s create an incremental funding plan for your base period
        </h1>
        <div class="copy-max-width">
          <p>
            To fund the award of this effort, your organization will need to
            provide an initial increment of funds to the Contracting Office. The
            remaining funds needed to fully fund your cost estimate for
            non-optional line items may be provided in subsequent increments. In
            the fields below, add funding increments and specify the projected
            date (on a fiscal year quarterly basis) for which funds will be
            provided. A projected funding schedule will be generated.
          </p>

          <div class="d-flex">
            <div style="width: 450px">
              <IncFundingPlanInitial></IncFundingPlanInitial>
              <hr class="my-6" />

              <transition-group name="funding-increments" tag="div">
                <div
                    v-for="(fundingIncrement, index) in fundingIncrementList"
                    :key="fundingIncrement.sys_id"
                    :id="'Increment' + index"
                    class="funding-increments-item">
                  <div class="mb-4">
                    <div class="d-flex justify-space-between align-center mb-4 position-relative">
                      <span class="d-block font-weight-500 text-base mr-4 ml-1 font-size-14">
                        {{ index + 1 }}
                      </span>

                      <ATATSelect
                          :id="'IncrementPeriod' + index"
                          :items="getFiscalQuarters(index)"
                          width="190"
                          :selectedValue.sync="selectedQuarters[index]"
                          class="mr-4"
                          :class="{
                          'customized-error-control error--text': index === outOfRangeIndex
                        }"
                          :showErrorMessages="false"
                          @selectValueChange="quarterChange"
                          :returnObject="true"
                      />
                      <ATATTextField
                          :id="'Amount' + index"
                          :ref="'Amount' + index"
                          :value.sync="fundingIncrement.amount"
                          :alignRight="true"
                          :isCurrency="true"
                          :showErrorMessages="false"
                          :validateOnBlur="false"
                          width="190"
                          class="mr-2"
                          :rules="[$validators.required('', true)]"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
            <IncFundingPlanBasePeriod :periods="periods">
            </IncFundingPlanBasePeriod>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import {Component, Mixins} from "vue-property-decorator";
import IncFundingPlanInitial from "./IncFundingPlanInitial.vue"
import IncFundingPlanOverUnder from "./IncFundingPlanOverUnder.vue"
import IncFundingPlanBasePeriod from "./IncFundingPlanBasePeriod.vue"
import SaveOnLeave from "@/mixins/saveOnLeave";
import {FundingIncrementDTO, FundingPlanDTO, PeriodDTO} from "@/api/models";
import Periods from "@/store/periods";
import IncrementalFunding from "@/store/financialDetails/incrementalFunding";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import _ from "lodash";
import {SelectData} from "../../../../types/Global";

@Component({
  components: {
    IncFundingPlanInitial,
    IncFundingPlanOverUnder,
    IncFundingPlanBasePeriod,
    ATATSelect,
    ATATTextField,
  },
})

/**
 * This component acts as a container for all the other incremental funding
 * components. Any data that is shared across at least 2 other components of
 * incremental funding, that data gets loaded by this component and gets passed.
 *
 * If a piece of data is only specific to a single component, that specific
 * component is responsible for loading its own data
 */
export default class IncFundingPlan extends Mixins(SaveOnLeave) {
  public periods: PeriodDTO[] = [];
  public fundingPlan!: FundingPlanDTO;
  public fundingIncrementList: FundingIncrementDTO[] = [];
  public fiscalQuarters: SelectData[] = [];

  private populateFiscalQuarters(): void {
    this.fiscalQuarters.push({
      text: "2nd QTR FY23"
    });
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }

  public async loadOnEnter(): Promise<void> {
    this.periods = await Periods.loadPeriods();
    await IncrementalFunding.loadFundingPlanBaseYear();
    this.fundingPlan = _.cloneDeep(await IncrementalFunding.getFundingPlanBaseYear());
    await IncrementalFunding.loadFundingIncrementList();
    this.fundingIncrementList = _.cloneDeep(await IncrementalFunding.getFundingIncrementsList());
    this.populateFiscalQuarters();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
