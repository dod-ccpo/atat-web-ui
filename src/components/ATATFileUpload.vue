<template>
  <v-sheet class="atat-file-upload" width="416">
    <v-card
      id="file_upload"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      elevation="0"
    >
      <v-card-text>
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            upload_file
          </v-icon>
          <span class="lead-paragraph">Drag and Drop</span>
          <span>your file here or <a href="##">browse to upload</a>.</span>
        </v-row>
        <v-virtual-scroll
          v-if="uploadedFiles.length > 0"
          :items="uploadedFiles"
          height="150"
          width="416"
          item-height="50"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.name">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                  <span class="ml-3 text--secondary">
                    {{ Math.ceil(item.size / 1024) }} bytes</span
                  >
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  class="error"
                  :outlined="true"
                  id="remove_file"
                  @click.stop="removeFile(item.name)"
                >
                  Remove
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UploadedFile } from "../../types/FormFields";

@Component
export default class FileDrop extends Vue {
  // internal properties
  private dragover = false;
  private uploadedFiles: UploadedFile[] = [];

  @Prop({ default: "", required: true }) private dialog!: boolean;
  @Prop({ default: false }) private multiple!: boolean;

  private closeDialog() {
    this.uploadedFiles = [];
    this.$emit("update:dialog", false);
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
