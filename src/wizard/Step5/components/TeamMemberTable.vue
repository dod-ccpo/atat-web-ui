<template>
  <div class="review-table">
    <v-card
      v-for="application in this.tableData"
      :key="application.name"
      class="ma-1 width-95 height-100 mb-10"
      elevation="4"
    >
      <v-card-title class="d-flex justify-space-between ml-2">
        <span class="h3">{{ application.name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 primary--text"
          @click="handleClicked('addteammembers')"
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
        <v-simple-table class="pb-2">
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
              <tr v-for="item in application.root" :key="item.id">
                <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">
                  <div class="d-flex flex-column">
                    <span class="table-item font-weight-bold">
                      {{ item.display_name }}
                    </span>
                    <span class="table-item"> {{ item.email }} </span>
                  </div>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    {{ item.workspace_roles }}
                  </span>
                </td>
              </tr>
              <tr v-for="item in application.appOp" :key="item.id">
                <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">
                  <div class="d-flex flex-column">
                    <span class="table-item font-weight-bold">
                      {{ item.display_name }}
                    </span>
                    <span class="table-item"> {{ item.email }} </span>
                  </div>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span class="table-item d-flex flex-column">
                    All: {{ item.workspace_roles }}
                  </span>
                </td>
              </tr>
              <tr v-for="item in application.envOps" :key="item.id">
                <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">
                  <div class="d-flex flex-column">
                    <span class="table-item font-weight-bold">
                      {{ item.display_name }}
                    </span>
                    <span class="table-item"> {{ item.email }} </span>
                  </div>
                </td>
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
                  <span
                    v-for="access in tranformWorkSpace(item.workspace_roles)"
                    :key="access"
                    class="table-item d-flex flex-column"
                  >
                    {{ access }}
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
import { ApplicationModel } from "types/Portfolios";

@Component({})
export default class TeamMemberTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ApplicationModel[];
  @Prop({ default: "" }) private name!: string;

  private handleClicked(name: string) {
    this.$router.push({ name: name });
  }

  private tableData: {
    name: string;
    root: any;
    appOp: any;
    envOps: any;
  }[] = [];
  private setMemberTableData(data: ApplicationModel[]) {
    data.forEach((application) => {
      const rootAdministrators: any = [];
      const appOps: any = [];
      const appEnvOps: any[] = [];

      const rootAdmins = this.$store.state.portfolioOperators || [];
      if (rootAdmins && rootAdmins.length) {
        rootAdmins.forEach((op: any) => {
          const opObj = {
            id: op.id,
            display_name: op.display_name,
            email: op.email,
            workspace_roles: "Root administrator",
          };
          rootAdministrators.push(opObj);
        });
      }

      const applicationOperators = application.operators || [];
      if (applicationOperators && applicationOperators.length) {
        applicationOperators.forEach((op: any) => {
          const opObj = {
            id: op.id,
            display_name: op.display_name,
            email: op.email,
            workspace_roles: this.roleTranslation(op.access), // get nice name, not enum
          };
          appOps.push(opObj);
        });
      }

      const applicationEnvironments = application.environments;
      applicationEnvironments.forEach((env: any) => {
        const envOperators = env.operators;
        if (envOperators && envOperators.length > 0) {
          envOperators.forEach((op: any) => {
            const i = appEnvOps.findIndex((o) => o.email === op.email);
            if (op.access !== "no_access") {
              const workspace_roles =
                i > -1
                  ? env.name +
                    ": " +
                    this.roleTranslation(op.access) +
                    "  " +
                    appEnvOps[i].workspace_roles
                  : env.name + ": " + this.roleTranslation(op.access);
              if (i > -1) {
                appEnvOps[i].workspace_roles = workspace_roles;
              } else {
                const opObj = {
                  id: op.id,
                  display_name: op.display_name,
                  email: op.email,
                  workspace_roles: workspace_roles,
                };
                appEnvOps.push(opObj);
              }
            }
          });
        }
      });

      const appObj = {
        name: application.name,
        root: rootAdministrators,
        appOp: appOps,
        envOps: appEnvOps,
      };
      this.tableData.push(appObj);
    });
  }
  private tranformWorkSpace(data: string) {
    return data.split("  ");
  }
  private roleTranslation(role: string): string {
    switch (role) {
      case "portfolio_administrator":
        return "Root administrator";
      case "administrator":
        return "Administrator";
      case "contributor":
        return "Contributer";
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
