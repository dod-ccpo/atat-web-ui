<template>
  <div :style="divStyle">
    <component :is="name" 
      :color="getColor()" 
      :height="_height" 
      :width="_width"
    />
  </div>
</template>

<script lang='ts'>
import {stringObj } from "types/Global";
import Vue from "vue";

import { Component, Prop, PropSync } from "vue-property-decorator";
import Pdf from "@/components/icons/Pdf.vue";
import UploadFile from "@/components/icons/UploadFile.vue";
import Close from "@/components/icons/Close.vue";

@Component({
  components:{
    Pdf,
    UploadFile,
    Close
  }
})

export default class ATATSVGIcon extends Vue {
  // props
  @Prop({default: "base"}) private color!: string; // DISA Base
  @PropSync("width", {default: 0}) private _width!: number;
  @PropSync("height",{default: 0}) private _height!: number;
  @Prop({default: "", required: true}) private name!: string;
  
  get divStyle(): string{
    return "width: " + this._width + "px;" +
            "height: " + this._height + "px;" +
            "line-height: 0px";
  }
  
  private getColor(): string {
    return (this.standardColors.find((sc)=> sc[this.color]) as stringObj)[this.color];
  }

  private standardColors: stringObj[] = [
    { "base":  "61686c" },
    { "base-dark": "41494e"},
    { "primary": "544496" },
    { "info": "009ddd" },
    { "success": "62bd59" },
    { "error": "c60634" },
    { "disabled": "c9c9c9" }
  ]

  private mounted(): void{

    // in case only one prop is passed
    // assume the icon is proportional and 
    // assign same value to both height/width
    this._height = this._height > 0 ? this._height : this._width;
    this._width = this._width > 0 ? this._width : this._height;
  }

}
</script>
