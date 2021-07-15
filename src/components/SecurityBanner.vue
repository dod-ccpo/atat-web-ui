<template>
  <div class="w-100">
    <div
      class="
        atat-header
        classification-banner
        text-center
        white--text
        body-lg
        d-block
      "
    >
      <div>
        <span class="classification-banner__text">
          {{ getClassificationText }}
        </span>
        <span class="classification-banner__msg">
          - {{ classificationMsg }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

export interface ClassificationType {
  color: string;
  text: string;
}
export interface ClassificationTypeArray {
  [key: string]: ClassificationType;
}
@Component({})
export default class SecurityBanner extends Vue {
  private classificationTypes: ClassificationTypeArray = {
    U: {
      color: "#538200",
      text: "Unclassified",
    },
    C: {
      color: "red darken-1",
      text: "CLASSIFIED",
    },
    T: {
      color: "red darken-1",
      text: "TOP SECRET",
    },
  };

  @Prop({ default: "U" }) private classificationType = "U";
  @Prop({ default: "Official Use Only" }) private classificationMsg =
    "Official Use Only";

  get getClassificationColor(): string {
    return this.classificationTypes[this.classificationType].color;
  }
  get getClassificationText(): string {
    return this.classificationTypes[this.classificationType].text;
  }
}
</script>

<style scoped lang="scss">
.classification-banner,
.w-100 {
  width: 100% !important;
}
</style>
