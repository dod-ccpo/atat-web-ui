<template>
  <v-container>
    <v-row>
      <v-col cols="12 d-flex justify-end">
        <v-btn
          v-for="button in pageButtonPanel.buttons"
          :ripple="false"
          :key="button.id"
          :color="button.primary ? 'primary' : ''"
          class="ml-4"
        >
        <!-- :class="[button.link ? 'link-button' :'' ,"ml-5"]" -->

          {{ button.text }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { NavigationButtons } from "../../../types/Wizard";

@Component({})
export default class ButtonNavigation extends Vue {
  @Prop({ default: "Link-Button" }) private linkButtonText!: string;

  @Prop({ default: "Save" }) private SaveButtonText!: string;
  @Prop({ default: "Cancel" }) private CancelButtonText!: string;
  @Prop() private wizardNavButtons!: NavigationButtons;

  private pageNumber = 1;
  private pageButtonPanel = this.wizardNavButtons.NavButtonPanels.find(
    (buttonPanel) => buttonPanel.step === this.pageNumber
  );
}
</script>
