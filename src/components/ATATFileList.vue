<template>
  <div v-if="files.length > 0">
    <v-card flat class="file-loading-div pa-6">
      <v-card-title class="h2 pa-0 pb-6">{{
        getFileUploadsDivTitle()
      }}</v-card-title>
      <div v-for="(file, idx) of files" :key="idx">
        <ATATFileListItem
          :index="idx"
          :file="file"
          @removeFiles="removeFiles"
        />
      </div>
    </v-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATFileListItem from "@/components/ATATFileListItem.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATFileListItem,
    ATATSVGIcon,
  },
})
export default class ATATFileList extends Vue {
  @Prop({ default: "61686c" }) private color!: string;
  @Prop({ default: () => [] }) private files!: File[];
  @Prop({ default: -1 }) private indexToDisplay!: number;

  private getFileUploadsDivTitle(): string {
    return "Your Upload" + (this.files.length > 1 ? "s" : "");
  }

  private removeFiles(idx: number): void {
    this.files.splice(idx, 1);
  }
}
</script>
