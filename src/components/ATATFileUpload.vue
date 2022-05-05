<template>
  <div v-cloak 
    @dragenter="onDragEnter" 
    @drop.prevent="addDropFile" 
    @dragover.prevent>
     <v-file-input
      ref="atatFileUpload"
      :id = "id + 'FileUpload'"
      :class="[{'v-text-field--is-hovering' : isHovering},'atat-file-upload']"
      multiple
      prepend-icon=""
      accept="application/pdf,application/vnd.ms-excel"
      :truncate-length="truncateLength"
      :clearable="false"
      @change="fileUploadChanged"
      :hide-details="true"       
    >
      <template v-slot:prepend-inner>
        <div class="content text-center">
          <v-icon class="icon-59 mt-9 mb-4">upload_file</v-icon>
          <h2>Drag and Drop</h2>
          <p class="mt-1 mb-3 d-flex justify-center text-base-darkest ">your file here or 
              <a
                role="button"
                id="BrowseToUpload"
                class="_text-link ml-1" 
                @mousedown="fileUploadClicked"
              >
                  browse to upload
            </a>
          </p>
          <p class="mt-6 mb-9">Use a PDF file with a max size of 10 MB.</p>
        </div>
      </template>
    </v-file-input>

    <h2 class="mt-5" v-if="uploadedFiles.length>0">Files Uploaded</h2>
    <ul v-for="(file, idx) in uploadedFiles" :key="idx">
      <li>{{ file.name }}</li>
    </ul>
   </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATFileUpload extends Vue {

  // refs
  $refs!: {
    atatFileUpload: Vue &
    {
      errorBucket: string[];
      errorCount: number;
    };
  }

  // props
  @Prop({default: 15}) private truncateLength!: string;
  @Prop({default: ""}) private id!: string;
  @Prop({default: ()=>[]}) private validFileFormats!: string[];

  //data
  // @PropSync("files", {default: ()=>[]}) private _files: File[] = [];
  private uploadedFiles: File[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;

  //Events
  /**
   * triggers html file upload click
   */
  private fileUploadClicked(): void{
    this.fileUploadControl.click();
  }

  /**
   * 1. sets uploadedFiles data
   * 2. removes unnecessary vuetify status msg
   */
  private fileUploadChanged(): void {
    this.removeInvalidFiles(this.fileUploadControl.files as FileList)
    Vue.nextTick(()=>{
      //remove default vuetify status that displays after
      //upload (eg. '2 files')
      const vuetifyFileUploadStatus = 
        document.getElementsByClassName("v-file-input__text")[0] as HTMLDivElement;
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
  private addDropFile(e:DragEvent): void{
    this.isHovering = false;
    const dt = e.dataTransfer as DataTransfer;
    this.removeInvalidFiles(dt.files as FileList)
  }

  /**
   * removes files with extensions not defined in 
   * this.validFileFormats property
   * 
   * @params (files: FileList)
   * 
   */
  private removeInvalidFiles(files: FileList): void {
    this.uploadedFiles = Array.from(files || []).filter(
      (file)=>{
        const thisFileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
        return this.validFileFormats.some((format)=> thisFileFormat === format);   
      });
  }

  //life cycle hooks
  private mounted(): void {
    this.fileUploadControl = document.getElementById(this.id + "FileUpload") as HTMLInputElement;

    //prevents Browser from downloading the file if file is accidentally
    //dropped outside of dropzone
    window.addEventListener("drop", this.preventDrop, false);
    window.addEventListener("dragover", this.preventDrop, false);
  }
}
</script>