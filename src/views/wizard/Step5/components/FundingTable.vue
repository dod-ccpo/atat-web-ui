<template>
  <div class="review-table">
    <v-card class="ma-1 width-95 height-100 mb-10">
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
          <v-icon aria-hidden="true" class="icon-16 text-decoration-none mr-1"
            >edit</v-icon
          >
          <span class="text-decoration-underline body-lg">Edit</span>
        </v-btn>
      </v-card-title>
      <v-card-subtitle class="d-flex justify-space-between px-6">
        <span class="body-lg text--base font-size-15">
          Uploaded file: {{ taskOrderFile.name }}
        </span>
      </v-card-subtitle>
      <v-card-text class="pa-0">
        <v-simple-table>
          <template v-slot:default>
            <thead class="bg-base-lightest">
              <tr>
                <th id="clin_number">CLIN #</th>
                <th id="clin_type">CLIN type</th>
                <th id="description">Description(IDIQ CLIN)</th>
                <th id="PoP">Period of Performance</th>
                <th id="clin_value">CLIN Value</th>
                <th id="obligated_funds">Obligated Funds</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="index">
                <td>
                  {{ item.clin_number }}
                </td>
                <td>Option</td>
                <td>
                  {{ item.idiq_clin }}
                </td>
                <td>
                  {{ formatDate(item.pop_start_date) }} -
                  {{ formatDate(item.pop_end_date) }}
                </td>
                <td>
                  {{ formatCurrency(item.total_clin_value) }}
                </td>
                <td>
                  {{ formatCurrency(item.obligated_funds) }}
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
import { TaskOrderModel, TaskOrderFile } from "../../../../../types/Wizard";

@Component({})
export default class FundingTable extends Vue {
  @Prop({ default: {} }) private data!: TaskOrderModel;
  @Prop({ default: "" }) private name!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: {} }) private taskOrderFile!: TaskOrderFile;

  private onEdit() {
    this.$store.dispatch("wizard/editTaskOrder", this.id);
    this.$store.dispatch("wizard/setReturnToReview", true);
    this.$store.dispatch("wizard/editTaskOrder", this.id);
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
