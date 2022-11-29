<template>
  <div class="content-div d-flex align-center">
    <ATATSVGIcon
      :name="isPDF(uploadingFileObj.fileName) ? 'pdf' : 'filePresent'"
      :width="32"
      :height="50"
    />

    <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
      <div v-if="isLoading" class="">
        <div class="-flex align-center justify-start">
          <div
            :id="'File0' + index"
            v-if="uploadingFileObj.fileName.length < 50"
          >
            {{ uploadingFileObj.fileName }}
          </div>
          <div
            :id="'File0' + index"
            class="d-flex align-center width-100"
            v-else
          >
            <div class="truncated-file-name width-70">
              {{ uploadingFileObj.fileName }}
            </div>
            <div class="truncated-extension width-30 d-flex align-center">
              {{ getExtension(uploadingFileObj.fileName) }}
            </div>
          </div>
        </div>
        <div class="d-flex align-center mt-auto">
          <v-progress-linear
            class="progress-bar mr-5"
            v-model="uploadingFileObj.progressStatus"
            height="16"
          >
          </v-progress-linear>
          <a
            role="button"
            :id="'StopLoadingFile0' + index"
            @click="removeFile(index)"
          >
            <ATATSVGIcon name="close" color="base" :width="11" :height="11" />
          </a>
        </div>
      </div>
      <div v-else>
        <div class="width-100">
          <a
            role="button"
            :id="'FileLink0' + index"
            target="_blank"
            :href="uploadingFileObj.link"
            class="_text-link d-flex align-center justify-start"
          >
            <div
              :id="'File0' + index"
              v-if="uploadingFileObj.fileName.length < 50"
              class="d-flex align-center"
            >
              {{ uploadingFileObj.fileName }}
              <ATATSVGIcon
                  class="d-inline-block ml-1"
                  v-if="!uploadingFileObj.isErrored"
                  :id="'viewIcon0' + index"
                  name="externalLink"
                  color="primary"
                  :width="15"
                  :height="15"
                />
            </div>
            <div
              :id="'File0' + index"
              class="d-flex align-center width-100"
              v-else
            >
              <div class="truncated-file-name width-70">
                {{ uploadingFileObj.fileName }}
              </div>
              <div class="truncated-extension width-30 d-flex align-center">
                {{ getExtension(uploadingFileObj.fileName) }}
                <ATATSVGIcon
                  class="d-inline-block ml-1"
                  v-if="!uploadingFileObj.isErrored"
                  :id="'viewIcon0' + index"
                  name="externalLink"
                  color="primary"
                  :width="15"
                  :height="15"
                />
              </div>
            </div>
          </a>
        </div>
        <div>
          <span> Uploaded {{ getLastModifiedDate() }}</span>
        </div>
      </div>
    </div>
    <v-btn
      class="secondary ml-auto"
      :id="'RemoveFile0' + index"
      v-if="!isLoading"
      @click="removeFile(index, ...arguments)"
    >
      <ATATSVGIcon
        name="remove"
        color="primary"
        :width="12"
        :height="15"
        class="mr-2"
      />
      Remove
    </v-btn>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { uploadingFile } from "types/Global";

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class ATATFileListItem extends Vue {
  /** PROPS */
  @Prop({ default: 0 }) private index!: number;
  @Prop({ default: () => ({}) }) private uploadingFileObj!: uploadingFile;

  /** DATA */
  get isLoading(): boolean {

    return this.uploadingFileObj && 
    this.uploadingFileObj.progressStatus < 100 &&
    this.uploadingFileObj.isErrored === false
  }



  /**
   * Watches for `isErrored` to change after
   * file uploads to SNOW. If `true` remove file
   * and stop progress bar
   */
  @Watch("uploadingFileObj.isErrored")
  protected IsFileErrored(newVal: boolean): void {
    if (newVal) {
      this.removeFile(this.index);
    }
  }

  /**
   * formats lastModifiedDate w/timezone
   */

  private getLastModifiedDate(): string {
    return (
      format(new Date(), "MMM dd, yyyy HHmm") +
      " " +
      formatInTimeZone(new Date(), "America/New_York", "zzz")
    );
  }

  /**
   * formats truncated filename
   */

  private getTruncatedFileName(filename: string): string {
    if (filename.length > 45) {
      return (
        filename.substr(0, 45) +
        "..." +
        filename.substr(filename.length - 13, filename.length)
      );
    }
    return filename;
  }

  /**
   * @param filename: string
   * returns extension
   */
  private getExtension(filename: string): string {
    return "..." + filename.substr(filename.length - 13, filename.length);
  }

  /**
   * @param fileName: string
   * returns if file is PDF
   */

  private isPDF(fileName: string): boolean {
    return (
      fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase() === "pdf"
    );
  }

  /**
   * @param idx: number
   *
   * removes file at index
   */
  private removeFile(idx: number, event: Event): void {
    event.preventDefault();
    Vue.nextTick(() => {
      this.$emit("removeFiles", idx);
    });
  }
}
</script>
