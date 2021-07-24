<template>
  <v-toolbar
    elevation="0"
    width="100%"
    class="d-flex justify-end"
    style="position: fixed; bottom: 40px; left: 0px;"
  >
    <v-btn
      v-for="button in pageButtonPanel.buttons"
      :ripple="false"
      :key="button.id"
      :disabled="button.disabled"
      :outlined="button.outlined"
      :color="button.color"
      :class="[button.link ? 'link-button' : '', 'mr-5']"
    >
      {{ button.text }}
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { NavigationButtons } from "../../../types/Wizard";

@Component({})
export default class ButtonNavigation extends Vue {
  @Prop({ default: 1 }) private stepNumber!: number;

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
            color: "primary",
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
            color: "primary",
          },
          {
            text: "Next",
            color: "primary",
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
            color: "primary",
          },
          {
            text: "Next: Add Team Members",
            color: "primary",
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
            color: "primary",
          },
          {
            text: "Next: Review and Submit",
            color: "primary",
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
            color: "primary",
          },
          {
            text: "Prevision Cloud Resources",
            color: "primary",
            disabled: true,
            id: "btn_prevision_cloud_resources",
          },
        ],
      },
    ],
  };

  private pageButtonPanel = this.wizardNavButtons.NavButtonPanels.find(
    (buttonPanel) => {
      return buttonPanel.step === this.stepNumber;
    }
  );
}
</script>
