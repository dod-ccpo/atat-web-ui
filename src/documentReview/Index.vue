<template>
  <div  style="overflow: hidden;">
    <v-main class="_document-review bg-base-off-white">
    <v-breadcrumbs
      class="pa-0"
      :items="breadCrumbItems"
      divider="-"
    ></v-breadcrumbs>
        future document review page
    </v-main>
   </div> 
</template>
<script lang="ts">
import { BreadCrumbItem } from "types/Global";
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({
})
export default class DocumentReview extends Vue {

public breadCrumbItems: BreadCrumbItem[] =  [
  {
    text: 'Acquisitions',
    disabled: false,
    href: '#',
  },
  {
    text: 'Demo Package',
    disabled: false,
    href: '#',
  },
  {
    text: 'Requirements Checklist',
    disabled: true,
    href: '#',
  },
]

}



</script>
