<template>
  <div>
    <div
      v-cloak
      v-if="isLoading"
      @dragenter="onDragEnter"
      @drop.prevent="addDropFile"
      @dragover.prevent
    >
      <v-file-input
        ref="atatFileUpload"
        :id="id + 'FileUpload'"
        :class="[
          { 'v-text-field--is-hovering': isHovering },
          'atat-file-upload',
        ]"
        multiple
        prepend-icon=""
        accept="application/pdf,application/vnd.ms-excel"
        :truncate-length="truncateLength"
        :clearable="false"
        @change="fileUploadChanged"
      >
        <template v-slot:prepend-inner>
          <div class="content text-center">
            <v-icon class="icon-60 mt-10 mb-5">upload_file</v-icon>
            <h2>Drag and Drop</h2>
            <p class="mt-1 mb-4 d-flex justify-center">
              your file here or
              <v-btn
                class="link-button inline-text"
                @mousedown="fileUploadClicked"
              >
                browse to upload
              </v-btn>
            </p>
            <p class="mb-9">Use a PDF file with a max size of 10 MB.</p>
          </div>
        </template>
      </v-file-input>

      

      <h2 class="mt-5" v-if="uploadedFiles.length > 0">Files Uploaded</h2>
      <ul v-for="(file, idx) in uploadedFiles" :key="idx">
        <li>{{ file.name }}</li>
      </ul>
    </div>
    <v-card 
      flat
      class="file-loading-div" 
      :v-else="isLoading === true">
        <v-card-title class="h2 pa-6">{{ fileLoadingDivTitle }}</v-card-title>
        <div class="v-flex align-center">
          <ATATPDFIcon />

          <br />
          <ATATPDFIcon :height="40" />

          <br />
          <ATATPDFIcon :height="25" color="c60634" />

        </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATPDFIcon from "@/components/icons/ATATPDFIcon.vue"

@Component({
  components: {
    ATATPDFIcon,
  },
})
export default class ATATFileUpload extends Vue {
  // refs
  $refs!: {
    atatFileUpload: Vue & {
      errorBucket: string[];
      errorCount: number;
    };
  };

  // props
  @Prop({ default: 15 }) private truncateLength!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: () => [] }) private validFileFormats!: string[];
  @Prop({ default: "Your Upload"}) private fileLoadingDivTitle!: string;

  //data
  // @PropSync("files", {default: ()=>[]}) private _files: File[] = [];
  private uploadedFiles: File[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isLoading = false;

  //Events
  /**
   * triggers html file upload click
   */
  private fileUploadClicked(): void {
    this.fileUploadControl.click();
  }

  /**
   * 1. sets uploadedFiles data
   * 2. removes unnecessary vuetify status msg
   */
  private fileUploadChanged(): void {
    this.isLoading = true;
    this.removeInvalidFiles(this.fileUploadControl.files as FileList);
    Vue.nextTick(() => {
      //remove default vuetify status that displays after
      //upload (eg. '2 files')
      const vuetifyFileUploadStatus = document.getElementsByClassName(
        "v-file-input__text"
      )[0] as HTMLDivElement;
      console.log(vuetifyFileUploadStatus);
      vuetifyFileUploadStatus.innerHTML = "";
    });
  }

  /**
   * prevents html dragevent from happening so as
   * drag event can be triggered with reactive data var `isHovering.`
   *
   * @param(e: DragEvent)
   */
  private onDragEnter(e: DragEvent): void {
    e.preventDefault();
    this.isHovering = true;
  }

  /**
   * prevents browser downloading file if file is dropped
   * outside of dropzone
   *
   * @param(e: DragEvent)
   */
  private preventDrop(e: DragEvent): void {
    e.preventDefault();
  }

  //Methods

  /**
   * sets this.files with files dragged to the control
   *
   * @param e:DragEvent
   *
   */
  private addDropFile(e: DragEvent): void {
    this.isLoading = true;
    this.isHovering = false;
    const dt = e.dataTransfer as DataTransfer;
    this.removeInvalidFiles(dt.files as FileList);
  }

  /**
   * removes files with extensions not defined in
   * this.validFileFormats property
   *
   * @params (files: FileList)
   *
   */
  private removeInvalidFiles(files: FileList): void {
    this.uploadedFiles = Array.from(files || []).filter((file) => {
      const thisFileFormat = file.name.substring(
        file.name.lastIndexOf(".") + 1
      );
      return this.validFileFormats.some((format) => thisFileFormat === format);
    });
  }

  //life cycle hooks
  private mounted(): void {
    this.fileUploadControl = document.getElementById(
      this.id + "FileUpload"
    ) as HTMLInputElement;

    //prevents Browser from downloading the file if file is accidentally
    //dropped outside of dropzone
    window.addEventListener("drop", this.preventDrop, false);
    window.addEventListener("dragover", this.preventDrop, false);
  }
}
</script>