<template>
  <div v-if="uploadingFiles.length > 0">
    <v-card flat class="file-loading-div pa-6">
      <v-card-title 
        v-if="multiplesAllowed === true"
        :class="[
          { 'pb-6': multiplesAllowed },
          'h2 pa-0',
        ]">
        {{ getFileUploadsDivTitle() }}
      </v-card-title>
      <div v-for="(uploadingFile, idx) of uploadingFiles" :key="idx">
        <ATATFileListItem
          :index="idx"
          :uploadingFileObj="uploadingFile"
          @removeFiles="removeFiles"
          :class="[{ 'mb-5': multiplesAllowed }]"
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
import { uploadingFile } from "types/Global";

@Component({
  components: {
    ATATFileListItem,
    ATATSVGIcon,
  },
})
export default class ATATFileList extends Vue {
  @Prop({ default: "61686c" }) private color!: string;
  @Prop({ default: () => [] }) private validFiles!: uploadingFile[];
  @PropSync("isFullSize", {default: true}) private _isFullSize!: boolean;
  @PropSync("removeAll", {default: false}) public _removeAll?: boolean
  @Prop({ default: true }) private multiplesAllowed!: boolean;
  @Prop({ default: "" }) private title!: string;
  private uploadingFiles: uploadingFile[] = [];

  /**
   * sets title to plural when necessary
   */
  private getFileUploadsDivTitle(): string {

    if(this.title.length > 0)
    {
      return this.title;
    }
    
    if (this.multiplesAllowed){
      return "Your Upload" + (this.uploadingFiles.length > 1 ? "s" : "");
    }
    return ''
  }
  @Watch("_removeAll")
  public removeAllChange(newVal:boolean):void {
    if(newVal){
      for (let index = 0; index < this.uploadingFiles.length; index++) {
        this.removeFiles(0);
      }
      this._removeAll = false;
    }

  }

  /**
   * @param idx: number
   * removes file from both file arrays at index 
   */
  private removeFiles(idx: number): void {
    Vue.nextTick(()=>{
      const fileToDelete = this.uploadingFiles[idx];
      this.uploadingFiles.splice(idx, 1);
      this.validFiles.splice(idx,1);
      this._isFullSize = this.validFiles.length === 0;
      this.$emit('delete', fileToDelete);
    })
  }

  /**
   * add files to this.files when necessary
   * preventing the same file from being displayed
   * multiple times
   */
  @Watch("validFiles")
  protected setFilesToDisplay(): void{
    if (this.uploadingFiles.length<this.validFiles.length){
      this.validFiles.forEach((vFile)=>{
  
        const doesFileExist = this.uploadingFiles.some((fileObj) => {
          return vFile.file.name === fileObj.file.name
            && vFile.file.lastModified === fileObj.file.lastModified
            && vFile.file.size === fileObj.file.size;
        });

        if (!doesFileExist){
          this.uploadingFiles.push(vFile);
        }
      });
    }
  }
}
</script>
