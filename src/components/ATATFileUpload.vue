<template>
<div>
  <div v-cloak 
    @dragenter="onDragEnter" 
    @drop.prevent="addDropFile" 
    @dragover.prevent
  >
     <v-file-input
      ref="atatFileUpload"
      v-if="isLoading === false"
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
        <div class="content d-flex flex-column align-center pt-9">
          <ATATSVGIcon name="uploadFile" :width="40" :height="50"  />
          <h2 class="mt-5">Drag and Drop</h2>
          <p class="mb-3 d-flex justify-center text-base-darkest ">your file here or 
              <a
                role="button"
                id="BrowseToUpload"
                class="_text-link ml-1" 
                @mousedown="fileUploadClicked"
              >
                  browse to upload
            </a>
          </p>
          <p class="mt-3 mb-9">Use a PDF file with a max size of 10 MB.</p>
        </div>
      </template>
    </v-file-input>
  </div>
  <v-card 
    flat
    class="file-loading-div" 
    v-if="isLoading === true">
      <v-card-title class="h2 pa-0 pb-6">{{ fileLoadingDivTitle }}</v-card-title>
      <div class="content-div d-flex align-center">
        <ATATSVGIcon name="pdf" color="base" :width="32" :height="40" />
        <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
          <div class="filename">{{ uploadingFileName }}</div>
          <div class="d-flex align-center mt-auto  ">
            <v-progress-linear
                class="progress-bar mr-5"
                v-model="uploadingStatus"
                height="16"
              >
            </v-progress-linear>
            <ATATSVGIcon name="close" color="base" :width="11" />
          </div>
        </div>
      </div>
  </v-card>
  <div v-if="uploadedFiles.length>0 && this.isLoading === false">
    <h2 class="mt-5">Files Uploaded</h2>
    <ul v-for="(file, idx) in uploadedFiles" :key="idx">
      <li>{{ file.name }}</li>
    </ul>
  </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"

@Component({
  components: {
    ATATSVGIcon,
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
  private uploadedFileNames: string[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isLoading = false;
  private uploadingStatus = 0;
  private uploadingStatusInterval = 0;
  private uploadingFileName = "";

  
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
    this.initProgressBar();
    this.removeInvalidFiles(this.fileUploadControl.files as FileList);
    Vue.nextTick(() => {
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
  private addDropFile(e: DragEvent): void {
    this.isLoading = true;
    this.isHovering = false;
    const dt = e.dataTransfer as DataTransfer;
    this.removeInvalidFiles(dt.files as FileList);
    this.initProgressBar();
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
    this.uploadedFileNames = this.uploadedFiles.map(({name}) => name);
  }

  /**
   *  start the progress bar.  Temp for now until we can tie into 
   *  the API call.
   */
  private initProgressBar(): void {
    const fileNameChangeInterval = 
        Math.floor(100/this.uploadedFileNames.length);
    let fileNameArrayIndex = 0;
    this.isLoading = true;
    this.uploadingStatusInterval = setInterval(()=>{
      if (this.uploadingStatus<100){
        this.uploadingFileName = this.uploadedFileNames[fileNameArrayIndex];
        console.log(this.uploadingFileName);
        if (this.uploadingStatus > 0 && this.uploadingStatus % fileNameChangeInterval === 0){
          fileNameArrayIndex++;
        }
        this.uploadingStatus += 1; 
      } else {
        this.isLoading = false;
        clearInterval(this.uploadingStatusInterval);
      }
    }, 100, fileNameChangeInterval, fileNameArrayIndex);
  }

  get progressStopped(): boolean{
    const progressDone = this.uploadingStatus === 100;
    if (progressDone){
      this.isLoading = false;
    }
    return progressDone;
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