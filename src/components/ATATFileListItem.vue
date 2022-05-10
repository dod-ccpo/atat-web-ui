<template>
  <div
    class="content-div d-flex align-center mb-5"
  >
    <ATATSVGIcon
      :name="isPDF(file.name) ? 'pdf' :'filePresent'"
      :width="32"
      :height="50"
    />

    <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
      <div v-if="isLoading">
        <div class="filename-and-extension d-flex align-start">
          <div :id="'File0' + index">
            {{ getTruncatedFileName(file.name) }}
          </div>
        </div>
        <div class="d-flex align-center mt-auto">
          <v-progress-linear
            class="progress-bar mr-5"
            v-model="uploadingStatus"
            height="16"
          >
          </v-progress-linear>
          <a
            role="button"
            :id="'StopLoadingFile0' + index"
            @click="removeFile(index)"
          >
            <ATATSVGIcon
              name="close"
              color="base"
              :width="11"
              :height="11"
            />
          </a>
        </div>
      </div>
      <div v-else>
        <div>
          <a
            role="button"
            :id="'FileLink0' + index"
            target="_blank"
            class="_text-link"
          >
            {{ getTruncatedFileName(file.name) }}
            <span class="_external-link"></span>
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

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class ATATFileListItem extends Vue {

  /** PROPS */
  @Prop({ default: () => [] }) private file!: File;
  @Prop({ default: 0 }) private index!: number;

  /** DATA */
  private uploadingStatus = 0;
  private uploadingStatusInterval = 0;
  private isLoading = true;

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
    Vue.nextTick(()=>{
      this.$emit("removeFiles", idx)
    });
  }
  
  /**
   *  start the progress bar.  Temp for now until we can tie into
   *  the API call.
   */
  private uploadFile(): void{
    const progressInterval = Math.random() *(5);
    console.log(progressInterval);
    this.uploadingStatusInterval = setInterval(
      () => {
        if (this.uploadingStatus < 100) {
          this.uploadingStatus += progressInterval;
        } else {
          this.isLoading = false;
          clearInterval(this.uploadingStatusInterval);
        }
      }, 50
    );
  }


  /**
   * uploads file when mounted
   */
  private mounted(): void{
    this.uploadFile();
  }
}
</script>
