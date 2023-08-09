<template>
  <div class=" _feedback-form">
    <div class="flex-column">
      <div
        class="_feedback-tab"
        id="FeedbackTab"
         :class="[
           {'_open':open},
           {'_show-form':showForm},
           {'_thank-you':showThankYou}
           ]"
      >
        <v-btn
        rounded
        @click="toggle()"
        @keydown.enter="toggle()"
        @keydown.space="toggle()"
        :class="{'_open':open}"
        >
          <span class="text-base">
            Customer Feedback
          </span>
          <ATATSVGIcon
            name="chevronDown"
            color="base"
            class=" _toggle mx-2"
            :class="{'_open':open}"
            width="10"
            height="6"
          />
        </v-btn>
      </div>
      <div
        class="_feedback-body"
        :class="[{'_thank-you':showThankYou}]"
        v-if="open">
        <v-expand-transition>
          <div>
            <div v-if="!hideIcons">
              <h3 class="text-base-dark font-weight-500 mb-4">
                How was your experience with DAPPS?
              </h3>
              <div class="d-flex flex-row justify-space-between mb-5">
                <div class="mx-1">
                  <v-btn
                    id="veryDissatisfied"
                    icon
                    @click="setFeedbackMood(1)"
                    @keydown.enter="setFeedbackMood(1)"
                    @keydown.space="setFeedbackMood(1)"
                    @mouseenter="showMessage('bad')"
                    @mouseleave="hideMessage()"
                  >
                    <ATATSVGIcon
                      name="veryDissatisfied"
                      color="primary"
                      class="_feedback-icon"
                      width="60"
                      height="60"
                    />
                  </v-btn>
                </div>
                <div class="mx-1">
                  <v-btn
                    id="dissatisfied"
                    icon
                    @click="setFeedbackMood(2)"
                    @keydown.enter="setFeedbackMood(2)"
                    @keydown.space="setFeedbackMood(2)"
                    @mouseenter="showMessage('poor')"
                    @mouseleave="hideMessage()"
                  >
                    <ATATSVGIcon
                      name="dissatisfied"
                      color="primary"
                      class="_feedback-icon"
                      width="60"
                      height="60"
                    />
                  </v-btn>
                </div>
                <div class="mx-1">
                  <v-btn
                    id="neutral"
                    icon
                    @click="setFeedbackMood(3)"
                    @keydown.enter="setFeedbackMood(3)"
                    @keydown.space="setFeedbackMood(3)"
                    @mouseenter="showMessage('fair')"
                    @mouseleave="hideMessage()"
                  >
                    <ATATSVGIcon
                      name="neutral"
                      color="primary"
                      class="_feedback-icon"
                      width="60"
                      height="60"
                    />
                  </v-btn>
                </div>
                <div class="mx-1">
                  <v-btn
                    id="satisfied"
                    icon
                    @click="setFeedbackMood(4)"
                    @keydown.enter="setFeedbackMood(4)"
                    @keydown.space="setFeedbackMood(4)"
                    @mouseenter="showMessage('good')"
                    @mouseleave="hideMessage()"
                  >
                    <ATATSVGIcon
                      name="satisfied"
                      color="primary"
                      class="_feedback-icon"
                      width="60"
                      height="60"
                    />
                  </v-btn>
                </div>
                <div class="mx-1">
                  <v-btn
                    id="verySatisfied"
                    icon
                    @click="setFeedbackMood(5)"
                    @keydown.enter="setFeedbackMood(5)"
                    @keydown.space="setFeedbackMood(5)"
                    @mouseenter="showMessage('excellent')"
                    @mouseleave="hideMessage()"
                  >
                    <ATATSVGIcon
                      name="verySatisfied"
                      color="primary"
                      class=" _feedback-icon"
                      width="60"
                      height="60"
                    />
                  </v-btn>
                </div>
              </div>
              <div class="d-flex justify-center">
                <span class="_experience-text">
                  {{experience}}
                </span>
              </div>
            </div>
            <div v-if="showForm">
              <div v-if="!showThankYou">
                <h2 class="mb-3">
                  {{checkboxHeading}}
                </h2>
                <ATATCheckboxGroup
                  v-if="this.DAPPSExperience > 3"
                  id="CustomerFeedback"
                  :value.sync="selectedFeedbackOptions"
                  :items="positiveFeedbackOptions"
                  class="copy-max-width mb-10"
                />
                <ATATCheckboxGroup
                  v-if="this.DAPPSExperience <= 3"
                  id="CustomerFeedback"
                  :value.sync="selectedFeedbackOptions"
                  :items="negativeFeedbackOptions"
                  class="copy-max-width mb-10"
                />
                <p class="mb-2">Other, please specify </p>
                <ATATTextArea
                  id="otherFeedback"
                  class="width-100 mb-10"
                  :rows="3"
                  :value.sync="otherFeedbackValue"
                />
                <v-btn
                  class="primary ml-auto"
                  id="verySatisfied"
                  @click="sendFeedback()"
                  @keydown.enter="sendFeedback()"
                  @keydown.space="sendFeedback()"
                >
                  Send feedback
                </v-btn>
              </div>
              <div v-else>
                <div class="text-center">
                  <ATATSVGIcon width="360" height="192" name="FeedbackThankYou" class="mr-0"/>
                  <div class="d-flex flex-column">
                    <p> We value your opinion and will keep working to improve your experience.</p>
                    <v-btn
                      class="secondary mx-auto"
                      @click="dismiss"
                      @keydown.enter="dismiss"
                      @keydown.space="dismiss"
                    >
                      Dismiss
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */

import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import acquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { Checkbox } from "../../types/Global";
import { CustomerFeedbackDTO, FeedbackOptionsDTO } from "@/api/models";
import ATATCheckboxGroup from "./ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import User, { UserStore } from "@/store/user";
import { scrollToId } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
    ATATSVGIcon,
    ATATCheckboxGroup
  }
})

export default class ATATFeedbackForm extends Vue {
  private open = true
  private showThankYou = false
  private hideIcons = false
  private showForm = false
  private positiveFeedbackOptions:Checkbox[] = []
  private negativeFeedbackOptions:Checkbox[] = []
  private DAPPSExperience = 0
  private otherFeedbackValue = ""
  private experience = ""
  private selectedFeedbackOptions:string[] = []
  private feedbackID = ""

  public toggle():void{
    this.open = !this.open
    this.hideIcons = !this.hideIcons
  }

  private setFeedbackMood(value:number):void {
    this.DAPPSExperience = value
    this.hideIcons = true
    this.showForm = true
    scrollToId("LoadingDialog")
  }

  private get checkboxHeading():string {
    if(this.DAPPSExperience){
      if(this.DAPPSExperience > 3){
        return "We’re thrilled you feel that way! Please tell us why:"
      }else{
        return "What could have been better?"
      }
    }
    return ""
  }
  public dismiss():void {
    this.open = false
    this.showForm = false
    this.showThankYou = false
  }
  public createCheckboxes(option:FeedbackOptionsDTO){
    const checkboxItem:Checkbox = {
      value: option.sys_id as string,
      label: option.option,
      id: option.option
    }
    if(option.is_feedback_positive === "true"){
      this.positiveFeedbackOptions.push(checkboxItem)
    }else{
      this.negativeFeedbackOptions.push(checkboxItem)
    }
  }


  public showMessage(value:string) {
    this.experience =  `My experience was ${value}`
  }
  public hideMessage() {
    this.experience = ""
  }


  public get currentData(): CustomerFeedbackDTO {

    return {
      acquisition_package: acquisitionPackage.packageId,
      dapps_experience: this.DAPPSExperience,
      feedback_items: this.selectedFeedbackOptions.join(','),
      feedback_items_other: this.otherFeedbackValue,
      user_sys_id: User.currentUser.sys_id as string,
      is_complete: "true",
      sys_id: this.feedbackSysId
    }
  }

  @Watch('DAPPSExperience')
  public DappsExperienceChange(): void {
    this.selectedFeedbackOptions = [];
    this.otherFeedbackValue = "";
  }


  public get feedbackSysId():string{
    return AcquisitionPackage.customerFeedback?.sys_id as string
  }

  public savedData:CustomerFeedbackDTO = {} as CustomerFeedbackDTO

  private async sendFeedback(): Promise<void> {
    try {
      await AcquisitionPackage.saveFeedback(this.currentData);
      this.showThankYou = true
    } catch (error) {
      console.log(error);
    }
  }

  private async loadOnEnter(): Promise<void> {
    const feedbackOptions = AcquisitionPackage.feedbackOptions
    if(feedbackOptions){
      feedbackOptions.forEach(value => {
        this.createCheckboxes(value)
      })
    }
    const storeData = AcquisitionPackage.customerFeedback
    if(storeData?.acquisition_package){
      if(storeData.user_sys_id !== User.currentUser.sys_id
      ||storeData?.is_complete === "true"){
        this.open = false
        this.hideIcons = true
      }
      this.feedbackID = storeData.sys_id as string
      this.DAPPSExperience = Number(storeData.dapps_experience)
      this.selectedFeedbackOptions = storeData.feedback_items.split(',')
      this.otherFeedbackValue = storeData.feedback_items_other
      this.savedData = storeData
    }

  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
