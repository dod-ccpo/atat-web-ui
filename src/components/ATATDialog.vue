<template>
  <!-- :max-width="width + 'px'" -->
  <v-dialog
    @keydown.esc="hide"
    persistent
    v-model="isModalOpen"
    :width="width"
    transition="fade-transition"
    origin="center center"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Privacy Policy
      </v-card-title>

      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <v-text-field full-width placeholder="cletus"></v-text-field>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="hide"> I accept </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import ProfileDrawer from "./SideDrawerComponents/ProfileDrawer.vue";
@Component({
  components: {
    ProfileDrawer,
  },
})
export default class ATATDialog extends Vue {
  @Prop({ default: "400" }) private width!: string;
  @Prop({ default: "400" }) private height!: string;
  @Prop() private title!: string;

  get getModalType(): string {
    return this.$store.state.modalType;
  }

  get getHeight(): string {
    const drawerHeight = window.innerHeight;
    return drawerHeight + "px";
  }

  get isModalOpen(): boolean {
    return this.$store.state.isModalDisplayed;
  }

  /* if necessary,  to set focus on a custom element 
  set a class of 'firstFocus' on the element that will 
  @Watch("$store.state.isModalFocused")
  setFocus(newVal: boolean): void {
    const firstFocusedElement = document.getElementsByClassName(
      "firstFocus"
    )[0] as HTMLElement;
    if (newVal && this.isModalOpen && firstFocusedElement) {
      setTimeout(function () {
        firstFocusedElement?.focus();
      }, 500);
    }
  }

  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeModal");
  }
}
</script>
