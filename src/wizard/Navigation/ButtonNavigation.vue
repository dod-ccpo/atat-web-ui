<template>
  <nav
    ref="buttonNavigation"
    class="d-flex justify-end wizard-button-nav"
    :style="{ width: getbuttonNavBarWidth }"
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
      class="mr-5"
      :class="{
        'link-button no-focus-shift': button.link,
        'secondary-btn': button.secondary,
        'd-none': isReturnToStep5 && button.text === 'Previous',
      }"
      role="link"
    >
      {{ getButtonText(button) }}
    </v-btn>
  </nav>
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
    if (
      this.$store.state.currentStepNumber === 5 &&
      this.$store.getters.getInvalidSteps.length &&
      text.toLowerCase() === "next"
    ) {
      return true;
    } else if (
      text.toLowerCase() === "next" &&
      this.$route.name === "postreview"
    ) {
      return this.$store.getters.getisUserAuthorizedToProvisionCloudResources
        ? false
        : true;
    }
    return false;
  }

  get getbuttonNavBarWidth(): string {
    const windowWidth = window.innerWidth;
    const smBreakPoint = this.$vuetify.breakpoint.sm;
    const _isSideDrawerOpened = this.$store.state.sideDrawerIsOpen;

    if (_isSideDrawerOpened && smBreakPoint) {
      return "100%";
    }

    return (
      (_isSideDrawerOpened ? ((windowWidth - 400) / windowWidth) * 100 : 100) +
      "%"
    );
  }

  get isReturnToStep5(): boolean {
    return this.$store.getters.isReturnToReviewAndSubmit;
  }

  private getButtonText(button: any): string {
    if (button.action[0] === "next" && this.isReturnToStep5) {
      return "Return to Review and Submit";
    }
    return button.text;
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
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            secondary: true,
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
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            secondary: true,
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
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            secondary: true,
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
            text: "Save and Close",
            link: true,
            id: "save_and_close",
            action: ["save", "close"],
          },
          {
            text: "Previous",
            outlined: true,
            id: "previous",
            secondary: true,
            color: "primary",
            action: ["previous"],
          },
          {
            text: "Next",
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
            secondary: true,
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
    return this.wizardNavButtons.NavButtonPanels.find((buttonPanel) => {
        return buttonPanel.step === this.stepNumber;
      }) || this.wizardNavButtons.NavButtonPanels[0];

    // // if state returnToReviewAndSubmit === true,
    // //   • find the "next" button and change text to "Next: Review and Submit"
    // //   • remove "Previous" button
    // const nextStep5 = this.$store.getters.isReturnToReviewAndSubmit;
    // const nextBtnIndex = buttonsObj.buttons.findIndex(
    //   (button) => button.action[0] === "next"
    // );
    // if (nextStep5 && nextBtnIndex > -1) {
    //   buttonsObj.buttons[nextBtnIndex].text = "Return to Review and Submit";
    //   buttonsObj.buttons[nextBtnIndex].id = "review_and_submit";
    //   const prevBtnIndex = buttonsObj.buttons.findIndex(
    //     (button) => button.action[0] === "previous"
    //   );
    //   if (prevBtnIndex > -1) {
    //     buttonsObj.buttons.splice(prevBtnIndex, 1);
    //   }
    // } else if (nextBtnIndex > -1) {
    //   buttonsObj.buttons[nextBtnIndex].text = "Next";
    //   buttonsObj.buttons[nextBtnIndex].id = "next";
    // }

    // return buttonsObj;
  }
}
</script>
