<template>
  <v-navigation-drawer
    markRaw="true"
    id="SlideoutPanel"
    class="_slideout-panel"
    :model-value="isSlideoutPanelOpen"
    transition="slide-x-reverse-transition"
    @transitionend="transitionEnded"
    :width="panelWidth + 'px'"
    location="right"
    :temporary="showOverlay"
    disable-resize-watcher
    rail
    rail-width="400"
  >
    <div
      v-if="panelTitle"
      class="_panel-header">
      <div class="_panel-title" id="PanelTitle" tabindex="-1">
        {{ panelTitle }}
      </div>
      <v-btn
        class="text-base-darkest pa-0 icon-24 _panel-closer"
        variant="text"
        size="small"
        @click.stop="closeSlideoutPanel"
        @keydown.enter="closeSlideoutPanel"
        @keydown.space="closeSlideoutPanel"
        ref="panelCloserRef"
        id="PanelCloser"
        :ripple="false"
        aria-label="Close panel"
      >
        <v-icon aria-hidden="true" class="icon-20">mdi-close</v-icon>
      </v-btn>
    </div>

    <div
      id="PanelWrap"
      class="_panel-content-wrap "
      :class="{'_portfolio' : isPortfolios}"
    >
      <slot v-if="currentPanelDefined"></slot>
    </div>

  </v-navigation-drawer>
</template>
<script lang="ts">
import AppSections from "@/store/appSections";
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import SlideoutPanel from "@/store/slideoutPanel/index";
import { markRaw } from "vue";

@Component({})
class ATATSlideoutPanel extends Vue {
  @Prop({ default: "380" }) private panelWidth!: string;
  @Prop({ default: false }) private alwaysOpen!: boolean;
  // below should be adjusted to work with order prop in template
  // :clipped="appSection === 'Portfolio Summary' || appSection === 'Portfolios'"
  public appSection = AppSections.activeAppSection;
  public transitionEnded(e: Event):void {
    const target = e.currentTarget as HTMLElement;
    if (target) {
      const isOpen = target.classList.contains('v-navigation-drawer--active');
      isOpen  
        ? SlideoutPanel.openSlideoutPanel("") 
        : SlideoutPanel.closeSlideoutPanel();
    }
  }
  get isPortfolios(): boolean {
    return AppSections.activeAppSection === "Portfolio Summary"
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
    return this.$vuetify.display.sm || this.$vuetify.display.xs;
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
export default markRaw(toNative(ATATSlideoutPanel))
</script>
