<template>
  <div>
    <div
      v-cloak
      @dragenter="onDragEnter"
      @drop.prevent="addDropFile"
      @dragover.prevent
    >
      <v-file-input
        ref="atatFileUpload"
        v-show="this.validFiles.length !== 1"
        :id="id + 'FileUpload'"
        :class="[{'v-text-field--is-hovering' : isHovering},'atat-file-upload']"
        multiple
        prepend-icon=""
        accept="application/pdf,application/vnd.ms-excel, .xlsx"
        :truncate-length="truncateLength"
        :clearable="false"
        @change="fileUploadChanged"
        :hide-details="true"
      >
        <template v-slot:prepend-inner>
          <div
            v-if="isFullSize"
            class="content d-flex flex-column align-center pt-9"
            @click="fileUploadClicked"
          >
            <ATATSVGIcon name="uploadFile" :width="40" :height="50" />
            <h2 class="mt-5">Drag and Drop</h2>
            <p class="mb-3 d-flex justify-center text-base-darkest">
              your file here or
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
          <div v-else 
            class="content-mini d-flex align-center width-100"
            @click="fileUploadClicked">
            <div>
              <ATATSVGIcon name="uploadFile" :width="40" :height="50" />
            </div>
            <div class="d-flex flex-column justify-center ml-6">
              <h2>Drag and Drop</h2>
              <p class="mb-0 mt-1 d-flex justify-center text-base-darkest">
                your file here or
                <a
                  role="button"
                  id="BrowseToUpload"
                  class="_text-link ml-1"
                  @mousedown="fileUploadClicked"
                >
                  browse to upload
                </a>
              </p>
            </div>
            <p class="ml-auto mb-0">
              Use a PDF file with a max size of 10 MB.
            </p>
          </div>
        </template>
      </v-file-input>
    </div>

    <ATATFileList
      :files="validFiles"
      :indexToDisplay="fileNameArrayIndex"
      :uploadingStatus="uploadingStatus"
      :class="[{ 'mt-10': !isFullSize }]"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATFileList from "@/components/ATATFileList.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATFileList,
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

  //data
  // @PropSync("files", {default: ()=>[]}) private _files: File[] = [];
  private validFiles: File[] = [];
  private uploadedFileNames: string[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private uploadingStatus = 0;
  private uploadingStatusInterval = 0;
  private uploadingFileName = "";
  private fileNameArrayIndex = -1;
  private filesUploaded = false;
  private isFullSize = true;

  //Events
  /**
   * triggers html file upload click
   */
  private fileUploadClicked(): void {
    console.log('hi');
    this.fileUploadControl.click();
  }

  /**
   * 1. sets uploadedFiles data
   * 2. removes unnecessary vuetify status msg
   */
  private fileUploadChanged(): void {
    this.removeInvalidFiles(this.fileUploadControl.files as FileList);
    Vue.nextTick(() => {
      //remove default vuetify status that displays after
      //upload (eg. '2 files')
      const vuetifyFileUploadStatus = document.getElementsByClassName(
        "v-file-input__text"
      )[0] as HTMLDivElement;
      if (vuetifyFileUploadStatus){
        vuetifyFileUploadStatus.innerHTML = "";
      }
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
    const _validFiles = Array.from(files || []).filter((file) => {
      const thisFileFormat = file.name.substring(
        file.name.lastIndexOf(".") + 1
      );
      return this.validFileFormats.some((format) => thisFileFormat === format);
    });

    // if (this.validFiles.length>0){
    this.validFiles.push(..._validFiles);
    // } else {
    //   this.validFiles = _validFiles;
    // }
    // debugger;
    
    this.isFullSize = this.validFiles.length === 0;
  }

  /**
   *  start the progress bar.  Temp for now until we can tie into
   *  the API call.
   */
  // private initProgressBar(): void {
  //   const fileNameChangeInterval = Math.floor(100 / this.validFiles.length);
  //   this.isLoading = true;
  //   this.uploadingStatus = 0;
  //   this.uploadingStatusInterval = setInterval(
  //     () => {
  //       if (this.uploadingStatus < 100) {
  //         if (
  //           this.uploadingStatus > 0 &&
  //           this.uploadingStatus % fileNameChangeInterval === 0
  //         ) {
  //           this.fileNameArrayIndex++;
  //         }
  //         this.uploadingStatus += 4;
  //       } else {
  //         this.filesUploaded = true;
  //         this.isLoading = false;
  //         clearInterval(this.uploadingStatusInterval);
  //       }
  //     },
  //     100,
  //     fileNameChangeInterval
  //   );
  // }

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

  private updated(): void{
    this.isFullSize = this.validFiles.length === 0;
  }
}
</script>