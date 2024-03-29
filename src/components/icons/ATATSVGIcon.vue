<template>
  <div
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    :style="divStyle"
    class="_svg-icon">
    <component :is="name"
               :color="getColor()"
               :height="height"
               :width="width"
    />
  </div>
</template>

<script lang='ts'>
import {stringObj } from "types/Global";
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ArrowBack from "@/components/icons/ArrowBack.vue";
import ArchitectureCircle from "@/components/icons/ArchitectureCircle.vue"
import Aws from "@/components/icons/Aws.vue";
import Azure from "@/components/icons/Azure.vue";
import BugReport from "@/components/icons/BugReport.vue";
import Bullet from "@/components/icons/Bullet.vue";
import Calendar from "@/components/icons/Calendar.vue";
import CheckedBag from "@/components/icons/CheckedBag.vue";
import CheckCircle from "@/components/icons/CheckCircle.vue";
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
import ProvisioningIssue from "@/components/icons/ProvisioningIssue.vue"
import Role from "@/components/icons/Role.vue";
import Remove from "@/components/icons/Remove.vue";
import RemoveCircle from "@/components/icons/RemoveCircle.vue"
import Restore from "@/components/icons/Restore.vue";
import RequestQuote from "@/components/icons/RequestQuote.vue";
import Search from "@/components/icons/Search.vue";
import Service from "@/components/icons/Service.vue";
import SignOut from "@/components/icons/SignOut.vue";
import Support from "@/components/icons/Support.vue";
import SupportCircle from "@/components/icons/SupportCircle.vue";
import Star from "@/components/icons/Star.vue";
import StarInTriangle from "@/components/icons/StarInTriangle.vue";
import StartProvisioning from "@/components/icons/StartProvisioning.vue"
import SwapVertical from "@/components/icons/SwapVertical.vue";
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
import DynamicForm from "@/components/icons/DynamicForm.vue";
import CertifiedDocumentsForTransferringFunds
  from "@/components/icons/CertifiedDocumentsForTransferringFunds.vue";
import OtherCommonDocumentation from "@/components/icons/OtherCommonDocumentation.vue";
import CloudManagementOfficeAuthorization
  from "@/components/icons/CloudManagementOfficeAuthorization.vue";
import ContactInformation from "@/components/icons/ContactInformation.vue";
import JWCCPricingCalculator from "@/components/icons/JWCCPricingCalculator.vue";
import PeriodOfPerformance from "@/components/icons/PeriodOfPerformance.vue";
import Satisfied from "./Satisfied.vue";
import Dissatisfied from "./Dissatisfied.vue";
import Neutral from "@/components/icons/Neutral.vue";
import VerySatisfied from "@/components/icons/VerySatisfied.vue";
import VeryDissatisfied from "@/components/icons/VeryDissatisfied.vue";
import FeedbackThankYou from "@/components/icons/FeedbackThankYou.vue";
import Article from "@/components/icons/Article.vue";
import HomeWork from "@/components/icons/HomeWork.vue";


@Component({
  emits:[
    "mouseenter",
    "mouseleave"
  ],
  components: {
    ArchitectureCircle,
    ArrowBack,
    Article,
    Aws,
    Azure,
    BugReport,
    Bullet,
    Calendar,
    CertifiedDocumentsForTransferringFunds,
    CheckedBag,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Close,
    Cloud,
    CloudManagementOfficeAuthorization,
    CloudUpload,
    CommentBubble,
    ContactInformation,
    ContactSupport,
    ContentCopy,
    ControlPoint,
    Currency,
    CurrentFunctionsCircle,
    DisaLogo,
    Dissatisfied,
    Download,
    DynamicForm,
    Edit,
    Email,
    ErrorFilled,
    ExclamationMark,
    ExternalLink,
    Failed,
    Feedback,
    FeedbackThankYou,
    FilePresent,
    FileSignature,
    Filters,
    Gcp,
    HomeWork,
    HelpOutline,
    InfoOutline,
    JWCCPricingCalculator,
    Launch,
    ManageAccount,
    MenuBook,
    MonetizationOn,
    Neutral,
    OptionPending,
    Oracle,
    OtherCommonDocumentation,
    Pdf,
    People,
    PeriodOfPerformance,
    Person,
    PersonAdd,
    PersonAddAlt,
    Phone,
    Place,
    PlusSign,
    Processing,
    ProvisionAWS,
    ProvisionAzure,
    Provisioned,
    ProvisionGCP,
    ProvisionOracle,
    ProvisioningIssue,
    ReadyToGeneratePackage,
    Remove,
    RemoveCircle,
    RequestQuote,
    Restore,
    Role,
    Satisfied,
    Search,
    SendEmail,
    Service,
    SignOut,
    Star,
    StarInTriangle,
    StartProvisioning,
    Support,
    SupportCircle,
    SwapVertical,
    TaskAlt,
    TrendingDown,
    TrendingUp,
    TriangleDown,
    TriangleUp,
    UnderReview,
    Update,
    UploadFile,
    VeryDissatisfied,
    VerySatisfied,
    Warning,
    WarningAmber,
    XaasCircle,
  }
})

class ATATSVGIcon extends Vue {
  // props
  @Prop({ required: false }) private color?: string;
  @Prop({default: 0, required: true}) private width!: number;
  @Prop({default: 0, required: true}) private height!: number;
  @Prop({default: "", required: true}) private name!: string;


  private get divStyle(): string {
    return "width: " + this.width + "px;" +
      "height: " + this.height + "px;" +
      "line-height: 0px";

  }

  public mouseEnter():void {
    this.$emit("mouseenter")
  }
  public mouseLeave():void {
    this.$emit("mouseleave")
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
}
export default toNative(ATATSVGIcon)
</script>
