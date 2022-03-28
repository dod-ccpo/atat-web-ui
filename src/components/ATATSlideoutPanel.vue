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


      <div class="font-weight-bold body" id="PanelTitle" tabindex="-1">
        {{ setTitle }}
      </div>
      <div class="pr-7">
        <v-btn
          class="text--base-darkest pa-0 icon-24"
          text
          small
          @click.stop="close"
          ref="drawerCloserRef"
          id="drawerCloser"
          :ripple="false"
          aria-label="Close panel"
        >
          <v-icon aria-hidden="true" class="icon-20">close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="pb-10">
      <SampleSideDrawer
        v-if="sideDrawerType === 'sampleSideDrawer'"
        :scrollableDivHeight="setScrollableDivHeight(95)"
      ></SampleSideDrawer>
    </div>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import SampleSideDrawer from "./SideDrawerComponents/ProfileDrawer.vue";

@Component({
  components: {
    SampleSideDrawer,
  },
})

export default class SideDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  private clientHeight =
    document.getElementById("right-side-drawer")?.clientHeight;
  private offsetHeight =
    document.getElementById("right-side-drawer")?.offsetHeight;
  private appNavBarHeight = 112;
  private drawerHeaderHeight = 60;
  private drawerBottomMargin = 117;

  /*
   * returns SideDrawer type
   */
  get sideDrawerType(): string {
    return this.$store.state.sideDrawerType;
  }

  /*
   * sets Title of SideDrawer 
   * EJY can we send the title as a prop instead?????
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
      case "portfoliofilter":
        title = "Filter Your Results";
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
    const _isSideDrawerOpen = this.$store.state.sideDrawerIsOpen;
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
   * returns boolean to show overlay when breakpoint is either sm or xs
   */
  get showOverlay(): boolean {
    return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
  }

  /* A watcher used to set focus on the opener when the side drawer is changed.
   * When drawer is closed, return focus to opener. If opener is no longer in the DOM, focus on first h1.
   * When drawer is opened, set focus to panel title.
   */
  @Watch("$store.state.sideDrawerChange")
  sideDrawerChange(): void {
    this.$nextTick(() => {
      if (this.$store.state.sideDrawerIsOpen) {
        document.getElementById("PanelTitle")?.focus();
      } else {
        const returnFocusToElementId = this.$store.state.sideDrawerOpenerId;
        setTimeout(function () {
          const focusEl =
            document.getElementById(returnFocusToElementId) ||
            document.getElementsByTagName("h1")[0];
          focusEl?.focus();
        }, 100);
        this.$store.state.sideDrawerOpenerId = "";
      }
    });
  }

  /*
   * subtracts nonScrollableHeight & drawerHeight
   * window.innerHeight to determine scrollableDiv within drawer
   */
  private setScrollableDivHeight(nonScrollableHeight: number): number {
    nonScrollableHeight = nonScrollableHeight || 0;
    const scrollableDivHeight = window.innerHeight - nonScrollableHeight - this.drawerHeaderHeight;
    return scrollableDivHeight;
  }
  // close drawer event
  private close(): void {
    this.$store.dispatch("closeSideDrawer");
  }
}
</script>
