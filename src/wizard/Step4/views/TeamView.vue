<template>
  <v-container fluid>
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-col class="pl-0" cols="12">
        <h2 class="h2">
          Let’s add team members to {{ currentApplication[0].name }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="10">
        <p class="body-lg text--base-darkest">
          Invite your application team members and assign their permissions
          below. These individuals will receive an invitation from
          <span class="font-weight-bold"> {{ csp }}</span> after your portfolio
          is provisioned. Select <span class="font-weight-bold">Next</span> to
          add team members to your other applications.
          <a class="text-decoration-underline"
            >Learn more about team member roles</a
          >
        </p>
      </v-col>
    </v-row>
    <v-row v-if="currentApplication">
      <v-col class="ps-0 ma-0">
        <v-row>
          <v-col cols="12" class="d-flex pl-0 pr-0">
            <v-col class="d-flex">
              <v-text-field
                class="search-bar"
                placeholder="Search for member name and email"
                dense
                outlined
                single-line
                hide-details
              />
              <v-btn class="input-search-bar" color="primary">
                <v-icon width="10px" class="mr-1">search</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row-reverse">
              <v-btn
                role="button"
                class="font-weight-bold d-flex align-center px-5"
                :ripple="false"
                color="primary"
                @keydown.native.enter="openDialog($event)"
                @click="openDialog($event)"
              >
                <div class="mr-1 mt-n2">
                  <v-icon class="icon-20" role="presentation"
                    >control_point</v-icon
                  >
                </div>
                <div class="body font-weight-bold">Invite Team Member</div>
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
        <v-row v-if="!membersData">
          <v-col cols="12" class="pa-0 ma-0">
            <v-card rounded width="100%" height="10rem" class="ma-4 ml-3 body">
              <v-card-text class="text-center">
                <v-row class="d-flex justify-space-around pt-4">
                  <v-col>
                    <span class="body-lg text--base-dark">{{ message }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="ma-0">
            <v-data-table
              class="review-table"
              :headers="headers"
              :items="membersData"
              hide-default-footer
            >
              <template v-slot:header.display_name="{ header }">
                <div class="label font-weight-bold text--base-dark">
                  {{ header.text }}
                </div>
              </template>
              <template v-slot:header.workplace_access="{ header }">
                <div class="label font-weight-bold text--base-dark">
                  {{ header.text }}
                </div>
              </template>
              <template class="hello" v-slot:item.display_name="{ item }">
                <div class="body font-weight-bold pt-6">
                  {{ item.display_name }}
                </div>
                <div class="body text--base-dark pb-6">
                  {{ item.email }}
                </div>
              </template>
              <template v-slot:item.workplace_access="{ item }">
                <div class="d-flex justify-space-between">
                  <div class="body text--base-dark pt-3">
                    {{ item.workplace_access }}
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
                        :disabled="isDisabled(item.workplace_access)"
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
                        v-for="(item, i) in options"
                        :key="i"
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class TeamView extends Vue {
  private membersData: any = [];
  public currentApplication = this.$store.state.applicationModels.filter(
    (app: any) => app.id == this.$store.state.currentApplicationId
  );

  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";

  private message = "You do not have any team members in this application yet.";

  private headers = [
    { text: "Name", value: "display_name", align: "start" },
    { text: "Workplace Access ", value: "workplace_access", sortable: false },
  ];
  private options = ["Edit Info", "Change Role", "Remove team member"];

  // private tranformData(application: any): void {
  //   for (let value of application) {
  //     let obj: any = {};
  //     obj.id = value.id;
  //     obj.display_name = value.name;
  //     obj.description = value.description;
  //     let numArr = value.environments.map((env: any) => env?.operators?.length);
  //     obj.operators = numArr.reduce((a: any, b: any) => a + b) || 0;
  //     this.membersData.push(obj);
  //   }
  // }

  private isDisabled(workplace_access: string): boolean {
    if (workplace_access === "Administrator") {
      return true;
    }
    return false;
  }

  public async mounted(): Promise<void> {
    console.log(this.currentApplication);
  }
}
</script>
