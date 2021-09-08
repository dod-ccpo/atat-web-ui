<template>
  <v-toolbar
    ref="buttonNavigation"
    elevation="0"
    width="100%"
    class="d-flex justify-end"
    style="position: fixed; bottom: 40px; left: 0px"
  >
    <v-btn
      v-for="button in pageButtonPanel.buttons"
      :ripple="false"
      :key="button.id"
      :id="'step_' + stepNumber + '_navbtn_' + button.id"
      :disabled="isDisabled(button.text)"
      :outlined="button.outlined"
      :color="button.color"
      v-model="stepNumber"
      @click="clickedAction(button.action)"
      :class="[button.link ? 'link-button' : '', 'mr-5']"
    >
      {{ button.text }}
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import { NavButtonPanel, NavigationButtons } from "../../../types/Wizard";

@Component({})
export default class ButtonNavigation extends Vue {
  @Prop({ default: 1 }) private stepNumber!: number;
  private currentStepNumber = this.stepNumber;
  @Emit()
  private clickedAction(actions: string[]): string[] {
    return actions;
  }

  public isDisabled(text: string): boolean {
    if (text.toLowerCase() === "next" && this.$route.name === "postreview") {
      return this.$store.getters.getisUserAuthorizedToProvisionCloudResources
        ? false
        : true;
    } else {
      return false;
    }
  }

  public wizardNavButtons: NavigationButtons = {
    NavButtonPanels: [
      {
        step: 1,
        buttons: [
          {
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            id: "add_funding",
            text: "Next: Add Task Order",
            color: "primary",
            action: ["next"],
          },
        ],
      },
      {
        step: 2,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "cancel",
            action: ["cancel"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            color: "primary",
            action: ["previous"],
          },
          {
            text: "Next",
            color: "primary",
            id: "next",
            action: ["next"],
          },
        ],
      },
      {
        step: 2,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "cancel",
            action: ["cancel"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            color: "primary",
            action: ["previous"],
          },
          {
            text: "Next",
            color: "primary",
            id: "next",
            action: ["next"],
          },
        ],
      },
      {
        step: 3,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "cancel",
            action: ["cancel"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            color: "primary",
            action: ["previous"],
          },
          {
            text: "Next",
            color: "primary",
            id: "add_team_members",
            action: ["next"],
          },
        ],
      },
      {
        step: 4,
        buttons: [
          {
            text: "Cancel",
            link: true,
            id: "cancel",
            action: ["cancel"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            color: "primary",
            action: ["previous"],
          },
          {
            text: "Next: Review and Submit",
            color: "primary",
            id: "review_and_submit",
            action: ["next"],
          },
        ],
      },
      {
        step: 5,
        buttons: [
          {
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            color: "primary",
            action: ["previous"],
          },
          {
            text:
              this.$route.name === "submit"
                ? "Provision Cloud Resources"
                : "Next",
            color: "primary",
            disabled: true,
            id: "postReview",
            action: ["next"],
          },
        ],
      },
    ],
  };

  get pageButtonPanel(): NavButtonPanel {
    return (
      this.wizardNavButtons.NavButtonPanels.find((buttonPanel) => {
        return buttonPanel.step === this.stepNumber;
      }) || this.wizardNavButtons.NavButtonPanels[0]
    );
  }
}
</script>
