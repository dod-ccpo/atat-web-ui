<template>
  <div 
    v-if="searchString || hasFilters" 
    id="NoResultsFound"
    class="text-center my-10"
  >
    <div 
      class="bg-primary-lighter d-inline-block mb-4" 
      style="border-radius: 50%; padding: 48px;"
    >
      <ATATSVGIcon 
        color="primary"
        width="88"
        height="88"
        name="search"
      />
    </div>

    <div id="NoResultsHeader" class="h2">
      No results
      <span id="SearchString" v-if="searchString">
        for “{{ searchString }}”
      </span>
      <span id="WithFilters" v-if="hasFilters">
        with selected filters
      </span>
    </div>
    <p>
      Please
      <span v-if="searchString">try another search term</span>
      <span v-if="hasBoth"> or </span>
      <span v-if="hasFilters"> modify filters to be less specific</span>.
    </p>

    <v-btn 
      id="ClearSearchButton"
      class="primary mx-auto"
      @click="clear"
    >
      Clear {{ buttonText }}
    </v-btn>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class ATATNoResults extends Vue {
  @Prop() private searchString?: string;
  @Prop({ default: false }) private hasFilters?: boolean;

  public get hasBoth(): boolean {
    return !!this.searchString && !!this.hasFilters;
  }

  public get buttonText(): string {
    return this.hasBoth ? "search and filters" : this.searchString ? "search" : "filters";
  }

  public clear(): void {
    this.$emit("clear", this.hasBoth ? "both" : this.buttonText)
  }

}
</script>
