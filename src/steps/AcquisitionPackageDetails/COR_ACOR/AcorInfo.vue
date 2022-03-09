<template>
  <common :isACOR="true" />
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import Common from "./Common.vue";

@Component({
  components: {
     Common,
  }
})
export default class AcorInfo extends Vue {
  
}
</script>
