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
      <v-sheet class="atat-file-upload" width="416" v-show="!isFileUploaded">
        <v-card
          id="file_upload"
          @drop.prevent="onDrop($event)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
          elevation="0"
        >
          <v-card-text>
            <v-row
              class="d-flex flex-column"
              dense
              align="center"
              justify="center"
            >
              <v-icon class="mt-1" size="60"> upload_file </v-icon>
              <div class="lead-paragraph">Drag and Drop</div>
              <div class="d-flex align-items-center">
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
import { Component, Prop } from "vue-property-decorator";
import { UploadedFile } from "../../types/FormFields";

@Component
export default class ATATFileUpload extends Vue {
  // internal properties
  private dragover = false;
  private uploadedFiles: UploadedFile[] = [];
  get isFileUploaded(): boolean {
    return this.uploadedFiles.length > 0;
  }

  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: "Message" }) private message!: string;
  @Prop({ default: "", required: true }) private dialog!: boolean;
  @Prop({ default: false }) private multiple!: boolean;
  @Prop({ default: false }) private optional!: boolean;

  private closeDialog() {
    this.uploadedFiles = [];
    this.$emit("update:dialog", false);
  }

  private openFileDialog() {
    let fileInput = this.$refs.fileInput as HTMLInputElement;
    fileInput.value = "";
    fileInput.click();
  }

  private addUploadedFiles() {
    let files = (this.$refs.fileInput as HTMLInputElement).files;
    if (files) {
      if (this.validateFile(files)) {
        for (let i = 0; i < files.length; i++) {
          this.uploadedFiles.push(files[i]);
        }
      }
    }
  }

  private validateFile(files: FileList): boolean {
    // for (let i = 0; i < files.length; i++) {
    //   files[i].type = "application/pdf";

    //   this.uploadedFiles.push(files[i]);
    // }
    return true;
  }
  private removeFile(fileName: string) {
    const index = this.uploadedFiles.findIndex(
      (file) => file.name === fileName
    );
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
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
