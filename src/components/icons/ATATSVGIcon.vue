<template>
  <div :style="divStyle" class="_svg-icon">
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
import ArchitectureCircle from "@/components/icons/ArchitectureCircle.vue"
import Aws from "@/components/icons/Aws.vue";
import Azure from "@/components/icons/Azure.vue";
import BugReport from "@/components/icons/BugReport.vue";
import Bullet from "@/components/icons/Bullet.vue";
import Calendar from "@/components/icons/Calendar.vue";
import CheckedBag from "@/components/icons/CheckedBag.vue";
import ChevronDown from "@/components/icons/ChevronDown.vue";
import ChevronRight from "@/components/icons/ChevronRight.vue";
import Close from "@/components/icons/Close.vue";
import Cloud from "@/components/icons/Cloud.vue";
import CloudUpload from "@/components/icons/CloudUpload.vue";
import CommentBubble from "@/components/icons/CommentBubble.vue";
import ContactSupport from "@/components/icons/ContactSupport.vue";
import ContentCopy from "@/components/icons/ContentCopy.vue";
import ControlPoint from "@/components/icons/ControlPoint.vue";
import Currency from "@/components/icons/Currency.vue";
import CurrentFunctionsCircle from "@/components/icons/CurrentFunctionsCircle.vue"
import DisaLogo from "@/components/icons/DisaLogo.vue";
import Email from "@/components/icons/Email.vue";
import ErrorFilled from "@/components/icons/ErrorFilled.vue";
import ExternalLink from "@/components/icons/ExternalLink.vue";
import ExclamationMark from "@/components/icons/ExclamationMark.vue";
import Edit from "@/components/icons/Edit.vue";
import Failed from "@/components/icons/Failed.vue";
import Filters from "@/components/icons/Filters.vue";
import Feedback from "@/components/icons/Feedback.vue";
import FilePresent from "@/components/icons/FilePresent.vue";
import FileSignature from "@/components/icons/FileSignature.vue";
import Gcp from "@/components/icons/Gcp.vue";
import InfoOutline from "@/components/icons/InfoOutline.vue";
import Launch from "@/components/icons/Launch.vue";
import ManageAccount from "@/components/icons/ManageAccount.vue";
import MenuBook from "@/components/icons/MenuBook.vue";
import MonetizationOn from "@/components/icons/MonetizationOn.vue";
import OptionPending from "@/components/icons/OptionPending.vue";
import Oracle from "@/components/icons/Oracle.vue";
import Pdf from "@/components/icons/Pdf.vue";
import Person from "@/components/icons/Person.vue";
import PersonAdd from "@/components/icons/PersonAdd.vue";
import PersonAddAlt from "@/components/icons/PersonAddAlt.vue";
import Phone from "@/components/icons/Phone.vue";
import PlusSign from "@/components/icons/PlusSign.vue";
import Processing from "@/components/icons/Processing.vue";
import Provisioned from "@/components/icons/Provisioned.vue";
import Role from "@/components/icons/Role.vue";
import Remove from "@/components/icons/Remove.vue";
import Restore from "@/components/icons/Restore.vue";
import RequestQuote from "@/components/icons/RequestQuote.vue";
import Search from "@/components/icons/Search.vue";
import Service from "@/components/icons/Service.vue";
import SignOut from "@/components/icons/SignOut.vue";
import Support from "@/components/icons/Support.vue";
import SupportCircle from "@/components/icons/SupportCircle.vue";
import Star from "@/components/icons/Star.vue";
import StarInTriangle from "@/components/icons/StarInTriangle.vue";
import TaskAlt from "@/components/icons/TaskAlt.vue";
import TrendingDown from "@/components/icons/TrendingDown.vue";
import TrendingUp from "@/components/icons/TrendingUp.vue";
import TriangleUp from "@/components/icons/TriangleUp.vue";
import TriangleDown from "@/components/icons/TriangleDown.vue";
import UnderReview from "@/components/icons/UnderReview.vue";
import UploadFile from "@/components/icons/UploadFile.vue";
import Warning from "@/components/icons/Warning.vue";
import WarningAmber from "@/components/icons/WarningAmber.vue";
import ReadyToGeneratePackage from "@/components/icons/ReadyToGeneratePackage.vue";
import Place from "@/components/icons/Place.vue";
import SendEmail from "@/components/icons/SendEmail.vue";
import People from "@/components/icons/People.vue";
import HelpOutline from "@/components/icons/HelpOutline.vue";
import ProvisionOracle from "@/components/icons/ProvisionOracle.vue";
import ProvisionAWS from "@/components/icons/ProvisionAWS.vue";
import ProvisionAzure from "@/components/icons/ProvisionAzure.vue";
import ProvisionGCP from "@/components/icons/ProvisionGCP.vue";
import XaasCircle from "@/components/icons/XaasCircle.vue"
import Update from "@/components/icons/Update.vue";
import Download from "@/components/icons/Download.vue";
import CertifiedDocumentsForTransferringFunds
  from "@/components/icons/CertifiedDocumentsForTransferringFunds.vue";
import OtherCommonDocumentation from "@/components/icons/OtherCommonDocumentation.vue";
import CloudManagementOfficeAuthorization
  from "@/components/icons/CloudManagementOfficeAuthorization.vue";
import ContactInformation from "@/components/icons/ContactInformation.vue";
import JWCCPricingCalculator from "@/components/icons/JWCCPricingCalculator.vue";
import PeriodOfPerformance from "@/components/icons/PeriodOfPerformance.vue";


@Component({
  components: {
    ArrowBack,
    ArchitectureCircle,
    Aws,
    Azure,
    BugReport,
    Bullet,
    Calendar,
    CertifiedDocumentsForTransferringFunds,
    CheckedBag,
    ChevronDown,
    ChevronRight,
    Close,
    Cloud,
    CloudUpload,
    CloudManagementOfficeAuthorization,
    CommentBubble,
    ContactSupport,
    ContactInformation,
    ContentCopy,
    ControlPoint,
    Currency,
    CurrentFunctionsCircle,
    DisaLogo,
    Download,
    Edit,
    Email,
    ErrorFilled,
    ExclamationMark,
    ExternalLink,
    Failed,
    Filters,
    Feedback,
    FilePresent,
    FileSignature,
    Gcp,
    HelpOutline,
    InfoOutline,
    JWCCPricingCalculator,
    Launch,
    ManageAccount,
    MenuBook,
    MonetizationOn,
    OptionPending,
    Oracle,
    OtherCommonDocumentation,
    Pdf,
    People,
    Person,
    PersonAdd,
    PersonAddAlt,
    PeriodOfPerformance,
    Phone,
    PlusSign,
    Processing,
    ProvisionAWS,
    ProvisionAzure,
    Provisioned,
    ProvisionGCP,
    ProvisionOracle,
    RequestQuote,
    Role,
    Remove,
    Restore,
    Search,
    SendEmail,
    Service,
    SignOut,
    Star,
    StarInTriangle,
    Support,
    SupportCircle,
    TaskAlt,
    TriangleUp,
    TriangleDown,
    TrendingDown,
    TrendingUp,
    UnderReview,
    UploadFile,
    Update,
    Warning,
    WarningAmber,
    ReadyToGeneratePackage,
    Place,
    XaasCircle,
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
    { "info-dark":"0076A6" },
    { "success": "62bd59" },
    { "success-dark": "498e43" },    
    { "error": "c60634" },
    { "disabled": "c9c9c9" },
    { "disabled-dark": "adadad"},
    { "white": "ffffff" },
    { "warning-dark2": "e9a514" },
  ]

  private mounted(): void{
    this.setDivStyle();
  }

}
</script>
