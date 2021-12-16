<template>
  <div
    v-if="show"
    :role="role"
    :class="[
      getBorderWidth(),
      type + '_alert',
      'v-application d-block atat-alert black--text body-lg',
    ]"
  >
    <div class="d-flex justify-start pa-4 pr-5">
      <div
        v-if="showIcon"
        class="text-center px-0 pt-1 d-flex flex-column align-start"
      >
        <i
          aria-hidden="true"
          :class="[
            getIconSize(),
            'v-icon notranslate material-icons theme--light text--base-darkest',
          ]"
        >
          {{ getIcon() }}
        </i>
      </div>
      <div class="body-lg black--text pl-4 content-max-width">
        <slot name="content"></slot>
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
              text--base-darkest
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

@Component({})
export default class ATATAlert extends Vue {
  @Prop({ default: "presentation" }) private role?: string;
  @Prop({ default: "" }) private icon?: string;
  @Prop({ default: true }) private showIcon?: boolean;
  @Prop({ default: true }) private show?: boolean;

  /**
   * type: 1) info, 2) error, 3) warning
   */
  @Prop({ default: "error" }) private type?: string;

  /**
   * size: 1) large or 2)small
   * large size will render a 8px left border and 20px icon
   * small size will render a 4px left border and 16px icon
   */
  @Prop({ default: "large" }) private size?: string;
  @Prop({ default: true }) private outlined?: boolean;
  @Prop({ default: true }) private closeButton?: boolean;

  private getBorderWidth(): string {
    return "border-left-" + (this.size === "large" ? "thick" : "slim");
  }

  private getIconSize(): string {
    return this.size === "large" ? "icon-20" : "icon-16";
  }

  private getIcon(): string | unknown {
    if (this.icon === "") {
      return this.type === "success" ? "check_circle" : this.type;
    }
    return this.icon;
  }

  private close(): void {
    this.show = false;
  }
}
</script>
