<template>
  <div
      class="mb-5"
      :class="[
        { 'copy-max-width': isCopyMaxWidth },
      ]"
  >
    <a
      @click="_open = !_open"
      @keydown.enter="_open = !_open"
      @keydown.space="_open = !_open"
      class="expandable-content-opener pb-2"
      :class="[
        _open ? 'open' : 'closed',
        { 'no-text-decoration': !hasUnderline },
      ]"
      role="button"
      tabindex="0"
      :aria-controls="'Content_' + ariaId"
      :aria-expanded="_open + ''"
      :id="'Button_' + ariaId"
    >
      <slot name="header"></slot>
    </a>
    <v-expand-transition>
      <div v-show="open" :id="'Content_' + ariaId" :aria-hidden="!open + ''">
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
  @PropSync("open", { default: false }) _open?: boolean;
}
</script>
