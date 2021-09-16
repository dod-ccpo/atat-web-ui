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
        <portfolio-summary :portfolios="portfolios"></portfolio-summary>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Portfolio, Portfolios } from "types/Portfolios";
import PortfolioSummary from "./PortfolioSummary.vue";
import { TaskOrderDetails, TaskOrderFile } from "types/Wizard";

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class ViewPortfolio extends Vue {
  public portfolios: Portfolio[] = [];

  private mapPortfolio(item: any): Portfolio {
    const mapTaskOrder = function (item: any): TaskOrderDetails {
      if (item) {
        const taskOrderFile: TaskOrderFile = {
          id: item.id || "-1",
          name: item.name || "",
          description: item.description || "",
          created_at: "",
          updated_at: "",
          size: 20000,
          status: "",
        };

        const taskOrder: TaskOrderDetails = {
          task_order_number: item.task_order_number,
          clins: item.clins,
          task_order_file: taskOrderFile,
        };

        return taskOrder;
      }

      throw new Error("invalid item");
    };

    let portfolio: Portfolio = {
      id: item.id,
      description: item.portfolio_step ? item.portfolio_step.description : "",
      name: item.portfolio_step ? item.portfolio_step.name : "",
      dod_component: item.portfolio_step
        ? item.portfolio_step.dod_components
        : [],
      csp_provisioning_status: item.status,
      portfolio_managers: item.portfolio_step
        ? item.portfolio_step.portfolio_managers
        : [],
      taskOrders: item.funding_step ? [mapTaskOrder(item.funding_step)] : [],
      applications: [],
    };

    return portfolio;
  }

  public async getPortfolios(): Promise<Portfolio[]> {
    const apiUrl =
      "https://s63gzoj8bh.execute-api.us-gov-west-1.amazonaws.com/prod/portfolioDrafts/";

    const portfolioResponse = await this.$http.get(apiUrl, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    if (portfolioResponse.status === 200) {
      return portfolioResponse.data.map((item: any) => this.mapPortfolio(item));
    } else {
      throw new Error(portfolioResponse.statusText);
    }
  }

  // public async getPortfolios(): Promise<Portfolio[]> {
  //   const portfoliosAll = this.$store.getters.getAllPortfolios;
  //   const portfolios: Portfolio[] = [portfoliosAll["11"], portfoliosAll["10"]];

  //   return portfolios;
  // }

  private async mounted(): Promise<void> {
    this.portfolios = await (
      await this.getPortfolios()
    ).filter((portfolio) => portfolio.name != "");
  }
}
</script>
