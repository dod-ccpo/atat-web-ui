<template>
  <div v-if="files.length > 0">
    <v-card flat class="file-loading-div pa-6">
      <v-card-title class="h2 pa-0 pb-6">{{
        fileLoadingDivTitle
      }}</v-card-title>
      <div
        class="content-div d-flex align-center mb-5"
        v-for="(file, idx) of files"
        :key="idx"
      >
        <ATATSVGIcon name="pdf" color="base" :width="32" :height="40" />
        <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
          <div v-if="isLoading">
            <div class="filename-and-extension d-flex align-start">
              <div :id="'File0' + idx">
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
              <ATATSVGIcon name="close" color="base" :width="11" :height="11" />
            </div>
          </div>
          <div v-else>
            <div>
               <a 
                role="button" 
                :id="'FileLink0' + idx" 
                target="_blank"
                class="_text-link">
                {{ getTruncatedFileName(file.name) }}
                <span class="_external-link"></span>
              </a>
            </div>
            <div>
              <span
                >Uploaded {{ getLastModifiedDate(file.lastModified) }}</span
              >
            </div>
          </div>
        </div>
        <v-btn class="secondary ml-auto" v-if="!isLoading">
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
    </v-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class ATATFileList extends Vue {
  @Prop({ default: "61686c" }) private color!: string;
  @Prop({ default: () => [] }) private files!: File[];
  @Prop({ default: -1 }) private indexToDisplay!: number;
  @Prop({ default: false }) private isLoading!: boolean;
  @Prop({ default: "Your Uploads" }) private fileLoadingDivTitle!: string;
  @Prop({ default: 0 }) private uploadingStatus!: number;

  private getLastModifiedDate(lastModifiedDate: Date): string {
    return format(new Date(lastModifiedDate), "MMM dd, yyyy hhmm") + ' ' +
      formatInTimeZone(new Date(lastModifiedDate), 'America/New_York', 'zzz') 
  } 

  private getTruncatedFileName(filename: string): string {
    let ext = "";
    if (filename.length > 45) {
      ext = filename.substr(filename.lastIndexOf(".") + 1);
      return filename.substr(0, 45) + "..." + ext;
    }
    return filename;
  }
}
</script>
