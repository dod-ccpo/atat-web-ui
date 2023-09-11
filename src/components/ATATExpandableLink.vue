<template>
  <div
      :class="[
        { 'copy-max-width': isCopyMaxWidth },
        { 'mb-5': !hoverableInAlert },
        { 'mb-n4': hoverableInAlert }
      ]"
  >
    <v-expand-transition v-if="contentAtTop" >
      <div v-show="isOpen" :id="'Content_' + ariaId" :aria-hidden="!open + ''">
        <slot name="content"></slot>
      </div>
    </v-expand-transition>
    <a
      @click="toggleOpen"
      @keydown.enter="toggleOpen"
      @keydown.space="toggleOpen"
      class="expandable-content-opener"
      :class="[
        contentAtTop? '_contentAtTop':'',
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
      <span v-if="contentAtTop">
        {{moreOrLess}}
      </span>
      <slot v-else name="header"></slot>
    </a>
    <v-expand-transition v-if="!contentAtTop">
      <div v-show="isOpen" :id="'Content_' + ariaId" :aria-hidden="!open + ''">
        <slot name="content"></slot>
      </div>
    </v-expand-transition>  
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";

@Component({})
export default class ExpandableLink extends Vue {

  @Prop({ required: true }) ariaId!: string;
  @Prop({ default: true }) hasUnderline?: boolean;
  @Prop({ default: true }) isCopyMaxWidth?: boolean;
  @Prop({ default: false }) hoverableInAlert?: boolean;
  @Prop({ default: false }) contentAtTop?: boolean;
  @PropSync("open", { default: false }) _open?: boolean;

  public isOpen = false;

  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
    this._open = this.isOpen;
  }

  public get moreOrLess(): string {
    return this.isOpen ? "Show less":"Show more"
  }

  public mounted(): void {
    this.isOpen = this._open !== undefined ? this._open : false;
  }

}
</script>
