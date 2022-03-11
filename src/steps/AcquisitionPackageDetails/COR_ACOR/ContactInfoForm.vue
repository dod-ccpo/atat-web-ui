
<template>
  <v-flex class="mt-10">
    Contact Info Form
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class ContactInfoForm extends Vue {
  @Prop({default: true}) private isACOR!: boolean;
}
</script>

           