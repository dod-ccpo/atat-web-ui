<template>
  <div class="mb-5 body-lg">
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
      {{ header }}
    </a>
    <div v-show="open">
      <v-card-text class="pb-0">
        <v-row class="mt-n5 ml-n7">
          <v-col class="content-max-width">
            <span
              class="body-lg"
              :id="'content_' + ariaId"
              :aria-hidden="!open + ''"
              v-html="content"
            ></span>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ExpandableLink extends Vue {
  private open = false;

  @Prop({ required: true }) header!: string;
  @Prop({ required: true }) content!: string;

  get ariaId(): string {
    return (
      "button_" +
      this.header
        .toLowerCase()
        .substring(0, 30)
        .replace(/[^A-Z0-9]+/gi, "_")
    );
  }
}
</script>
