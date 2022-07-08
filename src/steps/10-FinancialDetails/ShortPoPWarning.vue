<!--<template>-->

<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from "vue";-->
<!--import { routeNames } from "../../router/stepper";-->

<!--import { Component } from "vue-property-decorator";-->
<!--import ATATAlert from "@/components/ATATAlert.vue";-->
<!--import Periods from "@/store/periods";-->
<!--import { PeriodDTO } from "@/api/models";-->
<!--import { SlideoutPanelContent } from "../../../types/Global";-->
<!--import PopLearnMore from "@/steps/04-ContractDetails/PopLearnMore.vue";-->

<!--@Component({-->
<!--  components: {-->
<!--    ATATAlert-->
<!--  }-->
<!--})-->

<!--export default class ShortPoPWarning extends Vue {-->
<!--  private routeNames = routeNames;-->
<!--  private basePeriod: PeriodDTO[] = []-->

<!--  public async loadOnEnter(): Promise<void> {-->
<!--    const periods = await Periods.loadPeriods();-->
<!--    this.basePeriod = periods.map(period=> {-->

<!--      return {-->
<!--        /* eslint-disable camelcase */-->
<!--        option_order: period.option_order,-->
<!--        period_unit_count: period.period_unit_count,-->
<!--        period_unit: period.period_unit,-->
<!--        period_type: period.period_type,-->
<!--        sys_id: period.sys_id,-->
<!--      }-->
<!--    });-->
<!--  }-->
<!--  public async mounted(): Promise<void> {-->
<!--    await this.loadOnEnter();-->
<!--  }-->
<!--}-->
<!--</script>-->
