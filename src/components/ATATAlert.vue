<template>
  <div
    v-if="show"
    :role="role"
    class="_atat-alert"
    :class="getClasses"
    :id="id"
    :style="[{ 'max-width': maxWidth + 'px' }, { 'min-width' : minWidth + 'px' }]"
  >
    <div
      class="_content d-flex"
      :style="{ 'max-height': maxHeight + 'px' }"
      :class="{ 'pt-6 pr-6': maxHeight }"
    >
      <div
        v-if="type !== 'callout'"
        class="pr-4"
      >
        <i
          aria-hidden="true"
          :class="[
            getIconSize(),
            'v-icon notranslate material-icons theme--light',
          ]"
        >
          {{ getIcon() }}
        </i>
      </div>
      <div class="width-100">
        <slot name="content"></slot>
        <div
          v-if="maxHeight"
          style="height: 60px; display: block; width: 100%"
        >
        </div>
      </div>
      <div
        v-if="closeButton"
        class="
          text-center
          pr-0
          pl-4
          pt-1
          mx-0
          d-flex
          flex-column
          align-start
          ml-auto
        "
      >
        <v-btn
          icon
          :ripple="false"
          x-small
          aria-label="Close alert"
          @click="close"
        >
          <v-icon
            aria-hidden="true"
            class="
              notranslate
              material-icons
              theme--light
              text-base-darkest
              icon-20
            "
          >
            close
          </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({})
export default class ATATAlert extends Vue {
  @Prop({default: "presentation"}) private role?: string;
  @Prop({default: true}) private show?: boolean;
  @Prop({default: "Alert"}) private id?: string;
  @Prop({default: ""}) private maxHeight?: string;
  @Prop({default: ""}) private maxWidth?: string;
  @Prop({default: ""}) private minWidth?: string;

  /**
   * type: 1) info, 2) error, 3) warning, 4) success, 5) callout
   * NOTE:
   * type "callout" will never have an icon or border - general info
   * all other types are alerts and will always have an icon and border
   */
  @Prop({default: "error"}) private type?: string;

  /**
   * default is info-lighter
   */
  @Prop({default: "info-lighter"}) private calloutBackground?: string;

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
    alertClasses = this.borderLeft ? alertClasses + " _border-left-thick" : alertClasses;
    alertClasses = this.maxHeight ? alertClasses + " py-0 pr-0" : alertClasses;
    return alertClasses;
  }

  private getIconSize(): string {
    return this.size === "large" ? "icon-24" : "icon-20";
  }

  private getIcon(): string | unknown {
    return (this.type === "success") ? "check_circle" : this.type;
  }

  private close(): void {
    if(this.id == "TaskOrderDetailsAlert"){
      AcquisitionPackage.setTaskOrderDetailsAlertClosed(true)
    }
    this.show = false;
  }
}
</script>
