<template>
  <div>
    <v-row v-for="(clin, index) in _clins" :key="index">
      <clins-card
        style="width: 830px !important"
        ref="clinscard"
        :card_number="index + 1"
        :clin_number.sync="clin.clin_number"
        :idiq_clin.sync="clin.idiq_clin"
        :total_clin_value.sync="clin.total_clin_value"
        :obligated_funds.sync="clin.obligated_funds"
        :pop_start_date.sync="clin.pop_start_date"
        :pop_end_date.sync="clin.pop_end_date"
        :validateOnLoad="validateOnLoad && !isClinCardNew(clin)"
        @delete="(cardNumber) => $emit('delete', cardNumber)"
        @add="() => $emit('add')"
      >
      </clins-card>
    </v-row>

    <v-btn
      id="addClinButton"
      class="link-button font-weight-bold no-border mt-3 px=-2 no-focus-shift"
      :ripple="false"
      @click="$emit('add')"
    >
      <v-icon color="primary" class="mr-2">control_point</v-icon>
      <span>{{ addClinLabel }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Clin } from "types/Portfolios";
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ClinsCard from "./ClinsCard.vue";

@Component({
  components: {
    ClinsCard,
  },
})
export default class ClinsCardList extends Vue {
  @PropSync("clins", { required: true }) _clins!: Clin[];
  @Prop({ default: false }) private validateOnLoad!: boolean;
  private isValidated = true;
  private addClinLabel = "Add another CLIN";

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

  private isClinCardNew(clin: Clin): boolean {
    return Object.values(clin).every((attrib) => attrib === "" || attrib === 0);
  }

  get clinLength(): number {
    const clins = this.$refs.clinscard as Array<ClinsCard>;
    return clins ? clins.length : 0;
  }

  public ExpandAddedClin(isPageLoad: boolean): void {
    this.ExpandClin(this._clins.length, isPageLoad);
  }

  public ExpandClin(index: number, isPageLoad: boolean): void {
    this.$nextTick(() => {
      if (this._clins.length >= index) {
        const clins = this.$refs.clinscard as Array<ClinsCard>;
        const clin = clins[index - 1];
        clin.open(isPageLoad);
      }
    });
  }
}
</script>
