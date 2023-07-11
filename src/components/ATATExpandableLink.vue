<template>
  <div
      :class="[
        { 'copy-max-width': isCopyMaxWidth },
        { 'mb-5': !hoverableInAlert },
        { 'mb-n4': hoverableInAlert }
      ]"
  >
    <a
      @click="toggleOpen"
      @keydown.enter="toggleOpen"
      @keydown.space="toggleOpen"
      class="expandable-content-opener"
      :class="[
        isOpen ? 'open' : 'closed',
        { 'no-text-decoration': !hasUnderline },
        { '_hoverable-in-alert': hoverableInAlert },
        { 'pb-2': !hoverableInAlert},
      ]"
      role="button"
      tabindex="0"
      :aria-controls="'Content_' + ariaId"
      :aria-expanded="isOpen + ''"
      :id="'Button_' + ariaId"
    >
      <slot name="header"></slot>
    </a>
    <v-expand-transition>
      <div v-show="isOpen" :id="'Content_' + ariaId" :aria-hidden="!open + ''">
        <slot name="content"></slot>
      </div>
    </v-expand-transition>  
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";

@Component({})
export default class ExpandableLink extends Vue {

  @Prop({ required: true }) ariaId!: string;
  @Prop({ default: true }) hasUnderline?: boolean;
  @Prop({ default: true }) isCopyMaxWidth?: boolean;
  @Prop({ default: false }) hoverableInAlert?: boolean;
  @PropSync("open", { default: false }) _open?: boolean;

  public isOpen = false;

  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
    this._open = this.isOpen;
  }

  public mounted(): void {
    this.isOpen = this._open !== undefined ? this._open : false;
  }

}
</script>
