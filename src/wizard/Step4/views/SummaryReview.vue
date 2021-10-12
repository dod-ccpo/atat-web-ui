<template>
  <v-container fluid class="ml-3">
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-col class="pl-0" cols="12">
        <h2 class="h2">Let’s set up your application teams</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="10">
        <p class="body-lg text--base-darkest">
          In this section, we will invite people to join your application teams,
          giving them access to your workspaces within the
          <span class="font-weight-bold"> {{ csp }}</span> console. Select each
          application below to manage your team members. Please add at least one
          person to each application to ensure your team can access your
          provisioned cloud resources. When you are done, select
          <span class="font-weight-bold">Next: Review and Submit</span> to
          finalize your portfolio.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ma-0 pa-0 mt-4">
        <v-data-table
          class="review-table"
          :headers="headers"
          :items="applicationData"
          hide-default-footer
        >
          <template v-slot:header.name="{ header }">
            <div class="label font-weight-bold text--base-dark">
              {{ header.text }}
            </div>
          </template>
          <template v-slot:header.description="{ header }">
            <div class="label font-weight-bold text--base-dark">
              {{ header.text }}
            </div>
          </template>
          <template v-slot:header.operators="{ header }">
            <div class="label font-weight-bold text--base-dark">
              {{ header.text }}
            </div>
          </template>
          <template class="hello" v-slot:item.name="{ item }">
            <div>
              <v-icon class="table-subdirectory-icon" v-if="!item.portfolio"
                >subdirectory_arrow_right</v-icon
              >
              <a
                @click="handleNameClick(item)"
                class="body font-weight-bold py-3 primary-text"
              >
                {{ item.name }}
              </a>
            </div>
          </template>
          <template v-slot:item.description="{ item }">
            <div class="d-flex justify-space-between">
              <div class="body text--base-dark py-3">
                {{ item.description }}
              </div>
            </div>
          </template>
          <template v-slot:item.operators="{ item }">
            <div class="d-flex justify-space-between">
              <div class="body text--base-dark pt-1">
                {{ item.operators }}
              </div>

              <v-menu
                class="table-menu"
                transition="slide-y-transition"
                offset-y
                nudge-left="190"
                tabindex="2"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="table-row-menu-button pa-0"
                    tabindex="1"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="icon-18 width-auto">more_horiz</v-icon>
                  </v-btn>
                </template>
                <v-list class="table-row-menu pa-0">
                  <v-list-item
                    tabindex="1"
                    v-for="(item, i) in isPortfolio(item)"
                    :key="i"
                    @click="handleMenuClick(item, $event)"
                  >
                    <v-list-item-title class="body-lg py-2">{{
                      item
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { editmembers } from "@/router/wizard";

@Component({})
export default class SummaryReview extends Vue {
  public applications = this.$store.state.applicationModels;
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";
  private applicationData: any = [];
  private handleNameClick(item: any): void {
    if (item.portfolio) {
      this.$router.push({
        name: editmembers.name,
        params: {
          type: "portfolio",
          id: this.$store.state.currentPortfolioId,
        },
      });
      return;
    }
    this.$store.dispatch("setCurrentApplicationId", item.id);
    this.$router.push({
      name: editmembers.name,
      params: {
        type: "application",
        id: this.$store.state.currentApplicationId,
      },
    });
  }
  private handleMenuClick(item: any, event: Event): void {
    switch (item) {
      case "View root administrators":
        console.log(item);
        this.$router.push({
          name: editmembers.name,
          params: {
            type: "portfolio",
            id: this.$store.state.currentPortfolioId,
          },
        });
        break;
      case "View team members":
        this.$router.push({
          name: editmembers.name,
          params: {
            type: "application",
            id: this.$store.state.currentApplicationId,
          },
        });
        break;
      default:
        this.openDialog(event);
    }
  }
  private currentPortfolio =
    this.$store.getters.getPortfolioById(
      this.$store.state.currentPortfolioId
    ) || "Untitled";

  private tranformData(applications: any): void {
    this.applicationData.push({
      name: this.$store.state.portfolioSteps[0].model.name || "Untitled",
      description: this.$store.state.portfolioSteps[0].model.description,
      operators: this.$store.state.portfolioOperators.length || 0,
      portfolio: true,
    });
    for (let value of applications) {
      let obj: any = {};
      obj.id = value.id;
      obj.name = value.name;
      obj.description = value.description;
      let numArr = value.environments.map((env: any) => env?.operators?.length);
      obj.operators = numArr.reduce((a: any, b: any) => a + b) || 0;
      this.applicationData.push(obj);
    }
  }
  private isPortfolio(item: any): string[] {
    if (item.portfolio) {
      return ["View root administrators", "Add root administrators"];
    }
    return ["View team members", "Add team members"];
  }
  private headers = [
    { text: "Workspaces", value: "name", align: "start" },
    { text: "Description ", value: "description", sortable: false },
    { text: "Team Members ", value: "operators", sortable: false },
  ];
  public openDialog(event: Event): void {
    this.$store.dispatch("openDialog", [
      "addMembers",
      event.type === "keydown",
      "632px",
      "90",
    ]);
  }
  public async mounted(): Promise<void> {
    this.tranformData(this.applications);
  }
}
</script>
