<template>
   <div>
    <v-breadcrumbs
      class="pa-0 mb-3"
      :items="breadCrumbItems"
      divider="-"
    ></v-breadcrumbs>
    <h1>{{ docTitle }}</h1>
  </div>
</template>

<script lang="ts">
import { BreadCrumbItem } from "types/Global";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";


@Component({})
export default class DocReviewHead extends Vue {
    @Prop({ default: "" }) private docTitle!: string;
    public breadCrumbItems: BreadCrumbItem[] = [
      {
        text: "Acquisitions",
        disabled: false,
        href: "#",
      },
      {
        text: "Demo Package",
        disabled: false,
        href: "#",
      },
      {
        text: "Requirements Checklist",
        disabled: true,
        href: "#",
      },
    ];
}
</script>
