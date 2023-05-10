<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s gather details about the duration of your task order
            </h1>
            <div class="copy-max-width">
              <p class="mb-10">
                Your Period of Performance (PoP) will begin based upon the
                execution date of your task order or on your requested start date,
                if applicable. It will extend through the length of the base
                period, plus any subsequent exercised option periods. In the fields below,
                specify the required length of time for each period.
                Add, duplicate or remove option periods as needed, not to exceed five calendar years
                total.
                <a
                  role="button"
                  id="PopLearnMore"
                  class="_text-link"
                  tabindex="0"
                  @click="openSlideoutPanel"
                  @keydown.enter="openSlideoutPanel"
                  @keydown.space="openSlideoutPanel">
                  Learn more about PoPs on the JWCC contract.
                </a>
              </p>
            </div>
            <ATATAlert 
              v-if="isFairOpportunityUrgent"
              id="UrgentFairOppAlert"
              class="copy-max-width mb-9"
              type="warning"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0">
                  <strong>Based on your exception to fair opportunity, we recommend that you 
                  enter a base period only.</strong> Option periods are not allowed in a 
                  Justification and Approval (J&A) document when “urgency” is cited as the 
                  exception, unless it is an interim contract due to a protest.
                </p>
              </template>
            </ATATAlert>

            <div class="mb-4 _semibold" style="padding-left: 101px">
              Period of Performance length
            </div>
            <div id="BaseAndOptionWrapper">
              <draggable
                v-model="optionPeriods"
                ghost-class="ghost"
              >
                  <div
                    v-for="(optionPeriod, index) in optionPeriods"
                    :key="getIdText(getOptionPeriodLabel(index))"
                    class="d-inline-block py-2 draggable"
                    :id="getIdText(getOptionPeriodLabel(index)) + 'Row'"
                    @click="preDrag($event, index)"
                    :data-index="index"
                  >
                    <div class="d-flex align-center">
                      <div class="d-flex">
                        <v-icon class="drag-icon">drag_indicator</v-icon>
                      </div>
                      <div
                        class="d-flex justify-end mr-4 font-size-14 _text-base"
                        style="width: 65px"
                      >
                        <span class="duration">{{ getOptionPeriodLabel(index) }}</span>
                      </div>
                      <div >
                        <ATATTextField
                          :id="getIdText(getOptionPeriodLabel(index)) + 'Duration'"
                          class="mr-4"
                          width="178"
                          :showErrorMessages="false"
                          @errorMessage = "setDurationErrorMessages($event, index)"
                          :value.sync="optionPeriods[index].duration"
                          type="number"
                          :rules="[
                            $validators.required(''),
                          ]"
                        />
                      </div>
                      <div>
                        <ATATSelect
                          :id="getIdText(getOptionPeriodLabel(index)) + 'Dropdown'"
                          :items="timePeriods"
                          width="178"
                          :showErrorMessages="false"
                          :selectedValue.sync="optionPeriods[index].unitOfTime"
                          @errorMessage = "setDurationErrorMessages($event, index)"
                          class="mr-4"
                        />
                      </div>
                      <div
                        :id="getIdText(getOptionPeriodLabel(index)) + 'Buttons'"
                        class="d-flex align-center"
                      >
                        <v-btn
                          icon
                          class="mr-1"
                          @click="copyOptionPeriod(index)"
                          :disabled="isOptionsMaxxedOut || hasErrors"
                          aria-label="Duplicate this option period"
                          :id="getIdText(getOptionPeriodLabel(index)) + 'Copy'"
                        >
                          <v-icon> content_copy </v-icon>
                        </v-btn>

                        <v-btn
                          icon
                          :disabled="optionPeriods.length === 1"
                          @click="deleteOptionPeriod(index)"
                          aria-label="Delete this option period"
                          :id="getIdText(getOptionPeriodLabel(index)) + 'Delete'"
                        >
                          <v-icon> delete </v-icon>
                        </v-btn>
                      </div>

                    </div>
                   
                    <ATATErrorValidation
                      :id="'Required' + index"
                      class="atat-text-field-error ml-16 pl-8"
                      v-if="durationErrorIndices.indexOf(index)>-1"
                      :errorMessages="[
                        `Please specify the length of your
                        ${getOptionPeriodLabelError(index)}.`
                        ]"
                    />

                    <ATATErrorValidation
                      :id="'MoreThanAYear' + index"
                      class="atat-text-field-error ml-14"
                      :errorMessages="[oneYearCheck(optionPeriods[index])]"
                      v-if="oneYearCheck(optionPeriods[index])"
                    />
                  </div>
              </draggable>
            </div>

            <v-btn
              id="AddOptionPeriodButton"
              v-if="totalPoPDuration < maxTotalPoPDuration"
              plain
              text
              class=" mt-5 link-button no-border"
              :ripple="false"
              @click="addOptionPeriod()"
            >
              <v-icon color="primary" class="mr-2">control_point</v-icon>
              <span>Add an option period</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div id="DragImg" class="drag-img" style="display: none">
        {{ optionPeriodClicked.duration }} {{ optionPeriodClicked.unitOfTime }}
      </div>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import draggable from "vuedraggable";
import Vue from "vue";

import ATATTextField from "@/components/ATATTextField.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import PopLearnMore from "./PopLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import { PoP, SelectData, SlideoutPanelContent } from "../../../types/Global";
import { getIdText } from "@/helpers";
import { PeriodDTO } from "@/api/models";
import Periods from "@/store/periods";
import {hasChanges} from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

const convertPoPToPeriod= (pop:PoP): PeriodDTO=>{

  return  {

    period_type: pop.order === 1 ? "BASE" : "OPTION",
    period_unit: pop.unitOfTime,
    period_unit_count: pop.duration?.toString() || "",
    option_order: pop.order.toString() || "",
    sys_id: pop.id || undefined
  }
}

@Component({
  components: {
    ATATTextField,
    ATATSelect,
    draggable,
    PopLearnMore,
    ATATErrorValidation,
    ATATAlert
  },
})
export default class PeriodOfPerformance extends Mixins(SaveOnLeave) {

  $refs!: {
    form : Vue & {
      validate: () => boolean;
    };
  };
  public maxTotalPoPDuration = 365 * 5;
  public durationErrorMessage = "Please provide a valid period length."
  public optionPeriodCount = 1;
  private removed: PeriodDTO[] = [];

  public optionPeriods: PoP[] = [
    {
      duration: null,
      unitOfTime: "",
      id: null,
      order: 1,
    },
  ];

  public durationErrorIndices: number[] = [];
  
  /**
   * returns if the fair opportunity selection is urgent(YES_FAR_16_505_B_2_I_A)
   */
  get isFairOpportunityUrgent(): boolean{
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity 
      === "YES_FAR_16_505_B_2_I_A";
  }

  public setDurationErrorMessages(errors: string[], idx: number): void {
    const optPeriod = this.optionPeriods[idx];
    const isErrored = !optPeriod.duration || optPeriod.unitOfTime === ''
    const existingIdx = this.durationErrorIndices.indexOf(idx);

    if (isErrored){
      if (existingIdx === -1){
        this.durationErrorIndices.push(idx)
      } 
    } else if (existingIdx > -1) {
      this.durationErrorIndices.splice(existingIdx, 1);
    }
  }

  public getDurationErrorMessages(idx: number): string {
    return this.durationErrorIndices.indexOf(idx)>-1
      ? this.durationErrorMessage
      : ""
  }


  @Watch("optionPeriods", {deep: true})
  protected optionPeriodsChange(): void {
    this.setTotalPoP();
    this.$nextTick(() => {
      if (this.optionPeriodCount !== this.optionPeriods.length) {
        this.optionPeriodCount = this.optionPeriods.length;

        //  reset drag listeners for rows since option periods count changed
        this.setDragEventListeners();
      }

      this.optionPeriods.forEach((period, index)=> {
        period.order = index + 1;
      })
    });
  }

  public totalPoPDuration = 0;
  public basePoPDuration = 0

  public selectedTimePeriod = "Year";
  public timePeriods: SelectData[] = [
    { text: "Year", value: "YEAR" },
    { text: "Month(s)", value: "MONTH" },
    { text: "Week(s)", value: "WEEK" },
    { text: "Day(s)", value: "DAY" },
  ];


  public oneYearCheck(period:PoP): string {
    if(period.duration){
      switch(period.unitOfTime) {
      case "YEAR":
        if(period.duration > 1) {
          return "The length of this period must be 1 year or less."
        }
        break;
      case "MONTH":
        if(period.duration > 12) {
          return "The length of this period must be 12 months or less."
        }
        break;
      case "WEEK":
        if(period.duration > 52) {
          return "The length of this period must be 52 weeks or less."
        }
        break;
      case "DAY":
        if(period.duration > 365) {
          return "The length of this period must be 365 days or less."
        }
        break;
      default:
      }
    }
    return ""
  }

  public addOptionPeriod(): void {
    if (!this.isOptionsMaxxedOut){
      const newOptionPeriod = {
        duration: 1,
        unitOfTime: "YEAR",
        id: null,
        order: this.optionPeriods.length + 1,
      };
      this.optionPeriods.push(newOptionPeriod);
    }
  }

  public setTotalPoP(): void {
    this.basePoPDuration = 0
    this.totalPoPDuration = 0;
    this.optionPeriods.forEach((optionPeriod, idx) => {
      if (optionPeriod.duration) {
        let multiplier = 1;
        switch (optionPeriod.unitOfTime) {
        case "WEEK":
          multiplier = 7;
          break;
        case "MONTH":
          multiplier = 30;
          break;
        case "YEAR":
          multiplier = 365;
          break;
        default:
          multiplier = 1;
        }
        const thisDays = optionPeriod.duration * multiplier;
        if(idx === 0){
          this.basePoPDuration += thisDays
        }
        this.totalPoPDuration += thisDays;
      }
    });

  }

  public deleteOptionPeriod(index: number): void {
    const optionPeriod = this.optionPeriods[index];
    if(optionPeriod.id){
      this.removed.push(convertPoPToPeriod(optionPeriod));
    }
    this.optionPeriods.splice(index, 1);
    this.clearErrorMessages(index);
    this.setTotalPoP();
  }

  public clearErrorMessages(index:number):void {
    this.durationErrorIndices = this.durationErrorIndices.filter(i=>i!==index);
    this.setDurationErrorMessages([], index);
    Vue.nextTick(()=>{
      this.$refs.form.validate();
    })
  }
  public copyOptionPeriod(index: number): void {
    if (!this.isOptionsMaxxedOut){
      const {
        duration,
        order,
        unitOfTime,
      } = this.optionPeriods[index];

      const duplicateObj: PoP ={
        duration,
        id: null,
        order,
        unitOfTime,
      }
      this.optionPeriods.splice(index + 1,0,duplicateObj)
      this.setTotalPoP();
    }
  }

  get isOptionsMaxxedOut(): boolean{
    return this.optionPeriodCount >= 5;
  }

  get hasErrors(): boolean{
    return this.durationErrorIndices.length > 0
  }

  public getOptionPeriodLabel(index: number): string {
    return index === 0 ? "Base" : "Option " + index;
  }

  public getOptionPeriodLabelError(index: number): string {
    const period = (index === 0 ? "base" : "option");
    const isNotBase = (index > 0 ? " " + index.toString() : "");
    return period + " period" + isNotBase;
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PopLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    this.setDragEventListeners();
    await this.loadOnEnter();
  }

  public durationLabelEl = document.getElementsByClassName("duration")[0] as HTMLElement;

  private setDragEventListeners(): void {

    // get all draggable elements
    const draggableElements = document.querySelectorAll(".draggable") as NodeList;
    if (draggableElements.length) {
      draggableElements.forEach((e) => {
        const draggableEl = e as HTMLDivElement;

        // drag has started
        draggableEl.addEventListener("dragstart", (e: DragEvent) => {

          // hide drag icons for all rows except the row being dragged
          draggableElements.forEach((e) => {
            const row = e as HTMLDivElement;
            if (!row.classList.contains("sortable-chosen")) {
              const icon = row.getElementsByClassName("drag-icon")[0] as HTMLElement;
              icon.classList.add("hide-icon");
            }
          });

          const row = e.currentTarget as HTMLElement;
          row.style.cursor = "ns-resize";

          // hide base/option label of row being dragged
          const i = row.dataset.index || "0";
          const index: number = parseInt(i);
          this.optionPeriodClicked = this.optionPeriods[index];
          this.durationLabelEl = row.getElementsByClassName("duration")[0] as HTMLElement;
          this.durationLabelEl.classList.add("d-none");

          // create a fake drag ghost image to use instead of default and hide it
          //eslint-disable-next-line prefer-const
          let elem = document.createElement("div") as HTMLElement;
          elem.classList.add("drag-img-fake");
          elem.setAttribute("id", "DragImgFaker");
          // must include some text or it won't hide
          elem.innerText = "x";
          document.body.appendChild(elem);
          e.dataTransfer?.setDragImage(elem, 0, 0);
        });

        // element is being dragged
        draggableEl.addEventListener("drag", (e: DragEvent) => {
          const row = e.currentTarget as HTMLElement;
          row.style.cursor = "ns-resize";
          draggableEl.classList.add("dragging");

          // position the div indicating what's being dragged next to the mouse
          // account for x offset to include width of left menu
          // account for y offset to include width of header
          const dragImg = document.getElementById("DragImg") as HTMLDivElement;
          const leftMenu = document.getElementById("GlobalSideNavBar") as HTMLDivElement;
          const leftMenuWidth = leftMenu.clientWidth;
          const pageHeader = document.getElementById("PageHeader") as HTMLDivElement;
          const pageHeaderHeight = pageHeader.clientHeight;
          dragImg.style.left = (e.clientX + 20 - leftMenuWidth) + "px";
          dragImg.style.top = (e.clientY - 15 - pageHeaderHeight) + "px";

          // show the div that appears next to pointer when dragging
          this.showDragImg(true);
        });

        // element has been dropped - drag operation ends
        draggableEl.addEventListener("dragend", () => {
          const imgFaker = document.getElementById("DragImgFaker");
          imgFaker?.parentNode?.removeChild(imgFaker);

          // show the base/option label for the dragged element
          this.durationLabelEl.classList.remove("d-none");

          // remove class "hide-icon" from all rows
          draggableElements.forEach((e) => {
            const row = e as HTMLDivElement;
            const icon = row.getElementsByClassName("drag-icon")[0] as HTMLElement;
            icon.classList.remove("hide-icon");
          });

          draggableEl.classList.remove("dragging");

          // hide the div that appears next to pointer when dragging
          this.showDragImg(false);
        });
      });
    }
  }

  public showDragImg(show: boolean): void {
    const dragImg = document.getElementById("DragImg") as HTMLDivElement;
    dragImg.style.display = show ? "inline-block" : "none";
  }

  public optionPeriodClicked: PoP = {
    duration: 1,
    unitOfTime: "YEAR",
    id: null,
    order: 1,
  };

  public preDrag(e: MouseEvent, index: number): void {
    if (index && this.optionPeriods[index]) {
      this.optionPeriodClicked = this.optionPeriods[index];
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  private get currentData(): PeriodDTO[] {

    const periods = this.optionPeriods.map(pop=>convertPoPToPeriod(pop))
    return periods;
  }

  private savedData: PeriodDTO[] = [];

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.getAllPeriods() as PeriodDTO[];
    this.savedData = periods.sort((a, b) => a.option_order > b.option_order ? 1 : -1)
      .map(period=> {
        return {
          option_order: period.option_order,
          period_unit_count: period.period_unit_count,
          period_unit: period.period_unit,
          period_type: period.period_type,
          sys_id: period.sys_id,
        }
      });
    this.optionPeriods = periods.length ? periods.map(period=> {

      const optionPeriod: PoP = {

        duration: Number(period.period_unit_count || 1),
        unitOfTime: period.period_unit || "YEAR",
        id: period.sys_id || "",
        order: Number(period.option_order),
      };

      return optionPeriod;
    }) : [ {
      duration: 1,
      unitOfTime: "YEAR",
      id: null,
      order: 1,
    }];


    this.setTotalPoP();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {

      if(this.totalPoPDuration > this.maxTotalPoPDuration)
        return false;

      const valid = this.optionPeriods.every(peroid=>peroid.duration);
      const cutOff = 270;
      const hasChanged = valid && hasChanges(this.savedData, this.currentData);
      AcquisitionPackage.setBasePoPDuration(this.basePoPDuration)

      if (hasChanged) {
        const removed = this.removed;
        await Periods.savePeriods({periods: this.currentData, removed});
        if(this.basePoPDuration < cutOff){
          FinancialDetails.saveIFPData(
            {
              data: {initialFundingIncrementStr: "",
                fundingIncrements: []},
              removed: FinancialDetails.fundingIncrements
            }
          );
        }
      }
    } catch (error) {
      throw new Error('error saving period data');
    }

    return true;
  }
}
</script>
