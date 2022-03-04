
<template>
  <v-flex>
    Person Card
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class PersonCard extends Vue {
  @Prop({default: true}) private isACOR!: boolean;
}
</script>

