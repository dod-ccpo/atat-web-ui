<template>
  <div
    v-if="show"
    :role="role"
    class="_atat-alert"
    :class="[
      getClasses, 
      { '_has-expandable-header' : getHasExpandableHeader },
      { '_expandable-header-is-closed ' : getExpandableHeaderIsOpen }
    ]"
    :id="id"
    :style="[{ 'max-width': maxWidth + 'px' }, { 'min-width' : minWidth + 'px' }]"
  >
    <div
      class="_content d-flex"
      :style="{ 'max-height': maxHeight + 'px' }"
      :class="{ 'pt-6 pr-6': maxHeight }"
    >
      <div
        v-if="type !== 'callout' && showIcon"
        class="pr-4"
      >
        <v-icon
          aria-hidden="true"
          :class="[
            getIconSize(),
            'v-icon notranslate material-icons theme--light',
          ]"
        >
          {{ getIcon() }}
        </v-icon>
      </div>
      <div class="width-100">
        <slot name="content"></slot>
        <div
          v-if="maxHeight"
          style="height: 60px; display: block; width: 100%"
        >
        </div>
      </div>

      <v-btn 
        v-if="closeButton" 
        class="_alert-close-btn"
        icon :ripple="false" 
        size="x-small" 
        aria-label="Close alert" 
        @click="close"
      >
        <v-icon aria-hidden="true" class="text-base-darkest icon-20">
          mdi-close
        </v-icon>
      </v-btn>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import PortfolioStore from "@/store/portfolio";

@Component({})
class ATATAlert extends Vue {
  @Prop({default: "presentation"}) private role?: string;
  @Prop({default: true}) private show?: boolean;
  @Prop({default: "Alert"}) private id?: string;
  @Prop({default: ""}) private maxHeight?: string;
  @Prop({default: ""}) private maxWidth?: string;
  @Prop({default: ""}) private minWidth?: string;
  @Prop({default: true}) private showIcon?: boolean;
  @Prop() public hasExpandableHeader?: boolean;
  @Prop() public expandableHeaderIsOpen?: boolean;

  public get getHasExpandableHeader(): boolean {
    return this.hasExpandableHeader || false;
  }
  public get getExpandableHeaderIsOpen(): boolean {
    return this.expandableHeaderIsOpen || false;
  }

  /**
   * type: 1) info (primary), 2) error, 3) warning, 4) success, 5) callout
   * NOTE:
   * type "callout" will never have an icon or border - general info
   * all other types are alerts and will always have an icon and border
   */
  @Prop({default: "error"}) private type?: string;

  /**
   * default is primary-lighter
   */
  @Prop({default: "primary-lighter"}) private calloutBackground?: string;

  /**
   * size: 1) large or 2)small
   * large size will render a 8px left border and 20px icon
   * small size will render a 4px left border and 16px icon
   */
  @Prop({default: "small"}) private size?: string;
  @Prop({default: false}) private borderLeft?: boolean;
  @Prop({default: false}) private closeButton?: boolean;

  public get getClasses(): string {
    let alertClasses = ""
    if (this.type === "callout") {
      alertClasses = this.maxHeight ? "_callout _scrollable py-0 pr-0" : "_callout";
      return alertClasses + " bg-" + this.calloutBackground;
    }
    alertClasses = "_" + this.type + "-alert";
    alertClasses = this.borderLeft ? alertClasses + "_border-left-thick" : alertClasses;
    alertClasses = this.maxHeight ? alertClasses + "py-0 pr-0" : alertClasses;
    return alertClasses;
  }

  private getIconSize(): string {
    return this.size === "large" ? "icon-24" : "icon-20";
  }

  private getIcon(): string | unknown {
    switch (this.type) {
    case "success" : return "mdi-check-circle";
    case "info" : return "mdi-information";
    case "error" : return "mdi-alert-circle";
    case "warning" : return "mdi-alert"
    default: return "";
    }
  }

  private close(): void {
    if(this.id == "TaskOrderDetailsAlert"){
      PortfolioStore.setTaskOrderDetailsAlertClosed(true)
    }
    this.show = false;
  }
}
export default toNative(ATATAlert)
</script>