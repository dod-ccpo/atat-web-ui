<template>
  <div class="d-flex align-start">
    <v-card class="v-card ma-9 px-2 ml-0 body">
      <v-card-title>
        <div class="width-100 d-flex justify-space-between align-center">
          <h3>{{ portfolio.name }}</h3>
          <v-btn
            class="py-0 px-2 primary--text"
            text
            small
            @click="onEdit()"
            :ripple="false"
            aria-label="Edit portfolio details"
            role="link"
            ><v-icon aria-hidden="true" small class="icon-12 mr-1">edit</v-icon>
            <span class="link-body-md">Edit</span></v-btn
          >
        </div>
        <p class="body-lg width-80 word-break-normal">
          {{ portfolio.description }}
        </p>
      </v-card-title>
      <v-card-text class="body-lg text--base-darkest">
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Portfolio } from "types/Portfolios";
import Component from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";
import SummaryCard from "./SummaryCard.vue";
import dodComponents from "../../../data/dodComponents";

@Component({
  components: {
    SummaryCard,
  },
})
export default class PortfolioSummaryCard extends Vue {
  @Prop({ required: true })
  private portfolio!: Portfolio;

  private dataItems: Record<string, unknown>[] = new Array<
    Record<string, unknown>
  >();

  public created(): void {
    this.$nextTick(() => {
      const selectedDodComponents = this.portfolio.dod_components
        .map((comp) => {
          const component = dodComponents.find((c) => c.value === comp);
          return component?.name;
        })
        .join(", ");

      this.dataItems.push({
        prefix: "Funded by",
        value: selectedDodComponents,
      });

      this.dataItems.push({
        prefix: "Deploy to",
        value: this.portfolio.csp,
      });
    });
  }

  public onEdit(): void {
    this.$router.push({
      name: "addportfolio",
      params: { id: `${this.portfolio.id}` },
    });
  }
}
</script>
