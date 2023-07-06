<template>
  <div class="mb-5 copy-max-width">
    <a
      @click="open = !open"
      @keydown.enter="open = !open"
      @keydown.space="open = !open"
      class="expandable-content-opener pb-2"
      :class="[
        open ? 'open' : 'closed',
        { 'no-text-decoration': !hasUnderline },
      ]"
      role="button"
      tabindex="0"
      :aria-controls="'Content_' + ariaId"
      :aria-expanded="open + ''"
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
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ExpandableLink extends Vue {
  private open = false;

  @Prop({ required: true }) ariaId!: string;
  @Prop({ default: true }) hasUnderline!: boolean;
  
}
</script>
