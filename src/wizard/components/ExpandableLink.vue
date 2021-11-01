<template>
  <div class="mb-5">
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
      <v-card-text class="pb-0 w-60">
        <v-row class="mt-n5 ml-n7">
          <v-col class="content-max-width">
            <p class="body-lg text--base-darkest" v-html="content"></p>
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
}
</script>
