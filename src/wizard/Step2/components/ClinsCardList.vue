<template>
  <v-container fluid>
    <v-row v-for="(clin, index) in _clins" :key="clin.clin_number">
      <clins-card
        :card_number="index + 1"
        :clin_number.sync="clin.clin_number"
        :idiq_clin.sync="clin.idiq_clin"
        :total_clin_value.sync="clin.total_clin_value"
        :obligated_funds.sync="clin.obligated_funds"
        :pop_start_date.sync="clin.pop_start_date"
        :pop_end_date.sync="clin.pop_end_date"
      ></clins-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { CLIN } from "types/Wizard";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ClinsCard from "./ClinsCard.vue";

@Component({
  components: {
    ClinsCard,
  },
})
export default class ClinsCardList extends Vue {
  @PropSync("clins", { required: true }) _clins!: CLIN[];
}
</script>
