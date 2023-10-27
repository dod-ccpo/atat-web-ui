<template>
  <div v-if="uploadingFiles.length > 0">
    <v-card flat class="file-loading-div pa-6">
      <v-card-title
        v-if="multiplesAllowed === true"
        :class="[{ 'pb-6': multiplesAllowed }, 'h2 pa-0']"
      >
        {{ getFileUploadsDivTitle() }}
      </v-card-title>
      <div v-for="(uploadingFile, idx) of uploadingFiles" :key="idx">
        <ATATFileListItem
          :index="idx"
          :uploadingFileObj="uploadingFile"
          @removeFiles="initiateRemoveFiles"
          :class="[{ 'mb-5': multiplesAllowed }]"
        />
      </div>
    </v-card>
    <ATATDialog
      id="DeleteFilesConfirmation"
      :showDialog.sync="showDialog"
      :title="confirmRemovalTitle"
      no-click-animation
      okText="Delete file"
      cancelText="Cancel"
      width="450"
      @cancelClicked="onCancelClicked"
      @ok="onRemoveClicked"
    >
      <template #content>
        <div class="body">
          {{ confirmRemovalMessage }}
        </div>
      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATFileListItem from "@/components/ATATFileListItem.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDialog from "./ATATDialog.vue";
import { uploadingFile } from "types/Global";

@Component({
  components: {
    ATATFileListItem,
    ATATSVGIcon,
    ATATDialog,
  },
})
class ATATFileList extends Vue {
  @Prop({ default: "61686c" }) private color!: string;
  @Prop({ default: () => [] }) private validFiles!: uploadingFile[];
  @PropSync("isFullSize", { default: true }) private _isFullSize!: boolean;
  @PropSync("removeAll", { default: false }) public _removeAll?: boolean;

  @Prop({ default: true }) private multiplesAllowed!: boolean;
  @Prop({ default: "" }) private title!: string;
  private uploadingFiles: uploadingFile[] = [];

  @Prop({ default: false }) private confirmRemoval?: boolean;
  @Prop({ default: "Are you sure?" }) private confirmRemovalTitle?: string;
  @Prop({ default: "Are you sure you want to remove the file(s)?" })
  private confirmRemovalMessage?: string;
  private showDialog = false;
  private holdIdxForRemoval?: number;

  /**
   * sets title to plural when necessary
   */
  private getFileUploadsDivTitle(): string {
    if (this.title.length > 0) {
      return this.title;
    }

    if (this.multiplesAllowed) {
      return "Your Upload" + (this.uploadingFiles.length > 1 ? "s" : "");
    }
    return "";
  }
  @Watch("_removeAll")
  public removeAllChange(newVal: boolean): void {
    if (newVal) {
      for (let index = 0; index < this.uploadingFiles.length; index++) {
        this.initiateRemoveFiles(0);
      }
      this._removeAll = false;
    }
  }

  private initiateRemoveFiles(idx: number): void {
    if (this.confirmRemoval) {
      this.holdIdxForRemoval = idx;
      this.showDialog = true;
    } else {
      this.removeFiles(idx);
    }
  }

  /**
   * @param idx: number
   * removes file from both file arrays at index
   */
  private removeFiles(idx: number): void {
    this.$nextTick(() => {
      const fileToDelete = this.uploadingFiles[idx];
      this.uploadingFiles.splice(idx, 1);
      this.validFiles.splice(idx, 1);
      this._isFullSize = this.validFiles.length === 0;
      this.$emit("delete", fileToDelete);
    });
  }

  private onCancelClicked() {
    this.holdIdxForRemoval = undefined;
    this.showDialog = false;
  }

  private onRemoveClicked() {
    if (typeof this.holdIdxForRemoval !== 'undefined') {
      this.removeFiles(this.holdIdxForRemoval);
    }
    this.showDialog = false;
  }

  /**
   * add files to this.files when necessary
   * preventing the same file from being displayed
   * multiple times
   */
  @Watch("validFiles")
  protected setFilesToDisplay(): void {
    if (this.uploadingFiles.length < this.validFiles.length) {
      this.validFiles.forEach((vFile) => {
        const doesFileExist = this.uploadingFiles.some((fileObj) => {
          return (
            vFile.file.name === fileObj.file.name &&
            vFile.file.lastModified === fileObj.file.lastModified &&
            vFile.file.size === fileObj.file.size
          );
        });

        if (!doesFileExist) {
          this.uploadingFiles.push(vFile);
        }
      });
    }
  }
}
export default ATATFileList;
</script>
