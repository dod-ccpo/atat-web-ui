<template>
  <div class="content-div d-flex align-center mb-5">
    <ATATSVGIcon
      :color="uploadingFileObj.isErrored ? 'error' : 'base'"
      :name="isPDF(uploadingFileObj.file.name) ? 'pdf' : 'filePresent'"
      :width="32"
      :height="50"
    />

    <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
      <div v-if="uploadFile">
        <div class="filename-and-extension d-flex align-start width-100">
          <div :id="'File0' + index" v-if="uploadingFileObj.file.name.length < 50">
            {{ uploadingFileObj.file.name }}
          </div>
          <div :id="'File0' + index" class="d-flex align-center justify-space-between" v-else>
            <div class="truncated-file-name">
              {{ uploadingFileObj.file.name }}
            </div>
            <div class="ml-n1 mr-n1">...</div>
            <div class="truncated-ext">{{ getExtension(uploadingFileObj.file.name) }}</div>
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
            <div :id="'File0' + index" v-if="uploadingFileObj.file.name.length < 50">
              {{ uploadingFileObj.file.name }}
            </div>
            <div :id="'File0' + index" class="d-flex align-center" v-else>
              <div class="truncated-file-name">
                {{ uploadingFileObj.file.name }}
              </div>
              <div class="ml-n3">...</div>
              <div class="truncated-ext">{{ getExtension(uploadingFileObj.file.name) }}</div>
            </div>
            <div>
              <ATATSVGIcon
                :id="'viewIcon0' + index"
                name="externalLink"
                color="primary"
                :width="15"
                :height="15"
                class="ml-2"
              />
            </div>
          </a>
        </div>
        <div>
          <span>Uploaded {{ getLastModifiedDate() }}</span>
        </div>
      </div>
    </div>
    <v-btn
      class="secondary ml-auto"
      :id="'RemoveFile0' + index"
      v-if="!isLoading"
      @click="removeFile(index)"
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
import { Component, Prop } from "vue-property-decorator";
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
  @Prop({ default: ()=>({})}) private uploadingFileObj!: uploadingFile;

  /** DATA */
  private isLoading = true;

  get uploadFile(): boolean{
    // setTimeout(()=>{
    this.isLoading = this.uploadingFileObj.progressStatus<100;
    return this.isLoading;
    // }, 100)
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
    let ext = "";
    if (filename.length > 45) {
      ext = filename.substr(filename.lastIndexOf(".") + 1);
      return filename.substr(0, 45) + "..." + ext;
    }
    return filename;
  }

  private getExtension(filename: string): string {
    return filename.substr(filename.lastIndexOf(".") + 1);
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

  private removeFile(idx: number): void {
    Vue.nextTick(() => {
      this.$emit("removeFiles", idx);
    });
  }

  /**
   * uploads file when mounted
   */
  private mounted(): void {
    // console.log(this.uploadingFileObj)
    // this.uploadFile();
  }
}
</script>
