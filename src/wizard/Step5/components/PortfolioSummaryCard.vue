<template>
  <summary-card :title="portfolio.name">
    <template slot="summary-description">
      <p class="body-lg width-80 word-break-normal">
        {{ portfolio.description }}
      </p>
    </template>

    <template slot="summary-body">
      <div
        class="body-lg d-flex justify-start black--text grouped-items"
        v-for="(item, idx) in items"
        :key="idx"
      >
        <div class="mx-3">
          <strong>{{ item.prefix }}</strong>
        </div>
        <div class="">
          {{ item.value }}
        </div>
      </div>
    </template>
  </summary-card>
</template>

<script lang="ts">
import { Portfolio } from "types/Portfolios";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SummaryCard from "./SummaryCard.vue";

@Component({})
export default class PortfolioSummaryCard extends SummaryCard {
  @Prop({ default: null, required: true })
  private portfolio!: Portfolio;

  private items: Record<string, unknown>[] = new Array<
    Record<string, unknown>
  >();

  public created(): void {
    this.$nextTick(() => {
      this.items.push({
        prefix: "Funded by",
        value: this.portfolio.dod_component.join(","),
      });

      this.items.push({
        prefix: "Deploy to",
        value: this.portfolio.csp_provisioning_status,
      });
    });
  }
}
</script>
