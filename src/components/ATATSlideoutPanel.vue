<template>
  <v-navigation-drawer
    v-if="isSlideoutPanelOpen"
    transition="slide-x-reverse-transition"
    :width="drawerWidth + 'px'"
    id="right-side-drawer"
    app
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
        Title slot here
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
      <!-- this is where slot will go -->
      side panel content here
      <slot></slot>
      <!-- <SampleSlideoutPanel
        :scrollableDivHeight="setScrollableDivHeight(95)"
      ></SampleSlideoutPanel> -->
    </div>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import SlideoutPanel from "@/store/slideoutPanel/index";

@Component({
  components: {
  },
})

export default class ATATSlideoutPanel extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  private clientHeight = document.getElementById("right-side-drawer")?.clientHeight;
  private offsetHeight = document.getElementById("right-side-drawer")?.offsetHeight;
  private appNavBarHeight = 0;
  private drawerHeaderHeight = 0;
  private drawerBottomMargin = 117;

  /*
   * returns height of window.innerHeight in pixels
   */
  get getHeight(): string {
    return window.innerHeight + "px";
  }

  /*
   * > adds click event listener to overlay if Displayed
   * > return isSlideoutPanelOpen
   */
  get isSlideoutPanelOpen(): boolean {
    const _isSlideoutPanelOpen = SlideoutPanel.slideoutPanelIsOpen;
    setTimeout(() => {
      if (_isSlideoutPanelOpen && this.showOverlay) {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.addEventListener("click", this.close);
      } else {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.removeEventListener("click", this.close);
      }
    }, 0);
  
    return _isSlideoutPanelOpen;
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
  @Watch("$store.state.slideoutPanelChange")
  slideoutPanelChange(): void {
    this.$nextTick(() => {
      if (this.$store.state.slideoutPanelIsOpen) {
        document.getElementById("PanelTitle")?.focus();
      } else {
        const returnFocusToElementId = this.$store.state.slideoutPanelOpenerId;
        setTimeout(function () {
          const focusEl =
            document.getElementById(returnFocusToElementId) ||
            document.getElementsByTagName("h1")[0];
          focusEl?.focus();
        }, 100);
        this.$store.state.slideoutPanelOpenerId = "";
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
    this.$store.dispatch("closeSlideoutPanel");
  }
}
</script>
