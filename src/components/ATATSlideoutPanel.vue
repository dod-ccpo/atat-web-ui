<template>
  <v-navigation-drawer
    v-if="isSlideoutPanelOpen"
    transition="slide-x-reverse-transition"
    :width="drawerWidth + 'px'"
    id="SlideoutPanel"
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
    <div class="_panel-header">
      <div class="_panel-title" id="PanelTitle" tabindex="-1">
        {{ panelTitle }} 
      </div>
      <v-btn
        class="text--base-darkest pa-0 icon-24"
        text
        small
        @click.stop="closeSlideoutPanel"
        ref="drawerCloserRef"
        id="drawerCloser"
        :ripple="false"
        aria-label="Close panel"
      >
        <v-icon aria-hidden="true" class="icon-20">close</v-icon>
      </v-btn>
    </div>

    <div class="_panel-content-wrap">
      <slot></slot>
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
  @Prop({ default: "380" }) private drawerWidth!: string;
  private clientHeight = document.getElementById("right-side-drawer")?.clientHeight;
  private offsetHeight = document.getElementById("right-side-drawer")?.offsetHeight;
  private appNavBarHeight = 0;
  private drawerHeaderHeight = 0;
  private drawerBottomMargin = 117;

  get panelTitle(): string {
    return SlideoutPanel.slideoutPanelTitle;
  }
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
          ?.addEventListener("click", this.closeSlideoutPanel);
      } else {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.removeEventListener("click", this.closeSlideoutPanel);
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
  @Watch("isSlideoutPanelOpen")
  slideoutPanelToggle(isOpen: boolean): void {
    this.$nextTick(() => {
      if (isOpen) {
        document.getElementById("PanelTitle")?.focus();
      } else {
        const returnFocusToElementId = SlideoutPanel.slideoutPanelOpenerId;
        setTimeout(function () {
          const focusEl =
            document.getElementById(returnFocusToElementId) ||
            document.getElementsByTagName("h1")[0];
          focusEl?.focus();
        }, 100);
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
  private closeSlideoutPanel(): void {
    SlideoutPanel.closeSlideoutPanel();
  }
}
</script>
