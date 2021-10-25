<template>
  <div class="width-100">
    <v-flex>
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span class="ml-2 optional" v-show="optional">Optional</span>
      </label>
    </v-flex>
    <v-flex class="my-2">
      <div class="error--text mb-2" role="alert" v-show="hasErrors">
        <div class="v-messages__message">
          <span v-for="(msg, idx) in errorMessages" :key="idx" class="d-block">
            {{ msg }}
          </span>
        </div>
      </div>
      <div v-show="!isFileUploaded || isProgressBarVisible">
        <div class="d-flex align-start">
          <v-sheet
            :class="[showBorderState, 'atat-file-upload']"
            width="416"
            ref="fileUploadVSheet"
          >
            <v-card
              id="file_upload"
              @drop.prevent="onDrop($event)"
              @dragover.prevent="dragover = true"
              @dragenter.prevent="dragover = true"
              @dragleave.prevent="dragover = false"
              elevation="0"
            >
              <v-card-text>
                <v-row dense>
                  <div
                    v-if="!isProgressBarVisible"
                    class="d-flex-column justify-center align-center width-100"
                  >
                    <div class="text-center">
                      <v-icon class="mt-1" size="60"> upload_file </v-icon>
                    </div>
                    <div class="text-center lead-paragraph">Drag and Drop</div>
                    <div class="d-flex justify-center">
                      <div>your file here or</div>
                      <v-btn
                        id="open-file-dialog"
                        class="link-button body pa-0 ma-0 ml-1"
                        @click="openFileDialog"
                        :ripple="false"
                      >
                        browse to upload
                      </v-btn>
                      <label class="sr-only" for="file-input-button"
                        >File Input</label
                      >
                      <input
                        id="file-input-button"
                        type="file"
                        ref="fileInput"
                        @change="addUploadedFile"
                        accept="application/pdf"
                        hidden
                      />
                    </div>
                  </div>
                  <div class="progress-view" v-if="isProgressBarVisible">
                    <div class="width-100 d-flex align-center my-12 ml-3">
                      <div>
                        <v-icon size="60"> upload_file </v-icon>
                      </div>
                      <div class="d-flex flex-column align-start">
                        <div class="d-flex justify-space-between width-100">
                          <div
                            class="text--base-darkest text-truncate mr-3"
                            style="max-width: 260px"
                          >
                            {{ _pdfFile.name }}
                          </div>
                          <v-icon
                            v-show="isFileUploadedSucessfully"
                            color="success"
                            size="25"
                          >
                            check_circle</v-icon
                          >
                        </div>
                        <div class="d-flex align-baseline">
                          <div id="progressBarWrapper">
                            <div
                              id="progressBar"
                              value="0"
                              max="100"
                              ref="progress-bar"
                            ></div>
                            <span>
                              {{ uploadingMessage }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
          </v-sheet>
          <v-icon color="error" class="ml-2" v-show="hasErrors"> error </v-icon>
        </div>
      </div>
      <v-virtual-scroll
        v-show="isFileUploaded && !isProgressBarVisible"
        :items="uploadedFile"
        height="75"
        item-height="50"
        class="uploaded-file-display"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="_pdfFile.name" class="pa-0">
            <v-list-item-content>
              <v-list-item-title>
                <div class="d-flex align-center justify-start">
                  <div class="pdf-icon mr-3 ml-1"></div>
                  <div class="body-lg text-truncate">
                    <a
                      href="##"
                      class="text-truncate"
                      style="min-width: 200px; width: 300px; max-width: 300px"
                      >{{ _pdfFile.name }}</a
                    >
                  </div>
                  <v-btn class="link-button no-border mr-5">
                    <v-icon>launch</v-icon>
                  </v-btn>
                  <v-btn
                    outlined
                    :ripple="false"
                    id="remove_file"
                    class="error-button"
                    @click.stop="removeFile(item.name)"
                  >
                    Remove
                  </v-btn>
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-flex>
    <v-flex v-show="!isFileUploaded">
      <label
        :id="id + '_file_upload_message'"
        class="form-field-label text--base"
      >
        {{ message }}
      </label>
    </v-flex>
  </div>
</template>
<!-- to do put this in scss file -->

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, PropSync } from "vue-property-decorator";
import { UploadedFile } from "../../types/FormFields";
import { TaskOrderFile } from "types/Wizard";
import axios from "axios";

@Component
export default class ATATFileUpload extends Vue {
  //props and PropSyncs
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: "Message" }) private message!: string;
  @Prop({ default: false }) private multiple!: boolean;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: 0 }) private maxFileSize!: number; // in megabytes
  @Prop({ default: 0 }) private stepNumber!: number;
  @PropSync("pdfFile") _pdfFile!: TaskOrderFile;
  @PropSync("errorMessageFromParent", {
    default: "Error Message from parent component validation",
  })
  _errorMessageFromParent!: string;

  //data
  private dragover = false;
  private files!: FileList;
  private uploadedFile: UploadedFile[] = [];
  private errorMessages: string[] = [];
  private isProgressBarVisible = false;
  private isFileUploadedSucessfully = false;
  private taskOrderFile: TaskOrderFile = {
    // description: "",
    id: "",
    created_at: "",
    updated_at: "",
    size: 0,
    name: "",
    status: "Pending",
  };
  private uploadingMessages: string[] = [
    "Uploading",
    "Virus Scanning",
    "Complete",
    "",
  ];
  private uploadingMessage = "";

  //computedFields
  get hasErrors(): boolean {
    return this.errorMessages.length > 0;
  }

  get isFileUploaded(): boolean {
    const stepHasBeenTouched: boolean = this.$store.getters.getStepTouched(
      this.stepNumber
    );
    if (stepHasBeenTouched) {
      this.isFileUploadedSucessfully = this._pdfFile.name !== "";
      this.uploadedFile = [{ name: this._pdfFile.name }];
      return this.isFileUploadedSucessfully;
    } else {
      return this.uploadedFile.length > 0;
    }
  }

  /**
   * Displays PDFUpload control border based on data values
   */

  get showBorderState(): string {
    let borderClass = "";
    if (this.hasErrors) {
      borderClass = "error-file-upload-border";
    } else if (this.isFileUploadedSucessfully) {
      borderClass = "success-file-upload-border";
    } else if (this.isProgressBarVisible) {
      borderClass = "primary-file-upload-border";
    }
    return borderClass;
  }

  //watchers

  /**
   * Watches isErrorFromParentDisplayed prop to determine when/if the
   * required error message from parent is to be dispalyed
   *
   * The required error message from parent will be displayed if no file is selected
   * and user clicks NEXT button to kick off PAGE validation
   */
  @Watch("errorMessageFromParent")
  protected(val: string): void {
    let isErrorFromParentDisplayed = this.errorMessages.indexOf(val) > -1;
    if (val !== "" && !isErrorFromParentDisplayed) {
      this.errorMessages.push(val);
    }
    this._errorMessageFromParent = "";
  }

  //methods
  /**
   * opens the browse to file dialog
   * returns void
   */
  private openFileDialog(): void {
    this.errorMessages = [];
    let fileInput = this.$refs.fileInput as HTMLInputElement;
    fileInput.value = "";
    fileInput.click();
  }

  /**
   *  Add uploaded file to appropriate data properties after validation
   *  Also, code kicks off the file upload animation
   * @event: DOM Event
   * @fileObj: HTML fileinput control Filelist, can be null
   */

  private async addUploadedFile(
    event: Event,
    filesObj?: FileList
  ): Promise<void> {
    let files = filesObj || (this.$refs.fileInput as HTMLInputElement).files;

    //temporary hack - Robert McCardell
    if (files != null) {
      this.files = files;
    }

    if (files && files[0]) {
      let file = files[0];
      await this.validateFile(file);
      if (!this.hasErrors) {
        await this.showProgress(file);
        this.uploadedFile.push(file);
        this.taskOrderFile = {
          // description: file.name,
          id: "",
          created_at: "",
          updated_at: "",
          size: file.size,
          name: file.name,
          status: "Pending",
        };
        this.uploadFile(this.taskOrderFile);
        this._errorMessageFromParent = "";
      }
    }
  }

  /**
   * kicks off the upload event to emulate the upload animation
   * @file;  fileObj from the HTML file upload control
   */
  private showProgress(file: File): void {
    const reader = new FileReader();
    this.isProgressBarVisible = true;
    reader.addEventListener("progress", this.fileUploadProgressEvent);
    reader.readAsText(file);
  }

  /**
   * Progress event to EMULATE animation as well as status to meet requirements
   * @event: Progress Event
   */
  private async fileUploadProgressEvent(event: ProgressEvent) {
    const progress = document.getElementById(
      "progressBar"
    ) as HTMLProgressElement;
    progress.style.width = "1%";

    if (event.loaded && event.total) {
      this.uploadingMessage = "";
      const percent = (event.loaded / event.total) * 100;

      if (progress) {
        this.isProgressBarVisible = true;
        let width = 1;
        let showProgressAnimation = function (this: ATATFileUpload) {
          if (width >= 100) {
            this.isFileUploadedSucessfully = true;
            clearInterval(_showProgressAnimation);
          } else {
            width++;
            progress.style.width = width + "%";
          }
        }.bind(this);
        let _showProgressAnimation = await setInterval(
          showProgressAnimation,
          30
        );
        // progress.style.width = percent + "%";
        // Math.round(percent) + "%";
      }

      if (percent === 100) {
        let counter = 0;
        let showUploadingMessages = function (this: ATATFileUpload) {
          if (counter === this.uploadingMessages.length) {
            counter = 0;
            this.isProgressBarVisible = false;
            this.isFileUploadedSucessfully = false;
            clearInterval(_showUploadingMessages);
          } else {
            this.uploadingMessage = this.uploadingMessages[counter];
            counter++;
          }
        }.bind(this);
        let _showUploadingMessages = await setInterval(
          showUploadingMessages,
          3000,
          this.uploadingMessages
        );
      }
    }
  }

  /**
   * Uploads TaskOrderFile obj to the API
   * @taskorderFile: TaskOrderFile - to be uploaded to the API
   */
  private async uploadFile(taskOrderFile: TaskOrderFile): Promise<void> {
    const formData = new FormData();
    formData.append(taskOrderFile.name, this.files[0]);

    await axios
      .post(
        "https://gj78s0sep8.execute-api.us-gov-west-1.amazonaws.com/prod/taskOrderFiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        this.taskOrderFile = response.data;
        this.uploadedFile = [this.taskOrderFile];
        // todo add this._pdfFile = taskOrderFile when
        // API is ready
        // console.log(this);
        this._pdfFile = this.taskOrderFile;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /**
   * validates file and returns a Promise<boolean> for valid/invalid file
   * @file: File Object from HTML File Input
   */

  public async validateFile(file: File): Promise<boolean> {
    /**
     * validates the extension and the file.type
     */
    if (file.type !== "application/pdf" || file.name.indexOf(".pdf") === 0) {
      this.errorMessages.push("File is not a valid PDF");
    }
    /**
     * validates name
     */
    if (file.name === "") {
      this.errorMessages.push("Please upload your Task Order Document");
    }
    /**
     * validates the maxFileSize
     */
    if (file.size > this.maxFileSize * 1048576) {
      //1 Megabytes = 1048576 Bytes
      this.errorMessages.push(
        "File size cannot exceed " + this.maxFileSize + "MB"
      );
    }
    /**
     *  validates the first 8 characters of the PDF binary file data to ensure it
     *  matches tis regexp RegExp("%PDF-1.[0-7]"). All pdf files binary data when
     *  converted to a string will start with RegExp("%PDF-1.[0-7]");
     *  use case:  user could change the extension of a .txt file to .pdf
     *             and try to upload
     */
    if (file.name.indexOf(".pdf") > 0) {
      let isPDFInvalid = await this.isPDFInvalid(file);
      if (isPDFInvalid) {
        this.errorMessages.push("File is not a valid PDF");
        this.uploadedFile.splice(0, 1);
      }
    }

    return this.errorMessages.length > 0;
  }

  /**
   * Checks to see if RegExp("%PDF-1.[0-7]") can be
   * found in the PDF file.  If so, the file is a valid PDF File
   * @file: fileObject from HTML File input
   */
  private async isPDFInvalid(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        let regex = new RegExp("%PDF-1.[0-7]");
        let data = e.target.result;
        resolve(data.match(regex) === null);
      };
      reader.readAsText(file);
    });
  }

  /**
   * Removes file and clears the display of uploaded file
   * @fileName;  name of the file to be removed
   */
  private removeFile(fileName: string) {
    const index = this.uploadedFile.findIndex((file) => file.name === fileName);
    if (index > -1) {
      this.uploadedFile.splice(index, 1);
      this.errorMessages = [];
      this.isProgressBarVisible = false;
      this._errorMessageFromParent = "";
      this._pdfFile = {
        // description: "",
        id: "",
        created_at: "",
        updated_at: "",
        size: 0,
        name: "",
        status: "",
      };
    }

    this.$emit("removeFile");
  }

  private onDrop(e: DragEvent) {
    this.dragover = false;

    // Check if there are already uploaded files
    // if there are remove them
    if (this.uploadedFile.length > 0) {
      this.uploadedFile = [];
    }

    if (!this.multiple && e.dataTransfer && e.dataTransfer.files.length > 1) {
      // add for multiple files...someday....
    } else {
      if (e.dataTransfer) {
        this.errorMessages = [];
        this.addUploadedFile(e, e.dataTransfer.files);
      }
    }
  }
}
</script>
