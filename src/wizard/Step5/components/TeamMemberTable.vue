<template>
  <div class="review-table">
    <v-card
      v-for="application in this.tableData"
      :key="application.name"
      class="ma-1 width-95 height-100 mb-10"
    >
      <v-card-title class="d-flex justify-space-between">
        <span class="h3">{{ application.name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 primary--text"
          @click="onEdit(application)"
          role="link"
          :ripple="false"
          aria-label="Edit team members"
        >
          <v-icon aria-hidden="true" class="icon-16 text-decoration-none mr-1"
            >edit</v-icon
          >
          <span class="text-decoration-underline body-lg">Edit</span>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-simple-table v-if="application.operators.length">
          <template v-slot:default>
            <thead class="bg-base-lightest">
              <tr>
                <th class="width-50">
                  <span
                    class="
                      pl-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Name
                  </span>
                </th>

                <th class="width-50">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Workspace Roles
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="operator in application.operators" :key="operator.id">
                <td
                  class="pl-6 pt-4 pb-4 pr-4 body"
                  style="vertical-align: top"
                >
                  <strong>{{ operator.display_name }}</strong>
                  <br />
                  {{ operator.email }}
                </td>
                <td
                  class="pl-4 pt-4 pb-4 pr-6 body"
                  style="vertical-align: top"
                >
                  <span v-if="operator.workspace_roles.indexOf('|') > -1">
                    <span
                      v-for="access in tranformWorkSpace(
                        operator.workspace_roles
                      )"
                      :key="access"
                      class="d-block"
                    >
                      {{ access }}
                    </span>
                  </span>
                  <span v-else>
                    {{ operator.workspace_roles }}
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else class="body px-8 pb-5">
          You do not have any team members in this workspace.
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApplicationModel } from "types/Portfolios";
import { editmembers } from "@/router/wizard";

@Component({})
export default class TeamMemberTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ApplicationModel[];
  @Prop({ default: "" }) private name!: string;

  private onEdit(data: any) {
    this.$store.dispatch("setReturnToReview", true);
    if (data.type === "application") {
      this.$store.dispatch("applications/setCurrentApplicationId", data.id);
    }
    const routeName = editmembers.name;
    this.$router.push({
      name: routeName,
      params: {
        type: data.type,
        id: data.id,
      },
    });
  }

  private tableData: {
    type: string;
    id: string;
    name: string;
    operators: any;
  }[] = [];
  private setMemberTableData(data: ApplicationModel[]) {
    const rootAdmins =
      this.$store.getters["applications/portfolioOperators"] || [];
    if (rootAdmins && rootAdmins.length) {
      const rootOperators: any = [];
      rootAdmins.forEach((op: any) => {
        const opObj = {
          id: op.id,
          display_name: op.display_name,
          email: op.email,
          workspace_roles: "Root administrator",
        };
        rootOperators.push(opObj);
      });

      const rootObj = {
        type: "portfolio",
        id: this.$store.getters.getPortfolioId,
        name: "Root Administrators",
        operators: rootOperators,
      };
      this.tableData.push(rootObj);
    }

    data.forEach((application) => {
      const operators: any = [];

      const applicationOperators = application.operators || [];
      if (applicationOperators && applicationOperators.length) {
        applicationOperators.forEach((op: any) => {
          const opObj = {
            id: op.id,
            display_name: op.display_name,
            email: op.email,
            workspace_roles: "All: " + this.roleTranslation(op.access), // get nice name, not enum
          };
          operators.push(opObj);
        });
      }

      const applicationEnvironments = application.environments;
      applicationEnvironments.forEach((env: any) => {
        const envOperators = env.operators;
        if (envOperators && envOperators.length > 0) {
          envOperators.forEach((op: any) => {
            const i = operators.findIndex((o: any) => o.email === op.email);
            if (op.access !== "no_access") {
              const workspace_roles =
                i > -1
                  ? env.name +
                    ": " +
                    this.roleTranslation(op.access) +
                    "|" +
                    operators[i].workspace_roles
                  : env.name + ": " + this.roleTranslation(op.access);
              if (i > -1) {
                operators[i].workspace_roles = workspace_roles;
              } else {
                const opObj = {
                  id: op.id,
                  display_name: op.display_name,
                  email: op.email,
                  workspace_roles: workspace_roles,
                };
                operators.push(opObj);
              }
            }
          });
        }
      });

      const appObj = {
        type: "application",
        id: application.id,
        name: application.name,
        operators: operators,
      };
      this.tableData.push(appObj);
    });
  }
  private tranformWorkSpace(data: string) {
    return data.split("|");
  }
  private roleTranslation(role: string): string {
    switch (role) {
      case "portfolio_administrator":
        return "Root administrator";
      case "administrator":
        return "Administrator";
      case "contributor":
        return "Contributor";
      case "read_only":
        return "Billing read-only";
      default:
        return "Unauthorized";
    }
  }

  mounted(): void {
    this.setMemberTableData(this.data);
  }
}
</script>
