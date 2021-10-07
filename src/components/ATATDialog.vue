<template>
  <!-- :max-width="width + 'px'" -->
  <v-dialog
    @keydown.esc="hide"
    persistent
    :width="dialog.width"
    v-model="dialog.isDisplayed"
    transition="fade-transition"
    origin="center center"
    :content-class="
      'height-' +
      dialog.height +
      ' max-height-' +
      dialog.height +
      ' min-height-' +
      dialog.height
    "
    attach
  >
    <add-members
      v-if="dialog.type === 'addMembers'"
      :class="getInnerContentClasses"
      :close.sync="dialog.isDisplayed"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Dialog } from "types/FormFields";
import { Component, Prop, Watch } from "vue-property-decorator";
import AddMembers from "../wizard/Step4/components/AddMembers.vue";

@Component({
  components: {
    AddMembers,
  },
})
export default class ATATDialog extends Vue {
  @Prop() private title!: string;

  get dialog(): Dialog {
    return this.$store.state.dialog;
  }
  private isModalClosed = true;

  get getInnerContentClasses(): string {
    return "height-100 d-flex flex-column justify-space-between";
  }

  /*
   * sets focus on element with 'firstFocus' class
   */
  @Watch("$store.state.dialog.isDisplayed")
  setFocus(newVal: boolean): void {
    const firstFocusedElement = document.getElementsByClassName(
      "firstFocus"
    )[0] as HTMLElement;
    if (newVal && this.dialog.isDisplayed && firstFocusedElement) {
      setTimeout(function () {
        firstFocusedElement?.focus();
      }, 500);
    }
  }
}
</script>
