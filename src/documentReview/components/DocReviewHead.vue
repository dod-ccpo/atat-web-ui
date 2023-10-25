<template>
  <div>
    <v-breadcrumbs class="pa-0 mb-3" :items="breadCrumbItems">
      <template v-slot:divider>
        <ATATSVGIcon 
          name="chevronRight" 
          width="7" 
          height="12" />
      </template>
    </v-breadcrumbs>
    <h1>{{ docTitle }}</h1>
  </div>
</template>

<script lang="ts">
import { BreadcrumbItem } from "types/Global";
import Vue from "vue";
import { Component, Prop } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components:{
    ATATSVGIcon
  }
})
export default class DocReviewHead extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  public breadCrumbItems: BreadcrumbItem[] = [
    {
      title: "Acquisitions",
      disabled: false,
      href: "#",
    },
    {
      title: "Demo Package",
      disabled: false,
      href: "#",
    },
    {
      title: "Requirements Checklist",
      disabled: true,
      href: "#",
    },
  ];
}
</script>
