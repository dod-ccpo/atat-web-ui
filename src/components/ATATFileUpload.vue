<template>
  <v-form ref="atatFileUploadForm">
    <div
      v-cloak
      @dragenter="onDragEnter"
      @drop.prevent="addDropFile"
      @dragover.prevent
    >
      <v-file-input
        ref="atatFileUpload"
        :id="id + 'FileUpload'"
        :class="[
          { 'v-text-field--is-hovering': isHovering },
          { 'v-text-field--is-errored': errorMessages.length > 0 },
          'atat-file-upload',
        ]"
        multiple
        prepend-icon=""
        accept="application/pdf,application/vnd.ms-excel, .xlsx"
        :truncate-length="truncateLength"
        :clearable="false"
        @change="fileUploadChanged"
        :hide-details="true"
        :rules="_rules"
      >
        <template v-slot:prepend-inner>
          <div
            v-if="isFullSize"
            class="content d-flex flex-column align-center pt-9"
            @mousedown="fileUploadClicked"
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
            <p class="mt-3 mb-9">Use a PDF file with a max size of 1 GB.</p>
          </div>
          <div
            v-else
            class="content-mini d-flex align-center width-100"
            @mousedown="fileUploadClicked"
          >
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
                  @click="fileUploadClicked"
                >
                  browse to upload
                </a>
              </p>
            </div>
            <p class="ml-auto mb-0">Use a PDF file with a max size of 1 GB.</p>
          </div>
        </template>
      </v-file-input>
      <ATATErrorValidation
        class="file-upload-validation-messages"
        :showAllErrors="true"
        :errorMessages="errorMessages"
      />
    </div>

    <ATATFileList
      :validFiles="validFiles"
      :class="[{ 'mt-10': !isFullSize }]"
      :isFullSize.sync="isFullSize"
      @delete="(file) => $emit('delete', file)"
    />
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATFileList from "@/components/ATATFileList.vue";
import {
  FileAttachmentService,
  FileAttachmentServiceFactory,
} from "@/services/attachment";
import { invalidFile, uploadingFile } from "types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATFileList,
    ATATErrorValidation,
  },
})
export default class ATATFileUpload extends Vue {

  // refs
  $refs!: {
    atatFileUpload: Vue & {
      errorBucket: string[];
      errorCount: number;
    };
    atatFileUploadForm: Vue & {
      resetValidation: () => void;
      reset: () => void;
    };
  };

  // props
  @Prop({ default: 15 }) private truncateLength!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: () => [] }) private validFileFormats!: string[];
  @PropSync("invalidFiles", { default: () => [] })
  private _invalidFiles!: invalidFile[];
  @Prop({ default: "", required: true }) private attachmentServiceName!: string;
  @PropSync("rules", { default: () => [] }) private _rules!: ((
    v: string
  ) => string | true | undefined)[];
  
  //1073741824 is 1GB, the most SNOW will allow to upload
  @Prop({ default: 1073741824, required: true })
  private maxFileSizeInBytes!: number;
  

  //data
  private validFiles: uploadingFile[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isFullSize = true;
  private fileAttachmentService?: FileAttachmentService;
  private errorMessages: string[] = [];

  //Events
  /**
   * triggers html file upload click
   */
  private fileUploadClicked(event: Event): void {
    const eventSrc = event.target as HTMLElement;
    if (eventSrc.classList.contains("_text-link")) {
      event.preventDefault();
      event.stopPropagation();}

    (document.getElementById("FundingPlanFileUpload") as HTMLInputElement).click();
    this.reset();
    this.isFullSize = this.validFiles.length === 0;
  }
  // 
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
      if (vuetifyFileUploadStatus) {
        vuetifyFileUploadStatus.innerHTML = "";
      }
      Vue.nextTick(()=>{
        this.clearHTMLFileInput();
      })
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
    this.isFullSize = this.validFiles.length === 0;
    this.reset();
    this.clearHTMLFileInput();
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
    const _validFiles = Array.from(files || []).filter((vFile) => {
      const thisFileFormat = vFile.name.substring(
        vFile.name.lastIndexOf(".") + 1
      );
      const isValidFormat = this.validFileFormats.some(
        (format) => thisFileFormat === format
      );

      const doesFileExist = this.validFiles.some((fileObj) => {
        return (
          vFile.name === fileObj.file?.name &&
          vFile.lastModified === fileObj.file.lastModified &&
          vFile.size === fileObj.file.size
        );
      });

      const isFileSizeValid = vFile.size < this.maxFileSizeInBytes;

      //log Invalid Files
      if (!isValidFormat) {
        this.logInvalidFiles(vFile, doesFileExist);
      }
      if (doesFileExist) {
        this.logInvalidFiles(vFile, doesFileExist);
      }
      if (!isFileSizeValid) {
        this.logInvalidFiles(vFile, doesFileExist);
      }

      return isValidFormat && !doesFileExist && isFileSizeValid;
    });

    this.createFileObjects(_validFiles);
  }

  private createFileObjects(_validFiles: File[]): void {
    _validFiles.forEach((vFile) => {
      this.validFiles.push({
        file: vFile,
        fileName: vFile.name,
        created: vFile.lastModified,
        progressStatus: 0,
        link: "",
        attachmentId: "",
        recordId: "",
        isErrored: false,
        isUploaded: false,
      });
    });
    this.uploadFiles();
  }

  private uploadFiles(): void {
    for (let i = 0; i < this.validFiles.length; i++) {
      //wire up file upload here
      let uploadingFileObj = this.validFiles[i] as uploadingFile;

      // only new files are uploaded
      if (!uploadingFileObj.isUploaded) {
        window.setTimeout(() => {
          this.fileAttachmentService
            ?.upload(uploadingFileObj.file, (total, current) => {
              current = 0;
              total = Math.ceil(total / 1000);
              let progress = window.setInterval(() => {
                if (current < total) {
                  current = current + Math.floor(Math.random() * total);
                  uploadingFileObj.progressStatus = (current / total) * 100;
                } else {
                  clearInterval(progress);
                  uploadingFileObj.progressStatus = 100;
                }
              }, 500);
            })
            .then((result) => {
              //download link - link to the file download
              //sys_id the unique id of the attachment in the attachment table
              //table_sys_id the unique id of the table/record

              const { download_link, sys_id, table_sys_id } = result.attachment;
              uploadingFileObj.link = download_link || "";
              uploadingFileObj.attachmentId = sys_id || "";
              uploadingFileObj.recordId = table_sys_id;
              uploadingFileObj.isUploaded = true;
            })
            .catch((error) => {
              //file upload error occurred
              uploadingFileObj.isErrored = true;
              console.log(`file upload error ${error}`);
              this.logInvalidFiles(
                uploadingFileObj.file,
                false,
                error?.response?.data?.error.message || error.message,
                error?.response?.status || 0
              );
            });
        }, i * 1000);
      }
    }
  }

  private logInvalidFiles(
    file: File,
    doesFileExist: boolean,
    SNOWError?: string,
    statusCode?: number
  ): void {
    const doesFileExistInInvalidFiles = this._invalidFiles.some(
      (iFile) =>
        iFile.file.name === file.name &&
        iFile.file.size === file.size &&
        iFile.file.lastModified === file.lastModified
    );
    if (!doesFileExistInInvalidFiles) {
      this._invalidFiles.push({ file, doesFileExist, SNOWError, statusCode });
    }
    if (this._invalidFiles.length > 0) {
      this.setErrorMessage();
    }
  }

  private setErrorMessage(): void {
    Vue.nextTick(() => {
      this.errorMessages = this.$refs.atatFileUpload.errorBucket;
    });
  }

  private clearErrorMessages(): void {
    // if (this.errorMessages.length>0){
    Vue.nextTick(() => {
      this.$refs.atatFileUploadForm.reset();
      Vue.nextTick(() => {
        this.$refs.atatFileUploadForm.resetValidation();
      });
    });
    // }
  }

  private reset(): void {
    Vue.nextTick(() => {
      this._invalidFiles = [];
      this.clearErrorMessages();
      this.errorMessages = [];
    });
  }

  /**
   * Clears out all files form HTML File Input
   */
  private clearHTMLFileInput():void{
    const fileInput = document.getElementById("FundingPlanFileUpload") as HTMLInputElement;
    fileInput.value = "";
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

    //try to grab the attachment service via the service factory
    this.fileAttachmentService = FileAttachmentServiceFactory(
      this.attachmentServiceName
    );

    this._invalidFiles = [];
  }

  private updated(): void {
    this.isFullSize = this.validFiles.length === 0;
  }
}
</script>
