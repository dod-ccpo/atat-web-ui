<template>
  <v-container fluid class="view-portfolio">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-3 h1 font-weight-bold">My Porfolios</h1>
      </v-col>
    </v-row>
    <v-row class="portfolio-banner">
      <v-col class="d-flex justify-space-between align-center">
        <div class="h3">My Portfolios</div>
        <div>
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            :ripple="false"
            to="/wizard"
          >
            Create a New Portfolio
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-if="portfolios">
        <portfolio-summary
          :portfolios="portfolios"
          v-on:delete="onDeletePortfolio"
        ></portfolio-summary>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Portfolio } from "types/Portfolios";
import PortfolioSummary from "./PortfolioSummary.vue";
import { TaskOrderDetails, TaskOrderFile } from "types/Wizard";

const apiUrl =
  "https://s63gzoj8bh.execute-api.us-gov-west-1.amazonaws.com/prod/";
const getDraftsUrl = (baseUrl: string) => `${baseUrl}/portfolioDrafts/`;
const deleteDraftUrl = (baseUrl: string, portfolioId: string) =>
  `${baseUrl}/portfolioDrafts/${portfolioId}`;

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class ViewPortfolio extends Vue {

  get portfolios(): Portfolio[] {
     return this.$store.state.portfolios;
  }
  // public portfolios: Portfolio[] = [];

  // private mapPortfolio(item: any): Portfolio {
  //   const mapTaskOrder = (taskOrderItem: any): TaskOrderDetails => {
  //     if (taskOrderItem) {
  //       const taskOrderFile: TaskOrderFile = {
  //         id: taskOrderItem.id || "-1",
  //         name: taskOrderItem.name || "",
  //         description: taskOrderItem.description || "",
  //         created_at: "",
  //         updated_at: "",
  //         size: 20000,
  //         status: "",
  //       };

  //       const taskOrder: TaskOrderDetails = {
  //         task_order_number: taskOrderItem.task_order_number,
  //         clins: taskOrderItem.clins,
  //         task_order_file: taskOrderFile,
  //       };

  //       return taskOrder;
  //     }

  //     throw new Error("invalid item");
  //   };

  //   let portfolio: Portfolio = {
  //     id: item.id,
  //     description: item.portfolio_step ? item.portfolio_step.description : "",
  //     name: item.portfolio_step ? item.portfolio_step.name : "",
  //     dod_component: item.portfolio_step
  //       ? item.portfolio_step.dod_components
  //       : [],
  //     csp_provisioning_status: item.status,
  //     portfolio_managers: item.portfolio_step
  //       ? item.portfolio_step.portfolio_managers
  //       : [],
  //     taskOrders: item.funding_step ? [mapTaskOrder(item.funding_step)] : [],
  //     applications: [],
  //   };

  //   return portfolio;
  // }

  // private async getPortfolios(): Promise<Portfolio[]> {
  //   const portfolioResponse = await this.$http.get(getDraftsUrl(apiUrl), {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (portfolioResponse.status === 200) {
  //     return portfolioResponse.data.map((item: any) => this.mapPortfolio(item));
  //   } else {
  //     throw new Error(portfolioResponse.statusText);
  //   }
  // }

  private async deletePortfolio(id: string): Promise<void> {
    const portfolioResponse = await this.$http.delete(
      deleteDraftUrl(apiUrl, id)
    );

    if (portfolioResponse.status !== 204) {
      throw Error(`error deleting portfolio with id:  ${id}`);
    } else {
      await this.loadPortfolios();
    }
  }


  private async loadPortfolios() {
    // this.portfolios = await await this.getPortfolios();
    await this.$store.dispatch('loadPortfolios');
  }

  private async mounted(): Promise<void> {
    await this.loadPortfolios();
  }

  private async onDeletePortfolio(id: string) {
    if (id != "") {
      await this.deletePortfolio(id);
    }
  }
}
</script>
