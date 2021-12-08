<template>
  <div class="mb-5 body-lg content-max-width">
    <a
      @click="open = !open"
      @keydown.enter="open = !open"
      @keydown.space="open = !open"
      class="expandable-content-opener"
      :class="open ? 'open' : 'closed'"
      role="button"
      tabindex="0"
      :aria-controls="'content_' + ariaId"
      :aria-expanded="open + ''"
      :id="'button_' + ariaId"
    >
      <slot name="header"></slot>
    </a>
    <div v-show="open" :id="'content_' + ariaId" :aria-hidden="!open + ''">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ExpandableLink extends Vue {
  private open = false;

  @Prop({ required: true }) ariaId!: string;
}
</script>
