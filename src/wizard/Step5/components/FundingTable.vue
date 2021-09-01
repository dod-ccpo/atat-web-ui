<template>
  <div class="review-table">
    <v-card class="mt-4" elevation="4" max-width="100%">
      <v-card-title class="d-flex justify-space-between">
        <span class="h4 justify-center">Task Order #{{ name }}</span>
      </v-card-title>
      <v-card-subtitle class="d-flex justify-space-between">
        <v-btn class="pa-0 primary--text" text small :ripple="false">
          <span class="link-body-md">{{ name }}</span
          ><v-icon small class="ml-2 icon-20">launch</v-icon></v-btn
        >

        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 h6 primary--text"
          :ripple="false"
          @click="handleClicked(name)"
        >
          <v-icon x-small class="text-decoration-none mr-1">edit</v-icon>
          <span class="text-decoration-underline">Edit</span>
        </v-btn>
      </v-card-subtitle>
      <v-card-text class="pa-0">
        <v-simple-table class="pb-2">
          <template v-slot:default>
            <thead class="bg-base-lightest">
              <tr>
                <th id="clin_number">
                  <span
                    class="
                      pl-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    CLIN #
                  </span>
                </th>
                <th id="clin_type">
                  <span
                    class="text-left text--base-dark label font-weight-black"
                  >
                    CLIN type
                  </span>
                </th>
                <th id="description">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Description(IDIQ CLIN)
                  </span>
                </th>
                <th id="PoP">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Period of Performance
                  </span>
                </th>
                <th id="clin_value">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    CLIN Value
                  </span>
                </th>
                <th id="obligated_funds">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Obligated Funds
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.clin_number">
                <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">
                  <div class="d-flex flex-column">
                    <span class="table-item font-weight-bold">
                      {{ item.clin_number }}
                    </span>
                  </div>
                </td>
                <td class="pa-4" style="vertical-align: top">
                  <span class="table-item d-flex flex-column"> Option </span>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    {{ item.idiq_clin }}
                  </span>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    {{ item.pop_start_date }} - {{ item.pop_end_date }}
                  </span>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    {{ formatCurrency(item.total_clin_value) }}
                  </span>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    {{ formatCurrency(item.obligated_funds) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TaskOrderDetails } from "../../../../types/Wizard";

@Component({})
export default class FundingTable extends Vue {
  @Prop({ default: {} }) private data!: TaskOrderDetails;
  @Prop({ default: "" }) private name!: string;

  private handleClicked(name: string) {
    this.$router.push({ name: "editfunding", params: { id: `${name}` } });
  }
  public formatCurrency(value: number): string {
    return this.formatter.format(value);
  }
  private formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
</script>
