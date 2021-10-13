<template>
  <v-navigation-drawer
    v-if="isSideDrawerOpen"
    transition="slide-x-reverse-transition"
    :width="drawerWidth + 'px'"
    id="right-side-drawer"
    app
    clipped
    :temporary="showOverlay"
    permanent
    right
    tabindex="3"
    :style="{
      height: getHeight,
      'max-height': getHeight,
      'min-height': getHeight,
    }"
  >
    <div
      class="
        ml-auto
        d-flex
        align-center
        justify-space-between
        width-100
        py-5
        pl-6
      "
    >
      <div class="font-weight-bold body">{{ setTitle }}</div>
      <div class="pr-7">
        <v-btn
          class="text--base-darkest h6 pa-0 icon-24"
          tabindex="3"
          text
          small
          @click.stop="close"
          ref="drawerCloserRef"
          id="drawerCloser"
          :ripple="false"
        >
          <v-icon class="icon-20">close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="pb-10">
      <ProfileDrawer
        v-if="sideDrawerType === 'profile'"
        :scrollableDivHeight="setScrollableDivHeight(95)"
      ></ProfileDrawer>
      <SubmitDrawer v-if="sideDrawerType === 'submit'"></SubmitDrawer>
      <TeamMemberRolesDrawer
        v-if="sideDrawerType === 'teammemberroles'"
        :scrollableDivHeight="setScrollableDivHeight()"
        class="overflow-y-auto"
        tabindex="3"
      ></TeamMemberRolesDrawer>
    </div>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import ProfileDrawer from "./SideDrawerComponents/ProfileDrawer.vue";
import SubmitDrawer from "./SideDrawerComponents/SubmitDrawer.vue";
import TeamMemberRolesDrawer from "./SideDrawerComponents/TeamMemberRolesDrawer.vue";

@Component({
  components: {
    ProfileDrawer,
    SubmitDrawer,
    TeamMemberRolesDrawer,
  },
})
export default class SideDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  private clientHeight =
    document.getElementById("right-side-drawer")?.clientHeight;
  private offsetHeight =
    document.getElementById("right-side-drawer")?.offsetHeight;
  private appNavBarHeight = 112;
  private drawerHeaderHeight = 64;
  private drawerBottomMargin = 117;

  /*
   * returns SideDrawer type
   */
  get sideDrawerType(): string {
    return this.$store.state.sideDrawerType;
  }

  /*
   * sets Title of SideDrawer
   */
  get setTitle(): string {
    let title = "";
    switch (this.sideDrawerType) {
      case "profile":
        title = "Your Profile";
        break;
      case "submit":
      case "teammemberroles":
        title = "Learn More";
        break;
      default:
        break;
    }
    return title.toUpperCase();
  }

  /*
   * returns height of window.innerHeight in pixels
   */
  get getHeight(): string {
    return window.innerHeight + "px";
  }

  /*
   * > adds click event listener to overlay if Displayed
   * > return isSideDrawerOpen
   */
  get isSideDrawerOpen(): boolean {
    const _isSideDrawerOpen = this.$store.state.sideDrawer;
    setTimeout(() => {
      if (_isSideDrawerOpen && this.showOverlay) {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.addEventListener("click", this.close);
      } else {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.removeEventListener("click", this.close);
      }
    }, 0);

    return _isSideDrawerOpen;
  }

  /*
   * showOverlay
   * returns boolean to show overlay when
   * breakpoint is either sm or xs
   */
  get showOverlay(): boolean {
    return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
  }

  /* a watcher used to set focus on the close button if
   * keyboard event is used to open the side drawer.
   */
  @Watch("$store.state.isSideDrawerFocused")
  setFocus(newVal: boolean): void {
    if (newVal && this.isSideDrawerOpen) {
      setTimeout(function () {
        document.getElementById("drawerCloser")?.focus();
      }, 500);
    }
  }

  /*
   * subtracts nonScrollableHeight & drawerHeight & appNavBarHeight
   * window.innerHeight to determine scrollableDiv within drawer
   */
  private setScrollableDivHeight(nonScrollableHeight: number): number {
    nonScrollableHeight = nonScrollableHeight || 0;
    const scrollableDivHeight =
      window.innerHeight -
      nonScrollableHeight -
      this.drawerHeaderHeight -
      this.appNavBarHeight;
    return scrollableDivHeight;
  }
  // close drawer event
  private close(): void {
    this.$store.state.sideDrawer = false;
  }
}
</script>
