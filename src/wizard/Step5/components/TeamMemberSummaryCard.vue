<!--<template>-->
<!--  <summary-card :title="summaryTitle">-->
<!--    <template slot="summary-body">-->
<!--      <v-simple-table class="pb-2">-->
<!--        <template v-slot:default>-->
<!--          <thead class="bg-base-lightest">-->
<!--            <tr>-->
<!--              <th id="name">-->
<!--                <span-->
<!--                  class="pl-2 text-left text&#45;&#45;base-dark label font-weight-black"-->
<!--                >-->
<!--                  Name-->
<!--                </span>-->
<!--              </th>-->
<!--              <th id="permissions">-->
<!--                <span class="text-left text&#45;&#45;base-dark label font-weight-black">-->
<!--                  App Permissions-->
<!--                </span>-->
<!--              </th>-->
<!--              <th id="environment">-->
<!--                <span-->
<!--                  class="pr-2 text-left text&#45;&#45;base-dark label font-weight-black"-->
<!--                >-->
<!--                  Environment Access-->
<!--                </span>-->
<!--              </th>-->
<!--            </tr>-->
<!--          </thead>-->
<!--          <tbody>-->
<!--            <tr v-for="member in applicationMembers" :key="member.id">-->
<!--              <td class="pl-6 pt-4 pb-4 pr-4" style="vertical-align: top">-->
<!--                <div class="d-flex flex-column">-->
<!--                  <span class="table-item font-weight-bold">-->
<!--                    {{ member.name }}-->
<!--                  </span>-->
<!--                  <span class="table-item"> {{ member.email }} </span>-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="pa-4" style="vertical-align: top">-->
<!--                <span-->
<!--                  class="table-item d-flex flex-column"-->
<!--                  v-for="permission in grantedPermissions(member.permissions)"-->
<!--                  :key="permission"-->
<!--                >-->
<!--                  {{ permission }}-->
<!--                </span>-->
<!--              </td>-->
<!--              <td class="pl-4 pt-4 pb-4 pr-6" style="vertical-align: top">-->
<!--                <span-->
<!--                  class="table-item d-flex flex-column"-->
<!--                  v-for="setting in member.environments_settings"-->
<!--                  :key="setting.id"-->
<!--                >-->
<!--                  {{ setting.label }} : {{ setting.accessLevel }}-->
<!--                </span>-->
<!--              </td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--        </template>-->
<!--      </v-simple-table>-->
<!--    </template>-->
<!--  </summary-card>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Component from "vue-class-component";-->
<!--import SummaryCard from "./SummaryCard.vue";-->
<!--import ReviewTable from "./ReviewTable.vue";-->
<!--import { Prop } from "vue-property-decorator";-->
<!--import {-->
<!--  Application,-->
<!--  ApplicationMember,-->
<!--  ApplicationMemberPermissions,-->
<!--} from "types/Portfolios";-->
<!--@Component({-->
<!--  components: {-->
<!--    ReviewTable,-->
<!--  },-->
<!--})-->
<!--export default class TeamMemberSummaryCard extends SummaryCard {-->
<!--  @Prop({ default: null }) private application!: Application;-->
<!--  get applicationMembers(): Array<ApplicationMember> | undefined {-->
<!--    return this.application ? this.application.members : [];-->
<!--  }-->
<!--  get summaryTitle(): string {-->
<!--    return this.application ? this.application.name : "";-->
<!--  }-->
<!--  private grantedPermissions(-->
<!--    permissions: ApplicationMemberPermissions[]-->
<!--  ): string[] {-->
<!--    // filter out not granted permisssions and is not permission have been grante return 'no access'-->
<!--    const grantedPermissionsArr = permissions.filter((item) => item.is_granted);-->
<!--    if (grantedPermissionsArr.length > 0) {-->
<!--      return grantedPermissionsArr.map((item) => item.label);-->
<!--    } else return ["No Access"];-->
<!--  }-->
<!--}-->
<!--</script>-->
