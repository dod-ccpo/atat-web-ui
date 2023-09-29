<template>
  <div>
    <div id="SummaryItems"
         v-for="(item, index) in summaryItems"
         :key="index">
      <div class="container-max-width"
           :id="getIdText(item.title) + '_Wrapper'"
      >
        <div class=" d-flex justify-space-between">
          <div>
            <h3 class="mb-1"
                :id="getIdText(item.title) + '_Heading'">
              {{ item.title }}
            </h3>
            <p class="mb-0" :id="getIdText(item.title) + '_Description'"
               v-html="item.description">
            </p>
            <ATATExpandableLink v-if="item.showMoreData && item.isTouched"
                                :contentAtTop="true"
                                aria-id="Instructions">
              <template v-slot:header>
                Show more
              </template>
              <template v-slot:content>
                <div class="d-flex">
                  <div>
                    <div v-if="item.showMoreData.address" class="d-flex align-start my-3">
                      <ATATSVGIcon
                        width="20"
                        height="20"
                        name="place"
                        color="base-light"/>
                      <span
                        class="text-base ml-2"
                        :class="[{'text-error': checkMissing(item.showMoreData.address)}]">
                          {{item.showMoreData.address}}
                  </span>
                    </div>
                    <div v-if="item.showMoreData.email" class="d-flex align-center my-3">
                      <ATATSVGIcon
                        width="20"
                        height="20"
                        name="email"
                        color="base-light"/>
                      <span
                        :class="[{'text-error': checkMissing(item.showMoreData.email)}]"
                        class="text-base ml-2">
                          {{item.showMoreData.email}}
                  </span>
                    </div>
                    <div v-if="item.showMoreData.phone" class="d-flex align-center mb-3">
                      <ATATSVGIcon
                        width="20"
                        height="20"
                        name="phone"
                        color="base-light"/>
                      <span
                        :class="[{'text-error': checkMissing(item.showMoreData.phone)}]"
                        class="text-base ml-2">
                          {{item.showMoreData.phone}}
                  </span>
                    </div>
                    <div v-if="item.showMoreData.cloud && item.showMoreData.cloud.length > 0"
                         class="mb-3 mt-2 ">
                      <div class="d-flex align-center" style="min-width:200px">
                        <ATATSVGIcon
                          width="21"
                          height="14"
                          name="cloud"
                          color="base-light"/>
                        <span
                          class="text-base-light ml-2 font-size-12 font-weight-700 no-wrap">
                          CLOUD INSTANCES
                      </span>
                      </div>
                      <div>
                        <span
                          class="d-flex flex-column font-size-14 ml-7"
                          v-for="(value, idx) in item.showMoreData.cloud"
                          :key="idx"
                        >
                          {{value[1]}} - {{value[0]}}
                        </span>
                      </div>
                    </div>
                    <div v-if="item.showMoreData.onPrem && item.showMoreData.onPrem.length > 0
                    && item.showMoreData.cloud && !item.showMoreData.cloud.length > 0"
                         class="mb-3 mt-2"
                         style="min-width:200px"
                    >
                      <div class="d-flex align-center">
                        <ATATSVGIcon
                          width="20"
                          height="16"
                          name="homeWork"
                          color="base-light"/>
                        <span
                          class="text-base-light ml-2 font-size-12 font-weight-700">
                          ON-PREMISE INSTANCES
                      </span>
                      </div>
                      <div>
                        <span
                          class="d-flex flex-column font-size-14 ml-7"
                          v-for="(value, idx) in item.showMoreData.onPrem"
                          :key="idx"
                        >
                          {{value[1]}} - {{value[0]}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="ml-10">
                    <div v-if="item.showMoreData.dodaac"
                         class="d-flex align-center my-3 no-wrap">
                      <ATATSVGIcon
                        width="20"
                        height="20"
                        name="service"
                        color="base-light"/>
                      <span
                        :class="[{'text-error': checkMissing(item.showMoreData.dodaac)}]"
                        class="text-base ml-2">
                        {{item.showMoreData.dodaac}}
                  </span>
                    </div>
                    <div
                      v-if="item.showMoreData.title && item.substep !== 4"
                      class="d-flex align-center my-3">
                      <ATATSVGIcon
                        width="20"
                        height="20"
                        name="role"
                        color="base-light"/>
                      <span
                        :class="[{'text-error': checkMissing(item.showMoreData.title)}]"
                        class="text-base ml-2">
                          {{item.showMoreData.title}}
                      </span>
                    </div>
                    <div v-if="item.showMoreData.onPrem && item.showMoreData.onPrem.length > 0
                    && item.showMoreData.cloud && item.showMoreData.cloud.length > 0"
                         class="mb-3 mt-2 pl-2"
                    >
                      <div class="d-flex align-center">
                        <ATATSVGIcon
                          width="20"
                          height="16"
                          name="homeWork"
                          color="base-light"/>
                        <span
                          class="text-base-light ml-2 font-size-12 font-weight-700">
                          ON-PREMISE INSTANCES
                      </span>
                      </div>
                      <div>
                        <span
                          class="d-flex flex-column font-size-14 ml-7"
                          v-for="(value, idx) in item.showMoreData.onPrem"
                          :key="idx"
                        >
                          {{value[1]}} - {{value[0]}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </ATATExpandableLink>
            <v-btn
              id="AddAcorButton"
              v-if="item.ACORButton && !hasAcor"
              text
              class=" mt-5 no-border secondary"
              :ripple="false"
              @click="addAcor()"
              @keydown.enter="addAcor()"
              @keydown.space="addAcor()"
            >
              <v-icon color="primary" class="mr-2">control_point</v-icon>
              <span>Add an Alternate COR</span>
            </v-btn>
          </div>
          <div class="d-flex align-start">
            <div class="d-flex align-center">
              <div
                v-if="item.isTouched && !item.isComplete"
                :id="getIdText(item.title) + '_MissingInfoLabel'"
                class="d-flex align-start nowrap ml-5">
                <v-icon class="icon-20 text-warning-dark2 pr-2">warning</v-icon>
                <p class="_missing-info mb-0 pr-4 _semibold">Missing info</p>
              </div>
              <v-btn width="111"
                     :id="getButtonId(item)"
                     :class="[
                  item.isComplete ? 'secondary' : 'primary',
                ]"
                     @click="navigate(item.routeName)"
                     @keydown.enter="navigate(item.routeName)"
                     @keydown.space="navigate(item.routeName)">
                {{ getButtonText(item)  }}
              </v-btn>
              <v-btn
                v-if="item.hasDelete"
                icon
                :id="getIdText(item.title) + '_Delete'"
                class="d-flex nowrap ml-5"
                @click="showAcorModal()">
                <v-icon class="icon-20 pr-2">delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <hr v-if="index < summaryItems.length - 1" />
      </div>
    </div>
    <ATATDialog
      id="RemoveMemberModal"
      :showDialog="showRemoveAcor"
      :title="'Remove ' + ACORName +' ?'"
      no-click-animation
      okText="Delete ACOR"
      width="450"
      @ok="removeAcor"
      @cancelClicked="cancelRemoveMember"
    >
      <template #content>
        <p class="body">
          This individual will be removed from your acquisition package overview.
          Any details about this ACOR will not be saved.
        </p>
      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
import { getIdText } from "@/helpers";
import { routeNames } from "@/router/stepper";
import { SummaryItem } from "types/Global";
import Vue from "vue";
import { Component, Prop} from "vue-facing-decorator;
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATDialog from "@/components/ATATDialog.vue";
import { SummaryStore } from "@/store/summary";

@Component({
  components: {
    ATATSVGIcon,
    ATATExpandableLink,
    ATATDialog,
  }
})
export default class ATATSummaryItem extends Vue {
  @Prop({default: "SummaryItems"}) private summaryItems!: SummaryItem[] | [];

  public getIdText(id: string): string{
    return getIdText(id);
  }
  public showMore = false
  public showRemoveAcor = false
  public get showMoreText():string {
    return this.showMore?"Show less":"Show more"
  }
  public showAcorModal(): void {
    this.showRemoveAcor = true;
  }
  public get ACORName():string {
    return `${AcquisitionPackage.acorInfo?.first_name}  ${AcquisitionPackage.acorInfo?.last_name}`
      || "undefined"
  }
  public get hasAcor():boolean {
    return AcquisitionPackage.hasAlternativeContactRep || false
  }
  public cancelRemoveMember(): void {
    this.showRemoveAcor = false
  }
  public async removeAcor(): Promise<void> {
    await AcquisitionPackage.removeACORInformation()
    await AcquisitionPackage.setHasAlternateCOR(false)
    const ACORIdx = this.summaryItems.findIndex(item => item.step === 1 && item.substep === 5)
    this.summaryItems.splice(ACORIdx, 1)
    // this.$emit("deleteAcor");
    this.showRemoveAcor = false
  }

  public addAcor():void {
    AcquisitionPackage.setHasAlternateCOR(true)
    this.navigate("AcorInformation")
  }
  public getButtonId(item:SummaryItem): string {
    let buttonClass = "";
    if (item.isComplete){
      buttonClass = "_CompleteButton"
    } else if (item.isTouched) {
      buttonClass = "_MissingInfoButton"
    } else if (!item.isTouched && !item.isComplete){
      buttonClass = "_StartButton"
    }
    return this.getIdText(item.title) + buttonClass
  }
  public checkMissing(item:string):boolean {
    return item.split(" ").includes("Missing")
  }

  public async navigate(routeName: string): Promise<void>{
    const dynamicKey = routeName as keyof unknown;
    this.$router.push({
      name: routeNames[dynamicKey],
      params: {
        direction: "next"
      },
    })
  }

  public getButtonText(item:SummaryItem):string{
    return !item.isTouched
      ? "Start"
      : item.isComplete ? 'View/Edit' : 'Review'
  }

}
</script>
