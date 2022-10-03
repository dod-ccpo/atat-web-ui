<template>
  <v-navigation-drawer
    id="SlideoutPanel"
    class="_slideout-panel"
    v-model="isSlideoutPanelOpen"
    transition="slide-x-reverse-transition"
    @transitionend="transitionEnded"
    :width="panelWidth + 'px'"
    app
    right
    :clipped="appSection === 'Portfolio Summary' || appSection === 'Portfolios'"
    :temporary="showOverlay"
    disable-resize-watcher
  >
    <div
      v-if="panelTitle"
      class="_panel-header">
      <div class="_panel-title" id="PanelTitle" tabindex="-1">
        {{ panelTitle }}
      </div>
      <v-btn
        class="text-base-darkest pa-0 icon-24 _panel-closer"
        text
        small
        @click.stop="closeSlideoutPanel"
        ref="panelCloserRef"
        id="PanelCloser"
        :ripple="false"
        aria-label="Close panel"
      >
        <v-icon aria-hidden="true" class="icon-20">close</v-icon>
      </v-btn>
    </div>

    <div id="PanelWrap" class="_panel-content-wrap">
      <slot v-if="currentPanelDefined"></slot>
    </div>

  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";
import AppSections from "@/store/appSections";
import { Component, Prop, Watch } from "vue-property-decorator";

import SlideoutPanel from "@/store/slideoutPanel/index";

@Component({})

export default class ATATSlideoutPanel extends Vue {
  @Prop({ default: "380" }) private panelWidth!: string;
  @Prop({ default: false }) private alwaysOpen!: boolean;

  
  public appSection = AppSections.activeAppSection;
  public transitionEnded(e: Event):void {
    const target = e.currentTarget as HTMLElement;
    if (target) {
      const isOpen = target.classList.contains('v-navigation-drawer--open');
      isOpen ? SlideoutPanel.openSlideoutPanel("") : SlideoutPanel.closeSlideoutPanel();
    }
  }

  get panelTitle(): string {
    return SlideoutPanel.slideoutPanelTitle;
  }

  get currentPanelDefined(): boolean {
    return SlideoutPanel.slideoutPanelHasComponent;
  }

  private isOpen = false;
  set isSlideoutPanelOpen(isOpen: boolean) {
    this.isOpen = this.alwaysOpen ? this.alwaysOpen : isOpen;
  }
  /*
   * adds click event listener to overlay if Displayed
   * return isSlideoutPanelOpen
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

  /* A watcher used to set focus on the opener when the slideout panel is toggled.
   * When panel is closed, return focus to opener. If opener is no longer in the DOM,
   * focus on first h1. When panel is opened, set focus to panel title.
   */
  @Watch("isSlideoutPanelOpen")
  slideoutPanelToggle(isOpen: boolean): void {
    this.$nextTick(() => {
      if (isOpen) {
        setTimeout(()=> {
          document.getElementById("PanelTitle")?.focus();
        }, 100)
        const wrapper = document.getElementById("PanelWrap");
        if (wrapper) {
          wrapper.scrollTop = 0;
        }
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

  private closeSlideoutPanel(): void {
    SlideoutPanel.closeSlideoutPanel();
  }
}
</script>
