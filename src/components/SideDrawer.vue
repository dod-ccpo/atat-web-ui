<template>
  <v-navigation-drawer
    v-if="isSideDrawerOpen"
    :width="drawerWidth + 'px'"
    app
    clipped
    permanent
    right
    tabindex="3"
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
    <Profile
      v-if="sideDrawerType === 'profile'"
      :drawerWidth="drawerWidth"
    ></Profile>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import Profile from "./SideDrawerComponents/Profile.vue";

@Component({
  components: {
    Profile,
  },
})
export default class SideDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;

  get sideDrawerType(): string {
    return this.$store.state.sideDrawerType;
  }

  get isSideDrawerOpen(): boolean {
    return this.$store.state.sideDrawer;
  }

  @Watch("$store.state.isSideDrawerFocused")
  setFocus(newVal: boolean): void {
    if (newVal) {
      this.$nextTick(() => {
        document.getElementById("drawerCloser")?.focus();
      });
    }
  }

  /**
   * getFocus
   *
   * used to immediately focus on close button when
   * navigating w/keyboard and sidedrawer opens
   */

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
