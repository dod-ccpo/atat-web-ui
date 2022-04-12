<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather some details about the duration of your task order
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Your Period of Performance (PoP) will begin based upon the execution 
              date of your task order or on your requested start date, if applicable. 
              It will extend through the length of the base period, plus any subsequent 
              option periods. In the fields below, specify the length of time that 
              each period will remain in effect. Add, duplicate or remove option 
              periods as needed, up to 5 years total. 
              <a role="button" id="PoPLearnMore" @click="openSlideoutPanel">
                Learn more about PoPs on the JWCC contract.
              </a>
            </p>
          </div>

          <div class="mb-4 _semibold" style="padding-left: 101px;">
            Period of Performance length
          </div>
          <div 
            v-for="(optionPeriod, index) in optionPeriods"
            :key="getIdText(getOptionPeriodLabel(index))"
            class="d-flex mb-5"
            :id="getIdText(getOptionPeriodLabel(index)) + 'Row'"
          >
            <div 
              class="d-flex align-center justify-end mr-4 font-size-14 _text-base"
              style="width: 85px;"  
            >
              {{ getOptionPeriodLabel(index) }}
            </div>
            <div>
              <ATATTextField
                :id="getIdText(getOptionPeriodLabel(index))"
                class="mr-4"
                width="178"
                :rules="[$validators.integer()]"
                :value="optionPeriod.duration"
                @blur="setDuration($event, index)"
              />
            </div>
            <div>
              <ATATSelect
                :id="getIdText(getOptionPeriodLabel(index))"
                :items="timePeriods"
                width="178"
                :selectedValue="optionPeriod.timePeriod"
                class="mr-4"
                @onChange="setTimePeriod($event, index)"
              />
            </div>
            <div :id="getIdText(getOptionPeriodLabel(index)) + 'Buttons'" class="d-flex align-center">
              <!-- copy button disabled - will be implemented in future ticket -->
              <v-btn 
                icon
                class="mr-1"
                :disabled="true"
                @click="copyOptionPeriod()"
                aria-label="Duplicate this option period"
              >
                <v-icon>
                  content_copy
                </v-icon>
              </v-btn>

              <v-btn 
                icon
                :disabled="optionPeriods.length === 1"
                @click="deleteOptionPeriod(index)"
                aria-label="Delete this option period"
              >
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </div>
          </div>

          <v-btn
            id="addOptionPeriodButton"
            v-if="totalPoPDuration < maxTotalPoPDuration"
            plain
            text
            class="_text-link"
            :ripple="false"
            @click="addOptionPeriod()"
          >
            <v-icon color="primary" class="mr-2">control_point</v-icon>
            <span>Add an option period</span>
          </v-btn>

          <div 
            class="justify-start align-center atat-text-field-error mt-2" 
            :class="{ 'd-flex': totalPoPDuration > maxTotalPoPDuration }"
            v-show="totalPoPDuration > maxTotalPoPDuration"
          >
            <v-icon class="text-base-error icon-20">
              error
            </v-icon>
            <div class="field-error ml-2">
              The total length of your base and option periods should be 5 years or less.
            </div>
          </div>

        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATTextField from "@/components/ATATTextField.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import PoPLearnMore from "./PopLearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";

import { PoP, SelectData, SlideoutPanelContent } from "../../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATTextField,
    ATATSelect,
    PoPLearnMore,
  },
})

export default class PeriodOfPerformance extends Vue {

  public maxTotalPoPDuration = 365 * 5;

  public optionPeriods: PoP[] = [
    {
      duration: null,
      timePeriod: "Year",
    },
  ];
  
  public totalPoPDuration = 0;

  public selectedTimePeriod = "Year"
  public timePeriods: SelectData[] = [
    { text: "Year", value: "Year" },
    { text: "Month(s)", value: "Month(s)" },
    { text: "Week(s)", value: "Week(s)" },
    { text: "Day(s)", value: "Day(s)" },
  ];

  public addOptionPeriod(): void {
    const newOptionPeriod = {
      duration: null,
      timePeriod: "Year",
    };
    this.optionPeriods.push(newOptionPeriod);
  }

  public setDuration(e: Event, index: number): void {
    if (e && e.currentTarget) {
      const input = e.currentTarget as HTMLFormElement;
      const duration = input.value;
      const currentDuration = this.optionPeriods[index].duration;
      if (duration !== currentDuration) {
        this.optionPeriods[index].duration = duration;
        this.setTotalPoP();
      }
    }
  }

  public setTimePeriod(timePeriod: string, index: number): void {
    if (timePeriod) {
      this.optionPeriods[index].timePeriod = timePeriod;
      const duration = this.optionPeriods[index].duration;
      if (duration) {
        this.setTotalPoP();
      }
    }
  }

  public setTotalPoP(): void {
    this.totalPoPDuration = 0;
    this.optionPeriods.forEach((optionPeriod) => {
      if (optionPeriod.duration) {
        let multiplier = 1;
        switch(optionPeriod.timePeriod) {
          case "Week(s)":
            multiplier = 7;
            break;
          case "Month(s)":
            multiplier = 30;
            break;
          case "Year":
            multiplier = 365;
            break;
          default:
            multiplier = 1;
        }
        const thisDays = optionPeriod.duration * multiplier;
        this.totalPoPDuration += thisDays;
      }
    });
  }

  public deleteOptionPeriod(index: number): void {
    this.optionPeriods.splice(index, 1);
    this.setTotalPoP();
  }

  public getOptionPeriodLabel(index:number): string {
    return index === 0 ? "Base" : "Option " + index;
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PoPLearnMore,
      title: "Learn More",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

}
</script>
