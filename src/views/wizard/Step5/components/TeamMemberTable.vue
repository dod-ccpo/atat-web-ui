<template>
  <div class="review-table">
    <v-card class="ml-4 mt-4 width-95 height-100 mb-10" elevation="4">
      <v-card-title class="d-flex justify-space-between">
        <span class="h4">{{ name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 h6 primary--text"
          @click="handleClicked('addteammembers')"
          :ripple="false"
        >
          <v-icon class="icon-16 text-decoration-none mr-1">edit</v-icon>
          <span class="text-decoration-underline body-lg">Edit</span>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-simple-table class="pb-2">
          <template v-slot:default>
            <thead class="bg-base-lightest">
              <tr>
                <th id="name">
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
                <th id="permissions">
                  <span
                    class="text-left text--base-dark label font-weight-black"
                  >
                    App Permissions
                  </span>
                </th>
                <th id="environment">
                  <span
                    class="
                      pr-2
                      text-left text--base-dark
                      label
                      font-weight-black
                    "
                  >
                    Environment Access
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data.members" :key="item.id">
                <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">
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
                <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">
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

@Component({})
export default class TeamMemberTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ApplicationMember[];
  @Prop({ default: "" }) private name!: string;

  private grantedPermissions(
    permissions: ApplicationMemberPermissions[]
  ): string[] {
    // filter out not granted permisssions and is not permission have been grante return 'no access'
    const grantedPermissionsArr = permissions.filter((item) => item.is_granted);

    if (grantedPermissionsArr.length > 0) {
      return grantedPermissionsArr.map((item) => item.label);
    } else return ["No Access"];
  }
  private handleClicked(name: string) {
    this.$router.push({ name: name });
  }
}
</script>
