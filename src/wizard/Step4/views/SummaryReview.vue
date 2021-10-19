<template>
  <v-container fluid class="ml-3 mr-16 mb-16">
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-col class="pl-0" cols="12">
        <h2 class="h2">Let’s set up your application teams</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="9">
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
      <v-col class="ma-0 pa-0 mt-4">
        <v-data-table
          class="review-table overflow-x-hidden overflow-y-hidden"
          style="width: 900px"
          :headers="headers"
          :items="applicationData"
          hide-default-footer
          dense
          :sort-by="['name']"
          :custom-sort="sortApplications"
        >
          <template v-slot:header.name="{ header }">
            <div
              class="label font-weight-bold text--base-dark mr-5"
              tabindex="3"
            >
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
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center">
              <v-icon
                class="table-subdirectory-icon text--base-light mr-3"
                v-if="!item.portfolio"
                >subdirectory_arrow_right</v-icon
              >
              <a
                @click="handleNameClick(item)"
                class="
                  body
                  font-weight-bold
                  py-3
                  primary-text
                  text-no-wrap text-truncate
                "
              >
                <div class="d-flex align-center justify-between">
                  <div class="overflow-hidden" style="height: 24px">
                    {{ item.name }}
                  </div>
                  <div v-if="item.name && item.name.length > 25">...</div>
                </div>
              </a>
            </div>
          </template>
          <template v-slot:item.description="{ item }">
            <div class="d-flex align-center body text--base-darkest">
              <div class="overflow-hidden text-no-wrap" style="height: 24px">
                {{ item.description }}
              </div>
              <div v-if="item.description && item.description.length > 50">
                ...
              </div>
            </div>
          </template>
          <template v-slot:item.operators="{ item }">
            <div class="d-flex justify-space-between">
              <div class="body text--base-darkest pt-1">
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
                    @click="setApplication(item)"
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
import { Component, Watch } from "vue-property-decorator";
import { editmembers } from "@/router/wizard";
import {
  ApplicationDataModel,
  ApplicationModel,
  OperatorModel,
} from "types/Portfolios";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class SummaryReview extends Vue {
  private incomingModel!: ApplicationDataModel;
  public applications = this.$store.state.applicationModels;
  private currentApplication: any;
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";
  private applicationData: any = [];
  private sortAsc = true;
  private sortApplications(items: any[], index: number) {
    this.sortAsc = !this.sortAsc;
    let sortSwitch: number = this.sortAsc ? 1 : -1;
    return items.sort((a, b) => {
      if (a.id !== undefined && b.id !== undefined) {
        return a.name.toLowerCase() > b.name.toLowerCase()
          ? sortSwitch
          : sortSwitch * -1;
      } else {
        return 0;
      }
    });
  }

  private handleNameClick(item: any): void {
    if (item.portfolio) {
      if (item.name === "Untitled") {
        return;
      }

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

  @Watch("$store.state.portfolioOperators")
  rootAdminsUpdated(): void {
    this.transformData(this.applications);
  }
  @Watch("$store.state.applicationModels", { deep: true })
  membersUpdated(): void {
    this.transformData(this.applications);
  }

  private transformData(applications: any): void {
    const portfolioOperatorsCount =
      this.$store.state.portfolioOperators.length || 0;

    const portfolioObjIndex = this.applicationData.findIndex(
      (p: any) => p.isPortfolio === true
    );

    if (portfolioObjIndex > -1) {
      this.applicationData[portfolioObjIndex].operators =
        portfolioOperatorsCount;
    } else {
      this.applicationData.push({
        isPortfolio: true,
        name: this.$store.state.portfolioSteps[0].model.name || "Untitled",
        description: this.$store.state.portfolioSteps[0].model.description,
        operators: portfolioOperatorsCount,
        portfolio: true,
      });
    }

    for (let app of applications) {
      const appOperatorsCount =
        app.operators && app.operators.length ? app.operators.length : 0;

      const envOperatorCount = this.getEnvOperatorCount(app);
      const totalOperatorsCount =
        portfolioOperatorsCount + appOperatorsCount + envOperatorCount;

      const appObjIndex = this.applicationData.findIndex(
        (a: any) => a.id === app.id
      );

      if (appObjIndex > -1) {
        this.applicationData[appObjIndex].operators = totalOperatorsCount;
      } else {
        let obj: any = {
          isPortfolio: false,
          operators: totalOperatorsCount,
          id: app.id,
          name: app.name,
          description: app.description,
        };

        this.applicationData.push(obj);
      }
    }
  }

  private getEnvOperatorCount(app: ApplicationModel) {
    let envOperatorCount = 0;
    const envOperators = app.environments.filter(
      (env: any) => env.operators !== undefined
    );
    if (envOperators.length > 0) {
      const operatorTemp: any[] = [];
      envOperatorCount += envOperators.filter((op: any) => {
        if (!operatorTemp.includes(op.email)) {
          operatorTemp.push(op.email);
          return op;
        }
      }).length;
    }
    return envOperatorCount;
  }

  private setApplication(item: any) {
    this.currentApplication = item;
    this.$store.dispatch("setCurrentApplicationId", this.currentApplication.id);
  }
  private isPortfolio(item: any): string[] {
    if (item.portfolio) {
      return ["View root administrators", "Add root administrators"];
    }
    return ["View team members", "Add team members"];
  }

  private headers = [
    {
      text: "Workspaces",
      value: "name",
      align: "start",
      sortable: true,
      width: "40%",
    },
    {
      text: "Description ",
      value: "description",
      sortable: false,
      width: "40%",
    },
    {
      text: "Team Members ",
      value: "operators",
      sortable: false,
      width: "20%",
    },
  ];
  public openDialog(event: Event): void {
    let memberProps: {
      isRootAdmin: boolean;
      isEditSingle: boolean;
      memberEmail: string | null;
    } = {
      isRootAdmin: false,
      isEditSingle: false,
      memberEmail: null,
    };
    let currentTarget = event.currentTarget as HTMLElement;
    if (
      currentTarget &&
      currentTarget.innerText &&
      currentTarget.innerText === "Add root administrators"
    ) {
      memberProps = {
        isRootAdmin: true,
        isEditSingle: false,
        memberEmail: "",
      };
    }

    this.$store.dispatch("openDialog", [
      "manageMembers",
      event.type === "keydown",
      "632px",
      "",
      memberProps,
    ]);
  }
  public async mounted(): Promise<void> {
    this.transformData(this.applications);
    this.incomingModel = JSON.parse(
      JSON.stringify({
        operators: this.$store.state.portfolioOperators as OperatorModel[],
        applications: this.$store.state.applicationModels as ApplicationModel[],
      })
    );
  }

  private hasChanges(): boolean {
    let theSame = true;
    const serializedIncoming = JSON.stringify(this.incomingModel);
    const serialiedOutgoing = JSON.stringify({
      operators: this.$store.state.portfolioOperators as OperatorModel[],
      applications: this.$store.state.applicationModels as ApplicationModel[],
    });

    theSame = serializedIncoming === serialiedOutgoing;

    return !theSame;
  }

  public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    if (this.hasChanges()) {
      try {
        await this.$store.dispatch("saveStepData", 4);
      } catch (error) {
        console.log(error);
      }
    }

    next();
  }
}
</script>
