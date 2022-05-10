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
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
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
  @Prop({ default: () => [] }) private validFiles!: File[];
  @PropSync("isFullSize", {default: true}) private _isFullSize!: boolean;

  private files: File[] = [];

  /**
   * sets title to plural when necessary
   */
  private getFileUploadsDivTitle(): string {
    return "Your Upload" + (this.files.length > 1 ? "s" : "");
  }

  /**
   * @param idx: number
   * removes file from both file arrays at index 
   */
  private removeFiles(idx: number): void {
    Vue.nextTick(()=>{
      this.files.splice(idx, 1);
      this.validFiles.splice(idx,1);
      this._isFullSize = this.validFiles.length === 0;
    })
  }

  /**
   * add files to this.files when necessary
   * preventing the same file from being displayed
   * multiple times
   */
  @Watch("validFiles")
  protected setFilesToDisplay(): void{
    if (this.files.length<this.validFiles.length){
      this.validFiles.forEach((vFile)=>{
  
        //check to see if file exists
        const doesFileExist = this.files.some(
          (file) => {
            return vFile.name === file.name}
        )

        if (!doesFileExist){
          this.files.push(vFile);
        }
      });
    }
  }
}
</script>
