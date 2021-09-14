<template>
  <div>
    <v-btn
      @click="open = !open"
      text
      x-small
      :ripple="false"
      class="pl-0 primary--text"
    >
      <span class="link-body-md">{{ header }} </span>
      <v-icon>
        {{ open ? "expand_less" : "expand_more" }}
      </v-icon>
    </v-btn>
    <div v-show="open">
      <v-card-text class="h6 pb-0">
        <v-row>
          <p class="body-lg mt-3 text--base-darkest">
            {{ content }}
          </p>
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
}
</script>
