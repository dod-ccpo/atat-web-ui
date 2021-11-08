<template>
  <div>
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <div class="content-max-width">
      <h1 tabindex="-1">Let’s set up your application teams</h1>
      <p class="body-lg text--base-darkest">
        In this section, we will invite people to join your application teams,
        giving them access to your workspaces within the {{ csp }} console.
        Select each application below to manage your team members. Please add at
        least one person to each application to ensure your team can access your
        provisioned cloud resources. When you are done, select
        <strong>Next: Review and Submit</strong> to
        finalize your portfolio.
      </p>
    </div>

    <v-data-table
      class="review-table overflow-x-hidden overflow-y-hidden"
      style="width: 900px"
      :headers="headers"
      :items="applicationData"
      hide-default-footer
      dense
      :sort-by="['name']"
      :custom-sort="sortApplications"
      :items-per-page="-1"
    >
      <template v-slot:header.name="{ header }">
        <div class="label font-weight-bold text--base-dark mr-5">
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
            @keydown.enter="handleNameClick(item)"
            @keydown.space="handleNameClick(item)"
            tabindex="0"
            class="
              body
              font-weight-bold
              py-3
              primary-text
              text-no-wrap text-truncate
            "
            :aria-label="
              item.name +
              ' - manage ' +
              (item.portfolio ? 'root administrators' : 'team members')
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
            {{ getDescription(item.description) }}
          </div>
        </div>
      </template>
      <template v-slot:item.operators="{ item }">
        <div class="d-flex justify-space-between">
          <div class="body text--base-darkest pt-1">
            {{ item.operatorCount }}
          </div>

          <v-menu
            class="table-menu"
            transition="slide-y-transition"
            offset-y
            nudge-left="190"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="table-row-menu-button pa-0"
                v-bind="attrs"
                v-on="on"
                @click="setApplication(item)"
                :aria-label="
                  'View or Add ' +
                  (item.portfolio ? 'root administrators' : 'team members')
                "
              >
                <v-icon class="icon-18 width-auto">more_horiz</v-icon>
              </v-btn>
            </template>
            <v-list class="table-row-menu pa-0">
              <v-list-item
                v-for="(item, i) in isPortfolio(item)"
                :key="i"
                @click="handleMenuClick(item, $event)"
              >
                <v-list-item-title class="body-lg py-2">
                  {{ item }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { editmembers } from "@/router/wizard";
import {
  ApplicationDataModel,
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class SummaryReview extends Vue {
  private incomingModel!: ApplicationDataModel;
  public applications = this.$store.state.applicationModels;
  private currentApplication: any;
  private csp = this.$store.getters.getPortfolio.csp;
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

  private getDescription(text: string): string {
    if (text && text.length) {
      return text.length <= 50 ? text : text.substring(0, 50) + "...";
    }
    return "";
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

    const pIndex = this.applicationData.findIndex(
      (p: any) => p.portfolio === true
    );
    if (pIndex > -1) {
      this.applicationData[pIndex].operatorCount = portfolioOperatorsCount;
    } else {
      this.applicationData.push({
        name: this.$store.state.portfolioSteps[0].model.name || "Untitled",
        description: "Root administrators can access all applications",
        operatorCount: portfolioOperatorsCount,
        portfolio: true,
      });
    }

    for (let app of applications) {
      const opEmails: string[] = [];
      const appOps = app.operators || [];
      appOps.forEach((op: OperatorModel) => opEmails.push(op.email));
      app.environments.forEach((env: EnvironmentModel) => {
        const envOps = env.operators || [];
        envOps.forEach((op: OperatorModel) => opEmails.push(op.email));
      });
      const distinctOpEmails = [...new Set(opEmails)];
      const totalOperatorsCount =
        portfolioOperatorsCount + distinctOpEmails.length;

      const aIndex = this.applicationData.findIndex(
        (a: any) => a.id === app.id
      );
      if (aIndex > -1) {
        this.applicationData[aIndex].operatorCount = totalOperatorsCount;
      } else {
        this.applicationData.push({
          id: app.id,
          name: app.name,
          operatorCount: totalOperatorsCount,
          description: app.description,
          portfolio: false,
        });
      }
    }
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
