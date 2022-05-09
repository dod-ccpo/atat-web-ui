<template>
  <div
    class="content-div d-flex align-center mb-5"
  >
    <ATATSVGIcon
      :name="isPDF(file) ? 'pdf' :'filePresent'"
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
            @click="removeFile(file)"
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

  @Prop({ default: () => [] }) private file!: File;
  @Prop({ default: 0 }) private index!: number;
  private uploadingStatus = 0;
  private uploadingStatusInterval = 0;
  private isLoading = true;

  private getLastModifiedDate(): string {
    return (
      format(new Date(), "MMM dd, yyyy HHmm") +
      " " +
      formatInTimeZone(new Date(), "America/New_York", "zzz")
    );
  }

  private getTruncatedFileName(filename: string): string {
    let ext = "";
    if (filename.length > 45) {
      ext = filename.substr(filename.lastIndexOf(".") + 1);
      return filename.substr(0, 45) + "..." + ext;
    }
    return filename;
  }

  private isPDF(file: File): boolean {
    return (
      file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase() === "pdf"
    );
  }

  private removeFile(idx: number): void {
    this.$emit("removeFiles", idx)
  }

  private uploadFile(): void{
    console.log(this.file.size);
    const progressInterval = Math.ceil((this.file.size/100));
    this.uploadingStatusInterval = setInterval(
      () => {
        if (this.uploadingStatus < this.file.size) {
          this.uploadingStatus += progressInterval;
        } else {
          this.isLoading = false;
          clearInterval(this.uploadingStatusInterval);
        }
      }
    );
  }

  private mounted(): void{
    this.uploadFile();
  }
}
</script>
