<template>
  <div v-cloak @drop.prevent="addDropFile" @dragover.prevent>
     <v-file-input
      :id = "id + 'FileUpload'"
      class="atat-file-upload"
      multiple
      prepend-icon=""
      show-size
      :truncate-length="truncateLength"
    >
    <!-- accept=".pdf,.xls,.xlsx,application/msexcel" -->
      <template v-slot:prepend-inner>
        <div class="content text-center">
          <v-icon class="icon-60 mt-10 mb-5">upload_file</v-icon>
          <h2>Drag and Drop</h2>
          <p class="mt-1 mb-4">your file here or <a href="##">browse to upload</a></p>
          <p class="mb-9">Use a PDF file with a max size of 10 MB.</p>
        </div>
      </template>
    </v-file-input>

    <h2 class="mt-5" v-if="files.length>0">Files Uploaded</h2>
    <ul v-for="(file, idx) in files" :key="idx">
      <li>{{ file.name }}</li>
    </ul>
   </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

@Component({})
export default class ATATFileUpload extends Vue {

  // props
  @Prop({default: 15}) private truncateLength!: string;
  @Prop({default: ""}) private id!: string;

  //data
  // @PropSync("files", {default: ()=>[]}) private _files: File[] = [];
  private files: File[] = [];

  private addDropFile(e:DragEvent){
    const dt = e.dataTransfer as DataTransfer;
    const files = dt.files as FileList;
    this.files = Array.from(files || []);
    console.log(files);
    // Vue.nextTick(()=>{
    //   this._files = Array.from(files || []);
    //   console.log(this._files);
    // })
  }
}
</script>