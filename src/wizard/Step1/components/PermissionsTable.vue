<template>
  <div class="permission-table">
    <v-card class="mt-4" elevation="2" max-width="100%">
      <v-card-title class="d-flex justify-space-between">
        <span class="h4">{{ name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 h6 primary--text"
          :ripple="false"
        >
          <v-icon x-small class="text-decoration-none mr-1">edit</v-icon>
          <span class="text-decoration-underline">Edit</span>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-simple-table>
          <template v-slot:default>
            <thead class="bg-base-lightest">
              <tr>
                <th
                  class="
                    text-left text--base-dark
                    label
                    font-weight-black
                    py-3
                    px-4
                  "
                >
                  Name
                </th>
                <th
                  class="
                    text-left text--base-dark
                    label
                    font-weight-black
                    py-3
                    px-4
                  "
                >
                  App Permissions
                </th>
                <th
                  class="
                    text-left text--base-dark
                    label
                    font-weight-black
                    py-3
                    px-4
                  "
                >
                  Environment Access
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in getData" :key="item.id">
                <td class="pa-4" style="vertical-align: top">
                  <div class="d-flex flex-column">
                    <span class="table-item font-weight-bold">
                      {{ item.name }}
                    </span>
                    <span class="table-item"> {{ item.email }} </span>
                  </div>
                </td>
                <td class="pa-4" style="vertical-align: top">
                  <span
                    class="table-item d-flex flex-column"
                    v-for="permission in grantedPermissions(item.permissions)"
                    :key="permission"
                  >
                    {{ permission }}
                  </span>
                </td>
                <td class="pa-4" style="vertical-align: top">
                  <span
                    class="table-item d-flex flex-column"
                    v-for="setting in item.environments_settings"
                    :key="setting.id"
                  >
                    {{ setting.label }} : {{ setting.accessLevel }}
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
import {
  ApplicationMember,
  ApplicationMemberPermissions,
} from "types/Portfolios";
import { applicationMembersMock } from "@/store/mocks/portfoliosMockData";

@Component({})
export default class PermissionsTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ApplicationMember[];
  @Prop({ default: "Tracker Application" }) private name!: string;

  get getData(): ApplicationMember[] {
    // if (!this.data || this.data.length < 1) return applicationMembersMock;
    // else
    return this.data;
  }

  private grantedPermissions(
    permissions: ApplicationMemberPermissions[]
  ): string[] {
    // filter out not granted permisssions and is not permission have been grante return 'no access'
    const grantedPermissionsArr = permissions.filter((item) => item.is_granted);
    console.log("grantedPermissionsArr", grantedPermissionsArr);
    if (grantedPermissionsArr.length > 0) {
      return grantedPermissionsArr.map((item) => item.label);
    } else return ["No Access"];
  }
}
</script>
