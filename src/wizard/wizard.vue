<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <Stepper />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <Step1 />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ButtonNavigation :wizardNavButtons="wizardNavButtons" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Stepper from "./Navigation/Stepper.vue";
import ButtonNavigation from "./Navigation/ButtonNavigation.vue";
import Step1 from "./Step1/views/Step1.vue";
import Step2 from "./Step2/views/Step2.vue";
import { NavigationButtons } from "types/Wizard";

@Component({
  components: {
    Stepper,
    Step1,
    Step2,
    ButtonNavigation,
  },
})
export default class Wizard extends Vue {
  public wizardNavButtons: NavigationButtons = {
    NavButtonPanels: [
      {
        step: 1,
        buttons: [
          {
            text: "Save and Close",
            link: true,
            id: "btn_save_and_close",
          },
          {
            id: "btn_next_add_funding",
            text: "Next: Add Funding",
            primary: true,
          },
        ],
      },
      {
        step: 2,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "btn_cancel",
          },
          {
            text: "Previous",
            outlined: true,
            id: "btn_previous",
          },
          {
            text: "Next",
            primary: true,
            id: "btn_next",
          },
        ],
      },
      {
        step: 3,
        buttons: [
         {
            text: "Cancel",
            link: true,
            id: "btn_cancel",
          },
          {
            text: "Previous",
            outlined: true,
            id: "btn_previous",
          },
          {
            text: "Next: Add Team Members",
            primary: true,
            id: "btn_next_add_team_members",
          },
        ],
      },
      {
        step: 4,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "btn_cancel",
          },
          {
            text: "Previous",
            outlined: true,
            id: "btn_previous",
          },
          {
            text: "Next: Review and Submit",
            primary: true,
            id: "btn_next_review_and_submit",
          },
        ],
      },
      {
        step: 5,
        buttons: [
          {
            text: "Save and Close",
            link: true,
            id: "btn_save_and_close",
          },
          {
            text: "Previous",
            outlined: true,
            id: "btn_previous",
          },
          {
            text: "Prevision Cloud Resources",
            primary: true,
            disabled: true,
            id: "btn_prevision_cloud_resources",
          },
        ],
      },
    ],
  };
}
</script>
