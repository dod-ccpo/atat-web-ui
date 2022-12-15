<template>
  <v-form ref="form" lazy-validation>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you require a cross-domain solution (CDS)?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              In the next section, we will dive into the types of resources, tools, and services
              that you need for this acquisition. The classification level(s) that you select below
              will be applied to any performance requirements that you specify. If you need more
              than one level, we will walk you through what is required within each level later.
            </p>
           <AnticipatedDurationandUsage
            typeForUsage="cds"
            typeForDuration="requirement"
            :anticipatedNeedUsage.sync="domainInfo.classificationInstance.anticipatedNeedUsage"
            :entireDuration.sync="domainInfo.classificationInstance.entireDuration"
            :selectedPeriods.sync="domainInfo.classificationInstance.selectedPeriods"
            :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
            :isPeriodsDataMissing="isPeriodsDataMissing"
            index="0"
           />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
  </v-form>
</template>
<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import SaveOnLeave from "@/mixins/saveOnLeave";

import { Component, Mixins } from "vue-property-decorator";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
import {
  Checkbox,
  CrossDomainSolution,
  DOWClassificationInstance,
} from "../../../types/Global";
import { createPeriodCheckboxItems } from "@/helpers";
import Periods from "@/store/periods";
@Component({
  components: {AnticipatedDurationandUsage}
})
export default class CrossDomain extends Mixins(LoadOnEnter, SaveOnLeave) {
  private isPeriodsDataMissing = false;
  private domainInfo: CrossDomainSolution = {
    isCrossDomain: "",
    solutionType:[{
      type: "",
      dataQuantity: 0
    }],
    projectedFileStream:"",
    classificationInstance: {
      sysId: "",
      impactLevel: "", // for sorting
      classificationLevelSysId: "",
      anticipatedNeedUsage: "",
      entireDuration: "",
      selectedPeriods: [],
      labelLong: "",
      labelShort: "",
    }
  }
  public availablePeriodCheckboxItems: Checkbox[] = [];
  protected async loadOnEnter(): Promise<boolean> {
    const periods = await Periods.loadPeriods();
    this.isPeriodsDataMissing = (periods && periods.length === 0);
    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
    return true;
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>

