<template>
<div style="outline:none">
  <!-- <v-form ref="atatFileUploadForm"> -->
    <div
      :id="id + 'EventDiv'"
      v-cloak
      @dragenter="onDragEnter"
      @drop.prevent="addDropFile"
      @dragover.prevent
      v-show="isFileUploadDisplayed"
    >
      <v-file-input
        ref="atatFileUpload"
        :name="id + 'FileUpload'"
        :id="id + 'FileUpload'"
        :class="[
          { 'v-text-field--is-hovering': isHovering },
          { 'v-text-field--is-errored': errorMessages.length > 0 },
          { 'v-text-field--is-disabled': isFileUploadDisabled },
          'atat-file-upload',
        ]"
        multiple
        prepend-icon=""
        accept="application/pdf,application/vnd.ms-excel, .xlsx, .doc, .docx"
        :truncate-length="truncateLength"
        :clearable="true"
        @change="fileUploadChanged"
        :hide-details="true"
        :rules="setRules"
        :validate-on-blur="validateOnBlur"
        @keydown.tab="setErrorMessage()"
      >
        <template v-slot:prepend-inner>
          <div
            v-if="isFullSize && !startCompact"
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
            <p class="mt-3 mb-9 text-base">
              <span v-if="filesRequired">{{maxNumberOfFiles}} files required</span>
              <span v-if="filesRequired && showSupportedFileTypes">
                • 
              </span>
              <span v-if="showSupportedFileTypes">
                  Supported file types: {{formatFileTypes}} 
              </span>
              <span v-if="(showSupportedFileTypes && showMaxSize) ||
                            (filesRequired && showMaxSize)">
                • 
              </span>
              <span v-if="showMaxSize">Max file size: {{fileSizeConversion}}GB</span>
            </p>
          </div>
          <div
            v-else
            class="content-mini d-flex align-center width-100"
            @mousedown="fileUploadClicked"
          >
            <div>
              <ATATSVGIcon 
                name="uploadFile" 
                :color = "isFileUploadDisabled ? 'disabled-dark': 'base'"
                :width="40" 
                :height="50" />
            </div>
            <div class="ml-6">
              <p class="mb-0 mt-1 font-size-20">Drag and Drop your file here or
                <a
                  role="button"
                  id="BrowseToUpload"
                  class="_text-link ml-1"
                  @click="fileUploadClicked"
                >
                  browse to upload
                </a>
              </p>
              <p class="ml-auto mb-0 mt-2 text-base">
                <span v-if="filesRequired">{{maxNumberOfFiles}} files required</span>
                <span v-if="filesRequired && showSupportedFileTypes">
                  • 
                </span>
                <span v-if="showSupportedFileTypes">
                    Supported file types: {{formatFileTypes}} 
                </span>
                <span v-if="(showSupportedFileTypes && showMaxSize) ||
                              (filesRequired && showMaxSize)">
                  • 
                </span>
                <span v-if="showMaxSize">Max file size: {{fileSizeConversion}}GB</span>
              </p>
            </div>
          </div>
        </template>
      </v-file-input>
      <ATATErrorValidation
        class="file-upload-validation-messages"
        :showAllErrors="showAllErrors"
        :errorMessages="errorMessages"
      />
    </div>

    <ATATFileList
      :validFiles="_validFiles"
      class="mt-5"
      :isFullSize.sync="isFullSize"
      :multiplesAllowed="multiplesAllowed"
      :title="fileListTitle"
      :removeAll.sync="_removeAll"
      @delete="deleteFile"
    />
  <!-- </v-form> -->
  </div>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATFileList from "@/components/ATATFileList.vue";
import {
  AttachmentServiceTypes,
  AttachmentServiceFactory,
} from "@/services/attachment";
import { invalidFile, uploadingFile } from "types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { setItemToPlural } from "@/helpers";

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
      resetValidation: () => void;
      reset: () => void;
      validate: () => boolean;
    };
  };

  // props
  @Prop({ default: 15 }) private truncateLength!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: true}) private multiplesAllowed!: boolean;
  @Prop({ default: true}) private showAllErrors?: boolean;
  @Prop({ default: false}) private filesRequired?: boolean;
  @Prop() private restrictedNames?: string[];
  @Prop({ default: "required"}) private requiredMessage!: string;
  @Prop({ default: 20 }) private maxNumberOfFiles!: number;
  @Prop({ default: true }) private showSupportedFileTypes!: boolean;
  @Prop({ default: true }) private showMaxSize!: boolean;
  @Prop({ default: false }) private startCompact?: boolean;
  @Prop({ default: () => [] }) private validFileFormats!: string[];
  @PropSync("invalidFiles", { default: () => [] }) private _invalidFiles!: invalidFile[];
  @Prop({ default: "", required: true }) private attachmentServiceName!: string;
  @PropSync("removeAll") public _removeAll?: boolean;
  @PropSync("rules", { default: () => [] }) private _rules!: ((
    v: string
  ) => string | true | undefined)[];
  
  //1073741824 is 1GB, the most SNOW will allow to upload
  @Prop({ default: 1073741824, required: true })
  private maxFileSizeInBytes!: number;
  
  @PropSync("validFiles", { default: () => [] })
  private _validFiles!: uploadingFile[];

  @Prop({ default: "" }) private fileListTitle!: string;

  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isFullSize = true;
  private fileAttachmentService?: typeof AttachmentServiceTypes;
  private errorMessages: string[] = [];
  private validateOnBlur = true;
  private moreThanMax = false
  get isFileUploadDisabled():boolean{
    return this.maxNumberOfFiles <= this._validFiles.length;
  }

  get fileSizeConversion(): number {
    return this.maxFileSizeInBytes / 1073741824
  }
  get formatFileTypes(): string {
    //eslint-disable-next-line prefer-const 
    let formatted = this.validFileFormats.map((file) =>{
      return ` .${file}`
    })
    return formatted.join(',')
  }
  get isFileUploadDisplayed(): boolean {
    if (this.multiplesAllowed === false){
      return this._validFiles.length !== 1 || this.errorMessages.length > 0
    }
    return true;
  }

  get setRules():((v: string) => string | true | undefined)[] {
    return this._validFiles.length>0 && this._invalidFiles.length === 0 ? [] : this._rules;
  }

  //Events

  private async deleteFile(file: File): Promise<void>{
    this.$emit('delete', file);
    await this.$refs.atatFileUpload.$emit("click:clear");
    await this.$refs.atatFileUpload.$emit("change");
    this.reset();
  }

  /**
   * triggers html file upload click
   */
  private fileUploadClicked(event: Event): void {
    if (this.isFileUploadDisabled === false){
      const eventSrc = event.target as HTMLElement;
      if (eventSrc.classList.contains("_text-link")) {
        event.preventDefault();
        event.stopPropagation();}

      this.reset();
      this.isFullSize = this._validFiles.length === 0;
      (document.getElementById(this.id + "FileUpload") as HTMLInputElement).click();
    }
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
        (document.getElementById(this.id + "FileUpload") as HTMLInputElement).blur();
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
    this.isFullSize = this._validFiles.length === 0;
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
    if (this.isFileUploadDisabled === false){
      const dt = e.dataTransfer as DataTransfer;
      this.removeInvalidFiles(dt.files as FileList);
      this.isHovering = false;
    }
  }

  /**
   * removes files with extensions not defined in
   * this.validFileFormats property
   *
   * @params (files: FileList)
   *
   */
  private removeInvalidFiles(files: FileList): void {

    let _validFiles = Array.from(files || []).filter((vFile) => {

      const isRestrictedName = this.restrictedNames?.includes(vFile.name)
      const thisFileFormat = vFile.name.substring(
        vFile.name.lastIndexOf(".") + 1
      );
      const isValidFormat = this.validFileFormats.some(
        (format) => thisFileFormat === format
      );

      const doesFileExist = this._validFiles.some((fileObj) => {
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
      if(isRestrictedName){
        this.logInvalidFiles(vFile, doesFileExist);
      }

      return isValidFormat && !doesFileExist && isFileSizeValid && !isRestrictedName;
    });
    if((this._validFiles.length + _validFiles.length) > this.maxNumberOfFiles){
      this.moreThanMax = true
      const errorText = "Too many files selected. You can upload up to " + 
          this.maxNumberOfFiles + " " + setItemToPlural(this.maxNumberOfFiles, "file") + "."
      this.$refs.atatFileUpload.errorBucket
        .push(errorText)
      this.setErrorMessage()
      return
    }
   
    //allows for maxNumberOfFiles to be uploaded
    if(this.maxNumberOfFiles<_validFiles.length){
      _validFiles = _validFiles.filter((obj, idx)=>{
        return idx<this.maxNumberOfFiles
      })
    }
    this.createFileObjects(_validFiles);
  }

  private createFileObjects(validFiles: File[]): void {
    validFiles.forEach((vFile) => {
      this._validFiles.push({
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
    for (let i = 0; i < this._validFiles.length; i++) {
      //wire up file upload here
      //eslint-disable-next-line prefer-const 
      let uploadingFileObj = this._validFiles[i] as uploadingFile;
      // only new files are uploaded
      if (!uploadingFileObj.isUploaded) {
        window.setTimeout(() => {
          this.fileAttachmentService
            ?.upload(uploadingFileObj.file, (total, current) => {
              current = 0;
              total = Math.ceil(total / 1000);
              //eslint-disable-next-line prefer-const 
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

              this.$emit('uploaded', uploadingFileObj);
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

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if (!this.$refs.atatFileUpload.validate()){
      this.setErrorMessage();
    }
  }

  private setErrorMessage(): void {
    this.$nextTick(() => {
      this.errorMessages = this.$refs.atatFileUpload.errorBucket;
      if (this._invalidFiles.length > 0 || this.moreThanMax){
        this.errorMessages = this.errorMessages.filter(
          (msg)=>msg !== this.requiredMessage
        );
      }
    });
  }

  private clearErrorMessages(): void {
    Vue.nextTick(() => {
      this.$refs.atatFileUpload.reset();
      Vue.nextTick(() => {
        this.$refs.atatFileUpload.resetValidation();
      });
    });
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
    const fileInput = document.getElementById(this.id + "FileUpload") as HTMLInputElement;
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
    this.fileAttachmentService = AttachmentServiceFactory(
      this.attachmentServiceName
    );
    
    this._invalidFiles = [];  
  }

  private updated(): void {
    this.isFullSize = this._validFiles.length === 0;
    if (this._validFiles.length>0){
      this.$refs.atatFileUpload.resetValidation();
    }
  }
}
</script>
