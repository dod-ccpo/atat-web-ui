<template>
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
    <manage-members
      v-if="dialog.type === 'manageMembers'"
      :class="getInnerContentClasses"
      :close.sync="dialog.isDisplayed"
      :dialogProps="dialogProps"
      @membersAdded="onMembersAdded"
      @memberEdited="onMemberEdited(memberType)"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Dialog } from "types/Global";
import { Component, Prop, Watch } from "vue-property-decorator";
import ManageMembers from "../wizard/Step4/components/ManageMembers.vue";

@Component({
  components: {
    ManageMembers,
  },
})
export default class ATATDialog extends Vue {
  @Prop() private title!: string;

  get dialog(): Dialog {
    return this.$store.state.dialog;
  }

  get dialogProps(): any | null {
    return this.dialog.props;
  }

  get getInnerContentClasses(): string {
    return "height-100 d-flex flex-column justify-space-between";
  }

  /*
   * sets focus on element with 'firstFocus' class
   */
  @Watch("$store.state.dialog.isDisplayed")
  setFocus(newVal: boolean): void {
    this.$nextTick(() => {
      const firstFocusedElement = document.getElementsByClassName(
        "firstFocus"
      )[0] as HTMLElement;
      if (newVal && this.dialog.isDisplayed && firstFocusedElement) {
        setTimeout(function () {
          firstFocusedElement?.focus();
        }, 100);
      }
    });
  }

  public onMembersAdded(memberCount: number): void {
    const plural = memberCount > 1 ? "s" : "";
    const message = memberCount + " team  member" + plural + " added";
    this.$store.dispatch("toast", [message, "toast-success"]);
  }

  public onMemberEdited(memberType: string): void {
    this.$store.dispatch("toast", [
      memberType + "info updated",
      "toast-success",
    ]);
  }
}
</script>
