<template>
  <div v-if="files.length>0">
    <v-card flat class="file-loading-div"
    >
      <v-card-title class="h2 pa-0 pb-6">{{
        fileLoadingDivTitle
      }}</v-card-title>
      <div class="content-div d-flex align-center mb-5" 
        v-for="(file,idx) of files" :key="idx" >
        <ATATSVGIcon name="pdf" color="base" :width="32" :height="40" />
        <div class="d-flex flex-column filename-and-progress-bar-div ml-3">
          <div class="filename text-truncate">
            {{ file.name }}
          </div>
          <div class="d-flex align-center mt-auto">
            <v-progress-linear
              class="progress-bar mr-5"
              v-model="uploadingStatus"
              height="16"
            >
            </v-progress-linear>
            <ATATSVGIcon name="close" color="base" :width="11" />
          </div>
        </div>
      </div>
    </v-card>
    <!-- <div v-if="files.length > 0">
      <h2 class="mt-5">Your uploads</h2>
      <ul v-for="(file, idx) of files" :key="idx">
        <li v-if="indexToDisplay >= idx || !isLoading">
          {{ file.name }}
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

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
  @Prop({ default: "Your Upload"}) private fileLoadingDivTitle!: string;
  @Prop({ default: 0 }) private uploadingStatus!: number;
}
</script>
