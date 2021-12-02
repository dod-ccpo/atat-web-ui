<template>
  <div>
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <div class="content-max-width">
      <h1 tabindex="-1">Let’s set up your application teams</h1>
      <p class="body-lg text--base-darkest">
        In this section, we will invite people to join your application teams,
        giving them access to your workspaces within the {{ csp }} console. Add
        your root administrators to <strong>“{{ portfolioName }}”</strong> to
        manage all of your applications, or customize members and roles within
        each application individually. When you are done, select
        <strong>Next: Review and Submit</strong> to finalize your portfolio.
      </p>

      <v-alert
        v-if="isStepErrored && isStepTouched"
        outlined
        rounded
        color="error"
        type="info"
        class="text-left error_lighter black-icon mt-3 mb-8 border-thick pr-14"
        border="left"
      >
        <div class="black--text body-lg">
          <p class="mb-0">
            Each workspace must have an administrator to manage your resources
            within the cloud console. Please review the application teams below
            and ensure at least one of the following is satisfied:
          </p>
          <ul>
            <li>
              A root administrator is added to manage all of your applications.
            </li>
            <li>
              An administrator is added to every application individually.
            </li>
            <li>
              An administrator is added to each environment within every
              application.
            </li>
          </ul>
        </div>
      </v-alert>
    </div>

    <v-data-table
      class="
        review-table review-table--shadowed
        overflow-x-hidden overflow-y-hidden
      "
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
        <div class="d-flex justify-space-between align-center">
          <div class="body text--base-darkest pt-1">
            <div
              class="errorable-field d-flex align-center"
              :class="{ invalid: item.invalidAdmins }"
            >
              {{ item.operatorCount }}
              <v-icon v-if="item.invalidAdmins"> error </v-icon>
            </div>
          </div>

          <v-menu
            transition="slide-y-transition"
            offset-y
            nudge-left="192"
            nudge-top="1"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :id="moreButtonId(item.name)"
                class="meatball-menu-button pa-0"
                v-bind="attrs"
                v-on="on"
                @click="setApplication(item)"
                :aria-label="
                  'View or Add ' +
                  (item.portfolio ? 'root administrators' : 'team members')
                "
              >
                <v-icon>more_horiz</v-icon>
              </v-btn>
            </template>
            <v-list class="meatball-menu pa-0">
              <v-list-item
                v-for="(menuOptionText, i) in isPortfolio(item)"
                :key="i"
                @click="
                  handleMenuClick(
                    menuOptionText,
                    $event,
                    moreButtonId(item.name)
                  )
                "
              >
                <v-list-item-title class="body-lg py-2">
                  {{ menuOptionText }}
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
import { Component, Watch } from "vue-property-decorator";
import { editmembers } from "@/router/wizard";
import { mixins } from "vue-class-component";
import ApplicationModuleData from "@/mixins/ApplicationModuleData";
import { validateHasAdminOperators } from "@/validation/application";

import {
  ApplicationDataModel,
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";

// const namespace = "applications";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class SummaryReview extends mixins(ApplicationModuleData) {
  private incomingModel!: ApplicationDataModel;

  public get applications(): ApplicationModel[] {
    return this.applicationsState.applicationModels;
  }
  public get portfolioName(): string {
    return this.$store.getters.getPortfolioName();
  }
  private isStepErrored = this.$store.getters.isStepErrored(4);
  private isStepTouched = this.$store.getters.isStepTouched(4);
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
    this.setCurrentApplicationId(item.id);
    this.$router.push({
      name: editmembers.name,
      params: {
        type: "application",
        id: this.$store.state.applications.currentApplicationId,
      },
    });
  }
  private handleMenuClick(
    item: any,
    event: Event,
    returnFocusId: string
  ): void {
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
            id: this.$store.state.applications.currentApplicationId,
          },
        });
        break;
      default:
        this.openDialog(event, returnFocusId);
    }
  }

  private getDescription(text: string): string {
    if (text && text.length) {
      return text.length <= 50 ? text : text.substring(0, 50) + "...";
    }
    return "";
  }

  @Watch("operators")
  rootAdminsUpdated(): void {
    this.transformData(this.applications);
  }
  @Watch("applications", { deep: true })
  membersUpdated(): void {
    this.transformData(this.applications);
  }

  private transformData(applications: any): void {
    const portfolioOperators = this.operators;
    const portfolioOperatorsCount = portfolioOperators.length || 0;
    const [isPortfolioValid, hasPortfolioOperators] = validateHasAdminOperators(
      portfolioOperators,
      applications
    );
    this.isStepErrored = !isPortfolioValid;

    const pIndex = this.applicationData.findIndex(
      (p: any) => p.portfolio === true
    );
    if (pIndex > -1) {
      this.applicationData[pIndex].operatorCount = portfolioOperatorsCount;
      this.applicationData[pIndex].invalidAdmins =
        this.isStepErrored && this.isStepTouched;
    } else {
      this.applicationData.push({
        name: this.$store.state.portfolioSteps[0].model.name || "Untitled",
        description: "Root administrators can access all applications",
        operatorCount: portfolioOperatorsCount,
        portfolio: true,
        invalidAdmins: this.isStepErrored && this.isStepTouched,
      });
    }

    for (let app of applications) {
      const [isAppValid, hasPortfolioOperators] = validateHasAdminOperators(
        portfolioOperators,
        [app]
      );
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
        this.applicationData[aIndex].invalidAdmins =
          !isAppValid && this.isStepTouched;
      } else {
        this.applicationData.push({
          id: app.id,
          name: app.name,
          operatorCount: totalOperatorsCount,
          description: app.description,
          portfolio: false,
          invalidAdmins: !isAppValid && this.isStepTouched,
        });
      }
    }
  }

  private setApplication(item: any) {
    const application = item as ApplicationModel;
    this.setCurrentApplicationId(application.id);
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
  public openDialog(event: Event, returnFocusId: string): void {
    let memberProps: {
      isRootAdmin: boolean;
      isEditSingle: boolean;
      memberEmail: string | null;
      focusOnOk: string;
      focusOnCancel: string;
    } = {
      isRootAdmin: false,
      isEditSingle: false,
      memberEmail: null,
      focusOnOk: returnFocusId,
      focusOnCancel: returnFocusId,
    };
    let currentTarget = event.currentTarget as HTMLElement;
    if (
      currentTarget &&
      currentTarget.innerText &&
      currentTarget.innerText === "Add root administrators"
    ) {
      memberProps.isRootAdmin = true;
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
        operators: this.operators,
        applications: this.applications,
      })
    );
  }

  private hasChanges(): boolean {
    return this.$store.getters.membersModified;
  }

  private hasPortfolioHadMembersAdded(): boolean {
    return this.$store.getters["applications/portfolioHasHadMembersAdded"];
  }

  public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    if (this.hasChanges() || this.hasPortfolioHadMembersAdded()) {
      try {
        await this.$store.dispatch("saveStepData", 4);
        await this.$store.dispatch("setStepTouched", [4, true]);
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
  private moreButtonId(workspace: string): string {
    if (workspace) {
      return (
        "moreButton_" + workspace.toLowerCase().replace(/[^a-zA-Z0-9]/gi, "_")
      );
    }
    return "";
  }
}
</script>
