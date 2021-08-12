<template>
  <div>
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
      <v-sheet
        :class="[
          hasErrors
            ? 'error-file-upload-border'
            : showProgressBar
            ? 'primary-file-upload-border'
            : '',
          'atat-file-upload',
        ]"
        width="416"
        v-show="!isFileUploaded"
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
                v-show="!showProgressBar"
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
                  <input
                    id="file-input-button"
                    type="file"
                    ref="fileInput"
                    @change="addUploadedFiles"
                    accept="application/pdf"
                    hidden
                  />
                </div>
              </div>
              <div v-show="showProgressBar" class="progress-view">
                <div class="width-100 d-flex align-center my-12 ml-3">
                  <div>
                    <v-icon size="60"> upload_file </v-icon>
                  </div>
                  <div class="d-flex flex-column align-start">
                    <div class="d-flex justify-space-between">
                      <div
                        class="text--base-darkest text-truncate mr-3"
                        style="max-width: 260px"
                      >
                        {{ taskOrderFile.name }}
                      </div>
                      <v-icon color="success" size="25"> check_circle</v-icon>
                    </div>
                    <div class="d-flex align-baseline">
                      <progress
                        class="mt-1"
                        id="progress"
                        value="0"
                        max="100"
                        ref="progress-bar"
                      ></progress>
                    </div>
                  </div>
                </div>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-sheet>
      <v-virtual-scroll
        v-show="isFileUploaded"
        :items="uploadedFiles"
        height="75"
        item-height="50"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item.name" class="pa-0">
            <v-list-item-content>
              <v-list-item-title>
                <div class="d-flex align-center justify-start">
                  <div class="pdf-icon mr-3 ml-1"></div>
                  <div class="body-lg">
                    <a href="##">{{ item.name }}</a>
                  </div>
                  <v-btn class="link-button no-border mr-16">
                    <v-icon>launch</v-icon>
                  </v-btn>
                  <v-btn
                    outlined
                    :ripple="false"
                    id="remove_file"
                    class="error-button no-border"
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
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import { UploadedFile } from "../../types/FormFields";
import { TaskOrderFile } from "types/Wizard";

@Component
export default class ATATFileUpload extends Vue {
  // internal properties
  private dragover = false;
  private uploadedFiles: UploadedFile[] = [];
  private errorMessages: string[] = [];
  private showProgressBar = false;
  private taskOrderFile: TaskOrderFile = {
    description: "",
    id: "",
    created_at: "",
    updated_at: "",
    size: 0,
    name: "",
    status: "Pending",
  };

  get hasErrors(): boolean {
    return this.errorMessages.length > 0;
  }

  get isFileUploaded(): boolean {
    return this.uploadedFiles.length > 0;
  }

  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: "Message" }) private message!: string;
  @Prop({ default: false }) private multiple!: boolean;
  @Prop({ default: false }) private optional!: boolean;
  @Prop() private pdfFile!: TaskOrderFile;
  @Prop({ default: 0 }) private maxFileSize!: number; // in megabytes

  private closeDialog() {
    this.uploadedFiles = [];
  }

  private openFileDialog() {
    this.errorMessages = [];
    let fileInput = this.$refs.fileInput as HTMLInputElement;
    fileInput.value = "";
    fileInput.click();
  }

  @Emit()
  private async addUploadedFiles() {
    let files = (this.$refs.fileInput as HTMLInputElement).files;
    if (files && files[0]) {
      let file = files[0];
      this.showProgress(file);
      await this.validateFile(file);
      if (!this.hasErrors) {
        this.uploadedFiles.push(file);
        this.taskOrderFile = {
          description: file.name,
          id: "",
          created_at: "",
          updated_at: "",
          size: file.size,
          name: file.name,
          status: "Pending",
        };
        this.uploadFile(this.taskOrderFile);
      }
    }
  }

  private async showProgress(file: File): Promise<void> {
    this.showProgressBar = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    await reader.addEventListener("progress", (event) => {
      const progress = this.$refs["progress-bar"] as HTMLProgressElement;
      const progressLabel = this.$refs["progress-label"] as HTMLLabelElement;
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        if (progress) {
          progress.value = percent;
          progressLabel.innerHTML = Math.round(percent) + "%";
          Math.round(percent) + "%";
        }
      }
    });
    // this.showProgressBar = false;
  }

  private async uploadFile(taskOrderFile: TaskOrderFile): Promise<void> {
    await this.$http.post("taskOrderFiles", taskOrderFile).then(function (res) {
      console.log(res);
    });
    this.$emit("update:pdfFile", taskOrderFile);
    // this.showProgressBar = false;
  }

  private async validateFile(file: File) {
    if (file.type !== "application/pdf" || file.name.indexOf(".pdf") === 0) {
      this.errorMessages.push("File is not a valid PDF");
    }
    if (file.name === "") {
      this.errorMessages.push("Please upload your Task Order Document");
    }
    if (file.name.indexOf(".pdf") > 0) {
      var reader = new FileReader();
      reader.onload = (function (file, errorMessages, uploadedFiles) {
        return function (e: any) {
          let regex = new RegExp("%PDF-1.[0-7]");
          let pdfData: string = e.target.result;
          if (pdfData.match(regex) === null) {
            errorMessages.push("File is not a valid PDF");
            uploadedFiles.splice(0, 1);
          }
        };
      })(file, this.errorMessages, this.uploadedFiles);
      await reader.readAsText(file);
    }
    if (file.size > this.maxFileSize * 1048576) {
      //1 Megabytes = 1048576 Bytes
      this.errorMessages.push(
        "File size cannot exceed " + this.maxFileSize + "MB"
      );
    }
  }

  private removeFile(fileName: string) {
    const index = this.uploadedFiles.findIndex(
      (file) => file.name === fileName
    );
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.errorMessages = [];
    }
  }

  private onDrop(e: DragEvent) {
    this.dragover = false;
    // Check if there are already uploaded files
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles = [];
    }

    if (!this.multiple && e.dataTransfer && e.dataTransfer.files.length > 1) {
      this.$store.dispatch("addNotification", {
        message: "Only one file can be uploaded at a time..",
        colour: "error",
      });
    } else {
      if (e.dataTransfer) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.uploadedFiles.push(e.dataTransfer.files[i]);
        }
      }
    }
  }

  private submit() {
    // If there aren't any files to be uploaded throw error
    if (this.uploadedFiles.length === 0) {
      this.$store.dispatch("addNotification", {
        message: "There are no files to upload",
        color: "error",
      });
    } else {
      // Send uploaded files to parent component
      this.$emit("filesUploaded", this.uploadedFiles);
      // Close the dialog box
      this.closeDialog();
    }
  }
}
</script>
