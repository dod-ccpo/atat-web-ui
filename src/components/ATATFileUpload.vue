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
        :id="id + 'FileUpload'"
        :class="[
          { 'v-text-field--is-hovering': isHovering },
          'atat-file-upload',
        ]"
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
          <div
            v-else
            class="content-mini d-flex align-center width-100"
            @click="fileUploadClicked"
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
                  @mousedown="fileUploadClicked"
                >
                  browse to upload
                </a>
              </p>
            </div>
            <p class="ml-auto mb-0">Use a PDF file with a max size of 10 MB.</p>
          </div>
        </template>
      </v-file-input>
    </div>

    <ATATFileList
      :validFiles="validFiles"
      :class="[{ 'mt-10': !isFullSize }]"
      :isFullSize.sync="isFullSize"
      :fileToBeDeleted.sync="fileToBeDeleted"
      @delete="(file)=> $emit('delete', file)"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATFileList from "@/components/ATATFileList.vue";
import {
  FileAttachmentService,
  FileAttachmentServiceFactory,
} from "@/services/attachment";
import { uploadingFile } from "types/Global";

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
  @Prop({ default: "", required: true }) private attachmentServiceName!: string;

  //data
  // @PropSync("files", {default: ()=>[]}) private _files: File[] = [];
  private validFiles: uploadingFile[] = [];
  private uploadedFileNames: string[] = [];
  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isFullSize = true;
  private fileAttachentService?: FileAttachmentService;
  private fileToBeDeleted: uploadingFile = {
    file: {} as File,
    fileName: "",
    created: new Date().getDate(),
    progressStatus: 0,
    link: "",
    attachmentId: "",
    recordId: "",
    isErrored: false,
    isUploaded: false,
  }; 

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

      return isValidFormat && !doesFileExist;
    });

    this.createFileObjects(_validFiles);
    this.isFullSize = this.validFiles.length === 0;
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
    // this.validFiles.forEach((uploadingFile) => {
    for (let i = 0; i < this.validFiles.length; i++) {
      //wire up file upload here
      let uploadingFileObj = this.validFiles[i] as uploadingFile;

      // only new files are uploaded
      if (!uploadingFileObj.isUploaded) {
        // this.validFiles.push(vFile);
        window.setTimeout(() => {
          this.fileAttachentService
            ?.upload(uploadingFileObj.file, (total, current) => {
              Vue.nextTick(()=>{
                uploadingFileObj.progressStatus = (current / total) * 100;
              });
              // console.log(uploadingFileObj.progressStatus);
              //total is the total file size
              //current is the current upload size
            })
            .then((result) => {
              //download link - link to the file download
              //sys_id the unique id of the attachment in the attachment table
              //table_sys_id the unique id of the table/record

              const { download_link, sys_id, table_sys_id } = result.attachment;
              uploadingFileObj.link = download_link || "";
              uploadingFileObj.attachmentId = sys_id || "";
              uploadingFileObj.recordId = table_sys_id;
            })
            .catch((error) => {
              // uploadingFile.isErrored === error.
              //file upload error occurred

              //todo: do more granular handling here
              uploadingFileObj.isErrored = true;
              console.log(`file upload error ${error}`);
            });
        }, i * 1000);

        // });
      }
    }
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
    this.fileAttachentService = FileAttachmentServiceFactory(
      this.attachmentServiceName
    );
  }

  private updated(): void {
    this.isFullSize = this.validFiles.length === 0;
  }
}
</script>