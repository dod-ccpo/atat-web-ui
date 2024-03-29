<template>
  <div style="outline: none">
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
        :style="'width:' + width + 'px !important'"
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
        :clearable="false"
        @change="fileUploadChanged"
        :hide-details="true"
        :rules="setRules"
        validate-on="blur"
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
              <span v-if="filesRequired"
                >{{ maxNumberOfFiles }} files required</span
              >
              <span v-if="filesRequired && showSupportedFileTypes"> • </span>
              <span v-if="showSupportedFileTypes">
                Supported file types: {{ formatFileTypes }}
              </span>
              <span
                v-if="
                  (showSupportedFileTypes && showMaxSize) ||
                  (filesRequired && showMaxSize)
                "
              >
                •
              </span>
              <span v-if="showMaxSize"
                >Max file size: {{ fileSizeConversion }}GB</span
              >
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
                id="uploadFile"
                :width="40"
                :color="uploadIconColor"
                :height="50"
              />
            </div>
            <div class="ml-6">
              <p class="mb-0 mt-1 font-size-20">
                Drag and Drop your file here or
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
                <span v-if="filesRequired"
                  >{{ maxNumberOfFiles }} files required</span
                >
                <span v-if="filesRequired && showSupportedFileTypes"> • </span>
                <span v-if="showSupportedFileTypes">
                  Supported file types: {{ formatFileTypes }}
                </span>
                <span
                  v-if="
                    (showSupportedFileTypes && showMaxSize) ||
                    (filesRequired && showMaxSize)
                  "
                >
                  •
                </span>
                <span v-if="showMaxSize"
                  >Max file size: {{ fileSizeConversion }}GB</span
                >
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
      :width="width"
      :isFullSize="isFullSize"
      @update:isFullSize="isFullSize=$event"
      :multiplesAllowed="multiplesAllowed"
      :title="fileListTitle"
      :removeAll="_removeAll"
      @update:removeAll="_removeAll = $event"
      @delete="deleteFile"
      :confirmRemoval="confirmRemoval"
      :confirmRemovalTitle="confirmRemovalTitle"
      :confirmRemovalMessage="confirmRemovalMessage"
    />
  </div>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import { ComponentPublicInstance } from "vue";
import { Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATFileList from "@/components/ATATFileList.vue";
import {
  AttachmentServiceFactory,
} from "@/services/attachment";
import { invalidFile, uploadingFile, ValidationRule } from "types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { setItemToPlural } from "@/helpers";
import { AttachmentServiceBase } from "@/services/attachment/base";
import { BaseTableDTO } from "@/api/models";
import { TableApiBase } from "@/api/tableApiBase";

@Component({
  emits:[
    "delete",
    "click:clear",
    "change",
    "uploaded"
  ],
  components: {
    ATATSVGIcon,
    ATATFileList,
    ATATErrorValidation,
  },
})
class ATATFileUpload extends Vue {
  // refs
  $refs!: {
    atatFileUpload: ComponentPublicInstance & {
      errorBucket: string[];
      errorCount: number;
      resetValidation: () => void;
      reset: () => void;
      validate: () => Promise<boolean>;
    };
  };

  // props
  @Prop({ default: 15 }) private truncateLength!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "740" }) private width!: string;
  @Prop({ default: true }) private multiplesAllowed!: boolean;
  @Prop({ default: true }) private showAllErrors?: boolean;
  @Prop({ default: false }) private filesRequired?: boolean;
  @Prop() private restrictedNames?: string[];
  @Prop({ default: "required" }) private requiredMessage!: string;
  @Prop({ default: 20 }) private maxNumberOfFiles!: number;
  @Prop({ default: true }) private showSupportedFileTypes!: boolean;
  @Prop({ default: true }) private showMaxSize!: boolean;
  @Prop({ default: false }) private startCompact?: boolean;
  @Prop({ default: () => [] }) private validFileFormats!: string[];
  @PropSync("invalidFiles", { default: () => [] }) private _invalidFiles!: invalidFile[];
  @Prop({ default: "", required: true }) private attachmentServiceName!: string;
  @PropSync("removeAll") public _removeAll?: boolean;
  @Prop({ default: false }) private confirmRemoval!: boolean;
  @Prop({ default: "Are you sure?" }) private confirmRemovalTitle?: string;
  @Prop({ default: "Are you sure you want to remove the file(s)?" })
  private confirmRemovalMessage?: string;
  @Prop({ default: () => [] }) private rules!: ValidationRule[];

  //1073741824 is 1GB, the most SNOW will allow to upload
  @Prop({ default: 1073741824, required: true })
  private maxFileSizeInBytes!: number;

  @PropSync("validFiles", { default: () => [] })
  private _validFiles!: uploadingFile[];

  @Prop({ default: "" }) private fileListTitle!: string;

  private fileUploadControl!: HTMLInputElement;
  private isHovering = false;
  private isFullSize = true;
  private fileAttachmentService?: AttachmentServiceBase<TableApiBase<BaseTableDTO>, BaseTableDTO>;
  private errorMessages: string[] = [];

  private moreThanMax = false;
  get isFileUploadDisabled(): boolean {
    return this.maxNumberOfFiles <= this._validFiles.length;
  }

  get fileSizeConversion(): number {
    return this.maxFileSizeInBytes / 1073741824;
  }
  get formatFileTypes(): string {
    const formatted = this.validFileFormats.map((file) => {
      return ` .${file}`;
    });
    return formatted.join(",");
  }
  get isFileUploadDisplayed(): boolean {
    if (this.multiplesAllowed === false) {
      return this._validFiles.length !== 1 || this.errorMessages.length > 0;
    }
    return true;
  }

  get setRules(): ValidationRule[] {
    return this._validFiles.length > 0 && this._invalidFiles.length === 0
      ? []
      : this.rules;
  }

  get uploadIconColor(): string{
    return this.isFileUploadDisabled ? "disabled" :"base"
  }

  //Events
  private async deleteFile(file: File): Promise<void> {
    this.$emit("delete", file);
    await this.$refs.atatFileUpload.$emit("click:clear");
    await this.$refs.atatFileUpload.$emit("change");
    this.reset();
  }

  /**
   * triggers html file upload click
   */
  private fileUploadClicked(event: Event): void {
    if (this.isFileUploadDisabled === false) {
      const eventSrc = event.target as HTMLElement;
      if (eventSrc.classList.contains("_text-link")) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.reset();
      this.isFullSize = this._validFiles.length === 0;
      (
        document.getElementById(this.id + "FileUpload") as HTMLInputElement
      ).click();
    }
  }

  //
  /**
   * 1. sets uploadedFiles data
   * 2. removes unnecessary vuetify status msg
   */
  private fileUploadChanged(): void {
    this.removeInvalidFiles(this.fileUploadControl.files as FileList);
    this.$nextTick(() => {
      //remove default vuetify status that displays after
      //upload (eg. '2 files')
      const vuetifyFileUploadStatus = document.getElementsByClassName(
        "v-file-input__text"
      )[0] as HTMLDivElement;
      if (vuetifyFileUploadStatus) {
        vuetifyFileUploadStatus.innerHTML = "";
      }
      this.$nextTick(() => {
        this.clearHTMLFileInput();
        (
          document.getElementById(this.id + "FileUpload") as HTMLInputElement
        ).blur();
      });
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
    if (this.isFileUploadDisabled === false) {
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
      const isRestrictedName = this.restrictedNames?.includes(vFile.name);
      const thisFileFormat = vFile.name.substring(
        vFile.name.lastIndexOf(".") + 1
      );
      const isValidFormat = this.validFileFormats.some(
        (format) => thisFileFormat === format
      );

      const doesFileExist = this._validFiles.some((fileObj) => {
        return vFile.name === fileObj.file?.name;
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
      if (isRestrictedName) {
        this.logInvalidFiles(vFile, doesFileExist);
      }

      return (
        isValidFormat && !doesFileExist && isFileSizeValid && !isRestrictedName
      );
    });
    if (this._validFiles.length + _validFiles.length > this.maxNumberOfFiles) {
      this.moreThanMax = true;
      const errorText =
        "Too many files selected. You can upload up to " +
        this.maxNumberOfFiles +
        " " +
        setItemToPlural(this.maxNumberOfFiles, "file") +
        ".";
      this.$refs.atatFileUpload.errorBucket.push(errorText);
      this.$refs.atatFileUpload.validate().then(
        ()=>{this.setErrorMessage()}
      );
      return;
    }

    //allows for maxNumberOfFiles to be uploaded
    if (this.maxNumberOfFiles < _validFiles.length) {
      _validFiles = _validFiles.filter((obj, idx) => {
        return idx < this.maxNumberOfFiles;
      });
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
      const uploadingFileObj = this._validFiles[i] as uploadingFile;
      // only new files are uploaded
      if (!uploadingFileObj.isUploaded) {
        window.setTimeout(() => {
          this.fileAttachmentService
            ?.upload(uploadingFileObj.file, (total: number, current: number) => {
              uploadingFileObj.progressStatus = (current / total) * 100;
             
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

              this.$emit("uploaded", uploadingFileObj);
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
      this.$refs.atatFileUpload.validate().then(
        ()=> {this.setErrorMessage();}
      )
    }
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch("validateFormNow")
  public validateNowChange(): void {
    this.$refs.atatFileUpload.validate().then(
      (response: unknown) => {
        if ((response as string[]).length === 0){ 
          this.setErrorMessage() }
      }
    );
  }

  private setErrorMessage(): void {
    this.$refs.atatFileUpload.validate().then(
      (response: unknown) => {
        this.errorMessages = response as string[];
        if (this._invalidFiles.length > 0 || this.moreThanMax) {
          this.errorMessages = this.errorMessages.filter(
            (msg) => msg !== this.requiredMessage
          );
        }
      }
    );
  }

  private clearErrorMessages(): void {
    this.$nextTick(() => {
      this.$refs.atatFileUpload.reset();
      this.$nextTick(() => {
        this.$refs.atatFileUpload.resetValidation();
      });
    });
  }

  private reset(): void {
    this.$nextTick(() => {
      this._invalidFiles = [];
      this.clearErrorMessages();
      this.errorMessages = [];
    });
  }

  /**
   * Clears out all files form HTML File Input
   */
  private clearHTMLFileInput(): void {
    const fileInput = document.getElementById(
      this.id + "FileUpload"
    ) as HTMLInputElement;
    if(fileInput){
      fileInput.value = "";
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
    this.fileAttachmentService = AttachmentServiceFactory(this.attachmentServiceName);

    this._invalidFiles = [];
  }

  private updated(): void {
    this.isFullSize = this._validFiles.length === 0;
    if (this._validFiles.length > 0) {
      this.$refs.atatFileUpload.resetValidation();
    }
  }
}
export default toNative(ATATFileUpload)
</script>
