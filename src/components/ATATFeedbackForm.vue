<template>
  <v-expand-transition>
    <div v-if="!hide">
      <div class="_feedback-form">
        <div class="flex-column">
          <div class="d-flex justify-end">
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
                @click="toggle()"
                @keydown.enter="toggle()"
                @keydown.space="toggle()"
                class="px-3"
                :class="{'_open':open}"
              >
                <span class="text-base">
                  CUSTOMER FEEDBACK
                </span>
                <ATATSVGIcon
                  name="chevronDown"
                  color="base"
                  class="_toggle ml-4"
                  :class="{'_open':open}"
                  width="14"
                  height="10"
                />
              </v-btn>
            </div>
          </div>
          <v-expand-transition>
            <div v-if="open">
              <div
                class="_feedback-body"
                :class="[{'_thank-you':showThankYou}]"
                v-if="open">
                  <v-expand-transition>
                    <div v-if="!hideIcons">
                      <h2 class="text-base-dark mb-4">
                        How was your experience with DAPPS?
                      </h2>
                      <div class="d-flex flex-row justify-space-between mb-5">
                        <div class=" _mood-div">
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
                        <div class=" _mood-div">
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
                        <div class=" _mood-div">
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
                        <div class=" _mood-div">
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
                        <div class=" _mood-div">
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
                        <span
                          class="_experience-text"
                          id="ExperienceText"
                        >
                          {{experience}}
                        </span>
                      </div>
                    </div>
                    <div v-show="showForm">
                      <v-expand-transition>
                        <div v-if="!showThankYou">
                          <h2
                            id="CheckboxHeading"
                            class="mb-3">
                            {{checkboxHeading}}
                          </h2>
                          <ATATCheckboxGroup
                            v-if="DAPPSExperience > 3"
                            id="CustomerFeedback0"
                            :value="selectedFeedbackOptions"
                            @update:value="selectedFeedbackOptions = $event"
                            :items="positiveFeedbackOptions"
                            class="copy-max-width mb-10"
                          />
                          <ATATCheckboxGroup
                            v-if="DAPPSExperience <= 3"
                            id="CustomerFeedback1"
                            :value="selectedFeedbackOptions"
                            @update:value="selectedFeedbackOptions = $event"
                            :items="negativeFeedbackOptions"
                            class="copy-max-width mb-10"
                          />
                          <p class="mb-2">Other, please specify </p>
                          <ATATTextArea
                            id="otherFeedback2"
                            class="width-100 mb-10"
                            :rows="3"
                            :value="otherFeedbackValue"
                            @update:value="otherFeedbackValue = $event"
                          />
                          <v-btn
                            class="_primary ml-auto"
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
                            <v-img
                              eager
                              max-width="360"
                              max-height="192"
                              src="img/Feedback_sent_animation.gif"
                            ></v-img>
                            <div class="d-flex flex-column mt-2">
                              <p id="ThankYouP">
                                We value your opinion and will keep working to improve your
                                experience.
                              </p>
                              <v-btn
                                id="Dismiss"
                                class="_secondary mx-auto"
                                @click="dismiss"
                                @keydown.enter="dismiss"
                                @keydown.space="dismiss"
                              >
                                Dismiss
                              </v-btn>
                            </div>
                          </div>
                        </div>
                      </v-expand-transition>
                    </div>
                  </v-expand-transition>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>
    </div>
  </v-expand-transition>
</template>

<script lang="ts">
/* eslint-disable camelcase */

import {Vue,Component, Watch, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import acquisitionPackage from "@/store/acquisitionPackage";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { Checkbox } from "../../types/Global";
import { CustomerFeedbackDTO, FeedbackOptionsDTO } from "@/api/models";
import ATATCheckboxGroup from "./ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import User from "@/store/user";
import { scrollToId } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
    ATATSVGIcon,
    ATATCheckboxGroup
  }
})
class ATATFeedbackForm extends Vue {
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
  public hide = false;

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
    this.hide = true
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
      setTimeout(() =>{
        this.dismiss()
      },8000)
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
      this.hide = true
    }

  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
export default toNative(ATATFeedbackForm)
</script>
