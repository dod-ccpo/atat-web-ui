<template>
  <div class="review-table">
    <v-card class="ml-4 mt-4 width-95 height-100 mb-10" elevation="4">
      <v-card-title class="d-flex justify-space-between">
        <span class="h3 justify-center">Task Order #{{ name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 h5 primary--text"
          :ripple="false"
          :aria-label="'Edit Task Order ' + name"
          role="link"
          @click="onEdit()"
        >
          <v-icon aria-hidden="true" class="icon-16 text-decoration-none mr-1">edit</v-icon>
          <span class="text-decoration-underline body-lg">Edit</span>
        </v-btn>
      </v-card-title>
      <v-card-subtitle class="d-flex justify-space-between">
        <span class="body-lg text--base font-size-15">
          Uploaded file: {{ taskOrderFile.name }}
        </span>
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
              <tr v-for="(item, index) in data" :key="index">
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
                    {{ formatDate(item.pop_start_date) }} -
                    {{ formatDate(item.pop_end_date) }}
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
import moment from "moment";
import { TaskOrderModel, TaskOrderFile } from "../../../../types/Wizard";

@Component({})
export default class FundingTable extends Vue {
  @Prop({ default: {} }) private data!: TaskOrderModel;
  @Prop({ default: "" }) private name!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: {} }) private taskOrderFile!: TaskOrderFile;

  private onEdit() {
    this.$store.dispatch("editTaskOrder", this.id);
    this.$router.push({ name: "editfunding", params: { id: `${this.id}` } });
  }
  public formatDate(value: string): string {
    return moment(value).format("l");
  }
  public formatCurrency(value: string | number): string {
    const amount =
      typeof value === "string" ? Number(value.replace(",", "")) : value;
    return this.formatter.format(amount);
  }
  private formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
</script>
