<template>
  <v-container fluid>
    <div v-if="!createdApplication">
      <v-row>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>
        <v-col class="pl-0" cols="12">
          <h2 class="h2">Invite team members to your application</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0 ma-0" cols="10">
          <span>
            <p class="body-lg text--base-darkest">
              In this section, you will be able to invite people from your
              application’s development team and assign permission levels, so
              they can contribute to your workspaces within the
              <span class="font-weight-bold">{{ csp }}</span> console.
            </p>
            <p class="body-lg text--base-darkest">
              In order to invite team members, you must set up at least one
              application within your portfolio. Please
              <a
                href="/wizard/addapplication"
                class="link-body-md font-weight-bold"
              >
                add an application
              </a>
              to continue.
            </p>
          </span>
        </v-col>
      </v-row>
    </div>

    <RootAdminView v-if="editType === 'portfolio'" />
    <TeamView v-if="editType === 'application'" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AddMembers from "@/wizard/Step4/components/AddMembers.vue";
import RootAdminView from "@/wizard/Step4/views/RootAdminView.vue";
import TeamView from "@/wizard/Step4/views/TeamView.vue";

@Component({
  components: {
    AddMembers,
    RootAdminView,
    TeamView,
  },
})
export default class Step_4 extends Vue {
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";
  private createdApplication = this.$store.state.applicationModels;
  private editType = this.$route.params.type;
  // methods

  public openDialog(event: Event): void {
    this.$store.dispatch("openDialog", [
      "addMembers",
      event.type === "keydown",
      "632px",
      "90",
    ]);
  }

  public async mounted(): Promise<void> {
    // temp until actually saving data to store
    this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }
}
</script>
