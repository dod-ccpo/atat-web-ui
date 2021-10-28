<template>
  <v-container fluid>
    <v-row v-for="(clin, index) in _clins" :key="index">
      <clins-card
        style="width: 900px !important"
        ref="clinscard"
        :card_number="index + 1"
        :clin_number.sync="clin.clin_number"
        :idiq_clin.sync="clin.idiq_clin"
        :total_clin_value.sync="clin.total_clin_value"
        :obligated_funds.sync="clin.obligated_funds"
        :pop_start_date.sync="clin.pop_start_date"
        :pop_end_date.sync="clin.pop_end_date"
        @delete="(cardNumber) => $emit('delete', cardNumber)"
        @add="() => $emit('add')"
      ></clins-card>
    </v-row>
    <v-btn
      class="link-button font-weight-bold no-border mt-3 px=-2 no-focus-shift"
      :ripple="false"
      @click="$emit('add')"
    >
      <v-icon color="primary" class="mr-2">control_point</v-icon>
      Add another CLIN
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Clin } from "types/Portfolios";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ClinsCard from "./ClinsCard.vue";

@Component({
  components: {
    ClinsCard,
  },
})
export default class ClinsCardList extends Vue {
  @PropSync("clins", { required: true }) _clins!: Clin[];

  public async validate(): Promise<boolean> {
    let valid = false;
    const clins = this.$refs.clinscard as Array<ClinsCard>;

    if (!clins || clins.length === 0) {
      return false;
    }
    const allValid = clins.map((clin) => clin.validateForm());

    await Promise.all(allValid).then(
      (value) => (valid = value.every((v) => v))
    );

    return valid;
  }

  get clinLength(): number {
    const clins = this.$refs.clinscard as Array<ClinsCard>;
    return clins ? clins.length : 0;
  }

  public ExpandAddedClin(): void {
    this.ExpandClin(this._clins.length);
  }

  public ExpandClin(index: number): void {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this._clins.length >= index) {
          const clins = this.$refs.clinscard as Array<ClinsCard>;
          const clin = clins[index - 1];
          clin.open();
        }
      }, 500);
    });
  }
}
</script>
