<template>
  <summary-card :title="portfolio.name" editPlace="addportfolio">
    <template v-slot:summary-description>
      <p class="body-lg width-80 word-break-normal">
        {{ portfolio.description }}
      </p>
    </template>

    <template v-slot:summary-body>
      <div
        class="body-lg d-flex justify-start black--text grouped-items"
        v-for="(item, idx) in dataItems"
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
  @Prop({ required: true })
  private portfolio!: Portfolio;

  private dataItems: Record<string, unknown>[] = new Array<
    Record<string, unknown>
  >();

  public created(): void {
    this.$nextTick(() => {
      this.dataItems.push({
        prefix: "Funded by",
        value: this.portfolio.dod_component.join(","),
      });

      this.dataItems.push({
        prefix: "Deploy to",
        value: this.portfolio.csp_provisioning_status,
      });
    });
  }

  public onEdit(): void {
    debugger;
    this.$router.push({
      name: "addportfolio",
      params: { id: `${this.portfolio.id}` },
    });
  }
}
</script>
