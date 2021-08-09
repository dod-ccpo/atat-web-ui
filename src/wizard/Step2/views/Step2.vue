<template>
  <v-flex>
    <atat-file-upload
      :dialog.sync="uploadDialog"
      :multiple="true"
      @filesUploaded="processUpload($event)"
    />
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_2 extends Vue {
  private processUpload(fileList: FileList) {
    debugger;
    for (const item of fileList) {
      // eslint-disable-next-line
      console.log(item)
    }
  }

  private uploadDialog(){
    debugger;
  }
}
</script>

<style scoped></style>
