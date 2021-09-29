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
    <div
      class="
        ml-auto
        d-flex
        align-center
        justify-space-between
        width-100
        py-4
        pl-6
      "
    >
      <div class="font-weight-bold body">{{ title.toUpperCase() }}</div>
      <div class="pr-7">
        <v-btn
          class="text--base-darkest h6 pa-0 icon-24"
          tabindex="3"
          text
          small
          @click.stop="hide"
          ref="drawerCloserRef"
          id="drawerCloser"
          :ripple="false"
        >
          <v-icon class="icon-20">close</v-icon>
        </v-btn>
      </div>
    </div>
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
  @Prop({ default: "Your Profile" }) private title!: string;

  get sideDrawerType(): string {
    return this.$store.state.sideDrawerType;
  }

  get isSideDrawerOpen(): boolean {
    console.log(this.$store.state.sideDrawer);
    const _isSideDrawerOpen = this.$store.state.sideDrawer;
    // const _isSideDrawerFocused = this.$store.state.isSideDrawerFocused;
    // if (_isSideDrawerOpen && _isSideDrawerFocused) {
    //   this.$nextTick(() => {
    //     document.getElementById("drawerCloser")?.focus();
    //   });
    // }
    return _isSideDrawerOpen;
  }

  @Watch("$store.state.isSideDrawerFocused")
  setFocus(newVal: boolean): void {
    if (newVal && this.isSideDrawerOpen) {
      setTimeout(function () {
        document.getElementById("drawerCloser")?.focus();
      }, 500);
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
