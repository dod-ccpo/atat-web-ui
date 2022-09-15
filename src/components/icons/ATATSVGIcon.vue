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
import ArrowBack from "@/components/icons/ArrowBack.vue";
import Aws from "@/components/icons/Aws.vue";
import Azure from "@/components/icons/Azure.vue";
import Calendar from "@/components/icons/Calendar.vue";
import ChevronDown from "@/components/icons/ChevronDown.vue";
import ChevronRight from "@/components/icons/ChevronRight.vue";
import Close from "@/components/icons/Close.vue";
import ContactSupport from "@/components/icons/ContactSupport.vue";
import ControlPoint from "@/components/icons/ControlPoint.vue";
import Currency from "@/components/icons/Currency.vue";
import DisaLogo from "@/components/icons/DisaLogo.vue";
import Email from "@/components/icons/Email.vue";
import ExternalLink from "@/components/icons/ExternalLink.vue";
import ExclamationMark from "@/components/icons/ExclamationMark.vue";
import Edit from "@/components/icons/Edit.vue";
import Feedback from "@/components/icons/Feedback.vue";
import FilePresent from "@/components/icons/FilePresent.vue";
import Gcp from "@/components/icons/Gcp.vue";
import InfoOutline from "@/components/icons/InfoOutline.vue";
import Launch from "@/components/icons/Launch.vue";
import MonetizationOn from "@/components/icons/MonetizationOn.vue";
import Oracle from "@/components/icons/Oracle.vue";
import Pdf from "@/components/icons/Pdf.vue";
import Person from "@/components/icons/Person.vue";
import PersonAddAlt from "@/components/icons/PersonAddAlt.vue";
import Phone from "@/components/icons/Phone.vue";
import PlusSign from "@/components/icons/PlusSign.vue";
import Role from "@/components/icons/Role.vue";
import Remove from "@/components/icons/Remove.vue";
import Search from "@/components/icons/Search.vue";
import Service from "@/components/icons/Service.vue";
import SignOut from "@/components/icons/SignOut.vue";
import Support from "@/components/icons/Support.vue";
import TrendingDown from "@/components/icons/TrendingDown.vue";
import TrendingUp from "@/components/icons/TrendingUp.vue";
import UploadFile from "@/components/icons/UploadFile.vue";
import TriangleUp from "@/components/icons/TriangleUp.vue";
import TriangleDown from "@/components/icons/TriangleDown.vue";

@Component({
  components: {
    ArrowBack,
    Aws,
    Azure,
    Calendar,
    ChevronDown,
    ChevronRight,
    Close,
    ContactSupport,
    ControlPoint,
    Currency,
    DisaLogo,
    Edit,
    Email,
    ExclamationMark,
    ExternalLink,
    Feedback,
    FilePresent,
    Gcp,
    InfoOutline,
    Launch,
    MonetizationOn,
    Oracle,
    Pdf,
    Person,
    PersonAddAlt,
    Phone,
    PlusSign,
    Role,
    Remove,
    Search,
    Service,
    SignOut,
    Support,
    TriangleUp,
    TriangleDown,
    TrendingDown,
    TrendingUp,
    UploadFile,
  }
})

export default class ATATSVGIcon extends Vue {
  // props
  @Prop({ required: false }) private color?: string;
  @PropSync("width", {default: 0, required: true}) private _width!: number;
  @PropSync("height",{default: 0, required: true}) private _height!: number;
  @Prop({default: "", required: true}) private name!: string;
  
  private divStyle = "";

  private setDivStyle(): void {
    Vue.nextTick(()=>{
      this.divStyle =  "width: " + this._width + "px;" +
        "height: " + this._height + "px;" +
        "line-height: 0px";
    });
  }
  
  private getColor(): string {
    const colorName = this.color || "base-darkest";
    return (this.standardColors.find((sc)=> sc[colorName]) as stringObj)[colorName];
  }

  private standardColors: stringObj[] = [
    { "base":  "61686c" },
    { "base-dark": "41494e"},
    { "base-darkest" : "161b1e" },
    { "base-light": "959a9d"},
    { "primary": "544496" },
    { "info": "009ddd" },
    { "success": "62bd59" },
    { "success-dark": "498e43" },    
    { "error": "c60634" },
    { "disabled": "c9c9c9" },
    { "disabled-dark": "adadad"},
    { "white": "ffffff" },
    { "azure-blue": "0089D6" },
  ]

  private mounted(): void{
    this.setDivStyle();
  }

}
</script>
