<template>
  <div class="review-table">
    <v-card class="ml-4 mt-4 width-95 height-100 mb-10">
      <v-card-title class="d-flex justify-space-between">
        <span class="h3">{{ application.name }}</span>
        <v-btn
          text
          x-small
          class="v-btn text-decoration-none mt-1 mx-1 h5 primary--text"
          :ripple="false"
          @click="$emit('edit')"
          role="link"
          :aria-label="'Edit application ' + application.name"
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
                <th id="name">Name</th>
                <th id="permissions">App Permissions</th>
                <th id="environment">Environment Access</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in getMembers" :key="item.id">
                <td>
                  <div class="d-flex flex-column">
                    <strong>{{ item.name }}</strong>
                    <br />
                    {{ item.email }}
                  </div>
                </td>
                <td>
                  <span
                    class="d-flex flex-column"
                    v-for="permission in grantedPermissions(item.permissions)"
                    :key="permission"
                  >
                    {{ permission }}
                  </span>
                </td>
                <td>
                  <span
                    class="d-flex flex-column"
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
import { Application, ApplicationMemberPermissions } from "types/Portfolios";

import { allPortfolios } from "../../../../store/mocks/portfoliosMockData";

@Component({})
export default class ReviewTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private application!: Application;

  get getMembers() {
    // const empty: ApplicationMember[] = [];
    const application = allPortfolios["11"].applications[0];
    return application.members;
  }

  private grantedPermissions(
    permissions: ApplicationMemberPermissions[]
  ): string[] {
    // filter out not granted permisssions and is not permission have been grante return 'no access'
    const grantedPermissionsArr = permissions.filter((item) => item.is_granted);

    if (grantedPermissionsArr.length > 0) {
      return grantedPermissionsArr.map((item) => item.label);
    } else return ["No Access"];
  }
}
</script>
