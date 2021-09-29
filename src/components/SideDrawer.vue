<template>
  <v-navigation-drawer
    v-if="isSideDrawerOpen"
    :width="drawerWidth + 'px'"
    app
    clipped
    permanent
    right
    class="
      mb-16
      atat-side-drawer
      d-flex
      flex-column
      align-start
      overflow-y-hidden
      justify-space-between
      max-height-100
      height-100
      min-height-100
    "
  >
    <Profile></Profile>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import Profile from "./SideDrawerComponents/Profile.vue";

@Component({
  components: {
    Profile,
  },
})
export default class SideDrawer extends Vue {
  private contactInfoTip = false;
  private updateProfileTip = false;

  @Prop({ default: "400" }) private drawerWidth!: string;

  private user = this.$store.getters.getUser;
  get showScrollbar(): string {
    const show =
      window.innerHeight < 850 || this.updateProfileTip || this.contactInfoTip;
    return show ? "expandedSidebarDiv" : "";
  }

  /**
   * isSideDrawerOpen
   *
   * used to immediately focus on close button when
   * navigating w/keyboard and sidedrawer opens
   */

  get isSideDrawerOpen(): boolean {
    const isOpen = this.$store.state.sideDrawer;
    this.$nextTick(() => {
      const closeButton = document.getElementById("drawerCloser");
      if (isOpen && closeButton) {
        closeButton?.focus();
      }
    });
    return isOpen;
  }
  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeSideDrawer");
  }
}
</script>

<style scoped>
.expandedSidebarDiv {
  overflow-y: auto !important;
  height: calc(100% - 237px) !important;
  overflow-x: hidden !important;
}
</style>
