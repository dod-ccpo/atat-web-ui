<template>
  <v-flex>
    <atat-file-upload v-on:files-selected="getUploadedFiles" />
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_2 extends Vue {
  private getUploadedFiles(fileList: FileList) {
    for (const item of fileList) {
      // eslint-disable-next-line
      console.log(item)
    }
  }
}
</script>

<style scoped></style>
