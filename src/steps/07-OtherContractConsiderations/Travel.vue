<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us about your travel requirements for contractor employees
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              CSP employees may be required to travel in order to fulfill
              performance requirements, such as training or advisory support
              services. Add details for each anticipated trip below, and we’ll
              include them within your Description of Work. If you have travel
              requirements, we’ll also walk you through gathering price
              estimates for your Independent Government Cost Estimate (IGCE)
              later.
            </p>
          </div>
          <div v-if="!isLoading">
            <div
                v-if="!hasListings"
                class="
              w-100
              py-10
              border1
              border-rounded border-base-lighter
              text-center
              mb-10
              mt-10
            "
            >
              You do not have any travel requirements yet.
            </div>
            <div v-if="hasListings">
              <v-data-table
                  v-if="hasListings"
                  :headers="setTableHeaders"
                  :items="tableData"
                  :items-per-page="-1"
                  class="elevation-0 _offering-instances mt-10"
                  :hide-default-footer="true"
              >

                <!-- eslint-disable vue/valid-v-slot -->
                <template v-slot:item.duration_in_days="{ item }">
                  {{ item.duration_in_days }}
                  {{ item.duration_in_days>1 ? 'days': 'day'}}
                </template>

                <!-- eslint-disable vue/valid-v-slot -->
                <template v-slot:item.number_of_travelers="{ item }">
                  {{ item.number_of_travelers }}
                  {{ item.number_of_travelers>1 ? 'travelers': 'traveler'}}
                </template>

                <!-- eslint-disable vue/valid-v-slot -->
                <template v-slot:item.number_of_trips="{ item }">
                  {{ createNumberOfTripsTexts(item)  }}
                </template>

                <!-- eslint-disable vue/valid-v-slot -->
                <template v-slot:item.selected_periods="{ item }">
                  {{ createPeriodText(item.selected_periods) }}
                </template>

                <!-- eslint-disable vue/valid-v-slot -->
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex justify-space-between align-center">
                    <button
                        type="button"
                        :id="'EditButton_' + item.instanceNumber"
                        @click="editInstance(item)"

                    >
                      <ATATSVGIcon name="edit" height="19" width="19" />
                    </button>

                    <button
                        type="button"
                        :id="'CopyButton_' + item.instanceNumber"
                        @click="copyInstance(item)"
                    >
                      <ATATSVGIcon name="content-copy" height="19" width="22" />
                    </button>

                    <button
                        type="button"
                        :id="'DeleteButton_' + item.instanceNumber"
                        @click="confirmDeleteModal(item)"
                    >
                      <ATATSVGIcon name="remove" height="18" width="14" />
                    </button>
                  </div>
                </template>
              </v-data-table>
            </div>
            <hr class="mt-0" v-if="hasListings" />
          </div>
          <div v-if="isLoading"
            class="d-flex justify-space-around py-10 border1 border-rounded border-base-lighter
            my-10 bg-offwhite width-100 text-center
          "
          >
            <div class="d-flex align-center" style="margin: 0 auto">
              <v-progress-circular
                  indeterminate
                  color="#544496"
                  size="24"
                  width="3"
                  class="mr-2"
              />
              <span class="h3">Loading your travel details</span>
            </div>
          </div>
          <v-btn v-if="!isLoading"
            id="AddInstance"
            role="link"
            class="secondary _normal _small-text mt-5"
            :ripple="false"
            @click="createInstance()"
          >
            <ATATSVGIcon
              color="primary"
              height="17"
              width="18"
              name="control-point"
              class="mr-2"
            />
            <span>Add&nbsp;{{ hasListings ? "another" : "a" }}&nbsp;trip</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <ATATDialog
      id="travelFormDialog"
      :showDialog="showTravelFormDialog"
      title="Add Trip Details"
      no-click-animation
      :okText="(isCreate ? 'Add' : 'Edit') + ' trip'"
      width="670"
      :OKDisabled="isAddTripsDisabled"
      @ok="addTravelItemToTable()"
      @cancelClicked="cancelDialog"
    >
      <template #content>
        <div class="mt-3">
          <v-row>
            <v-col class="col-sm-12">
              <ATATTextField
                id="TripLocation"
                label="Trip Location"
                :value.sync="travelItem.trip_location"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-sm-4">
              <ATATTextField
                id="Duration"
                label="Duration"
                suffix="days"
                :value.sync="travelItem.duration_in_days"
                type="number"
              />
            </v-col>
            <v-col class="col-sm-4">
              <ATATTextField
                id="NumberOfTravelers"
                label="Number of travelers"
                suffix="people"
                :value.sync="travelItem.number_of_travelers"
                type="number"
              />
            </v-col>
            <v-col class="col-sm-4">
              <ATATTextField
                id="NumberOfTrips"
                label="Number of trips"
                suffix="per period"
                :value.sync="travelItem.number_of_trips"
                tooltipText="This number of trips will be applied to each period selected below."
                type="number"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-sm-12">
              <label id="PeriodsLabel" class="form-field-label font-weight-500">
                In which performance period(s) do you need contractor employees
                to travel?
              </label>
              <div class="help-text mb-3">
                Trip details above will be applied to each selected period. If
                you have different travel requirements within each period, add
                multiple trips to this location.
              </div>

              <ATATCheckboxGroup
                id="PeriodsCheckboxes"
                aria-describedby="PeriodsLabel"
                ref="periodsCheckboxes"
                :items="availablePeriodCheckboxItems"
                :value.sync="travelItem.selected_periods"
                :card="false"
                class="copy-max-width"
              />
            </v-col>
          </v-row>
        </div>
      </template>
    </ATATDialog>

    <ATATDialog
      id="DeleteInstanceModal"
      :showDialog="showDeleteInstanceDialog"
      :title="deleteInstanceModalTitle"
      no-click-animation
      okText="Delete"
      width="450"
      @ok="deleteInstance"
      @cancelClicked="cancelDeleteModal"
    >
      <template #content>
        <p class="body" v-if="deleteAll">
          These trips will be removed from your travel requirements. Any details about these trips 
          will not be saved.
        </p>
        <p class="body" v-else>
          This trip will be removed from your travel requirements. Any details about this trip 
          will not be saved.
        </p>
      </template>
    </ATATDialog>
  </v-form>
</template>

<style>
.v-tooltip__content {
    z-index: 10000 !important;
}
</style>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { Checkbox, TravelSummaryTableData } from "types/Global";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { createPeriodCheckboxItems } from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import {routeNames} from "@/router/stepper";

@Component({
  components: {
    ATATSVGIcon,
    ATATDialog,
    ATATTextField,
    ATATCheckboxGroup,
  },
})
export default class Travel extends Mixins(SaveOnLeave) {
  public tableHeaders: Record<string, string>[] = [];
  public tableData: TravelSummaryTableData[] = [];
  public travelItem: TravelSummaryTableData = {
    instanceNumber: 0,
    trip_location: "",
    duration_in_days: "",
    number_of_travelers: "",
    number_of_trips: "",
    selected_periods: [],
  };
  public isCreate = false;
  public showTravelFormDialog = false;
  public showDeleteInstanceDialog = false;
  public deleteInstanceModalTitle = "";
  public availablePeriodCheckboxItems: Checkbox[] = [];
  public isLoading = true;

  get isAddTripsDisabled(): boolean {
    return Object.values(this.travelItem).some(
      (travelItem) => travelItem?.length === 0
    );
  }

  get setTableHeaders():  Record<string, string>[] {
    return this.hasListings
      ? [
        { text: "", value: "instanceNumber", width: "50" },
        { text: "Location", value: "trip_location" },
        { text: "Duration", value: "duration_in_days" },
        { text: "Number of travelers", value: "number_of_travelers" },
        { text: "Number of trips", value: "number_of_trips" },
        { text: "Performance period(s)", value: "selected_periods" },
        { text: "", value: "actions", width: "100" },
      ]
      : []
  }

  get hasListings(): boolean {
    return this.tableData.length > 0;
  }

  get deleteAll(): boolean {
    return DescriptionOfWork.confirmTravelDeleteAllVal;
  }

  /**
   * Checks if the component loaded all the travel items. If loaded, then
   * makes a call-out if there are any travel listings. Otherwise, just routes to the
   * next screen.
   * @param showModal - 'deleteAll' value gets passed into showModal parameter.
   */
  @Watch("deleteAll")
  public showDeleteAllModal(showModal: boolean): void {
    if (!this.isLoading && showModal) {
      if (this.hasListings){
        this.confirmDeleteModal();
      } else {
        DescriptionOfWork.setConfirmTravelDeleteAll(false);
        this.$router.push({
          name: routeNames.PII,
          params: {
            direction: "next"
          },
          replace: true
        }).catch(() => console.log("avoiding redundant navigation"));
      }
    } else {
      DescriptionOfWork.setConfirmTravelDeleteAll(false);
    }
  }

  public createInstance(): TravelSummaryTableData {
    this.isCreate = true;
    this.showTravelFormDialog = true;
    this.resetTravelItem();
    return this.travelItem;
  }

  public cancelDialog(): void {
    this.showTravelFormDialog = false;
    this.resetTravelItem();
  }

  public resetTravelItem(): void {
    this.travelItem = {
      instanceNumber: 0,
      trip_location: "",
      duration_in_days: "",
      number_of_travelers: "",
      number_of_trips: "",
      selected_periods: [],
    };
  }

  public editInstance(item: TravelSummaryTableData): void {
    this.isCreate = false;
    this.travelItem = item;
    this.showTravelFormDialog = true;
  }

  public copyInstance(item: TravelSummaryTableData): void {
    const clonedItem = {...item};
    clonedItem.sys_id = undefined;
    this.tableData.splice(item.instanceNumber, 0,clonedItem);
    this.setTableData();
  }

  public confirmDeleteModal(item?: TravelSummaryTableData): void {
    if (item){
      this.travelItem = item;
    } 

    this.showDeleteInstanceDialog = true;
    this.deleteInstanceModalTitle = this.deleteAll
      ? "Delete trips"
      : "Delete trip to " + item?.trip_location + "?"
  }

  /**
   * Makes a call to the store only for travel items that are in the DB.
   * Otherwise, just deletes it from the component's table.
   */
  public async deleteInstance(): Promise<void>{
    if (this.deleteAll){
      await DescriptionOfWork.deleteTravelAll(
        this.tableData.filter(td => td.sys_id && td.sys_id.trim().length > 0)
          .map(td => td.sys_id as string)
      );
      this.tableData = [];
      DescriptionOfWork.setConfirmTravelDeleteAll(false);
      this.$router.push({
        name: routeNames.PII,
        params: {
          direction: "next"
        },
        replace: true
      }).catch(() => console.log("avoiding redundant navigation"));
    } else {
      if (this.travelItem.sys_id && this.travelItem.sys_id.trim().length > 0) {
        if (this.tableData.length > 1){
          await DescriptionOfWork.deleteTravelInstance(this.travelItem.sys_id as string);
        } else if (this.tableData.length === 1) {
          await DescriptionOfWork.deleteTravelAll([this.travelItem.sys_id as string])
        }
      }
      this.tableData.splice(this.travelItem.instanceNumber-1, 1);
      this.setTableData();
    }
    this.showDeleteInstanceDialog = false;
  }

  public cancelDeleteModal(): void{
    this.showDeleteInstanceDialog = false
    DescriptionOfWork.setConfirmTravelDeleteAll(false);
  }

  public addTravelItemToTable(): void {
    if (this.isCreate) {
      this.tableData.push(this.travelItem);
      this.setTableData();
    }
    this.showTravelFormDialog = false;
  }

  public setTableData(): void {
    this.tableData.forEach((item, idx) => {
      //last item appears at the top
      //restarts numbering
      item.instanceNumber = idx + 1;
    });
  }

  public createPeriodText(periods: string[]): string {
    const periodText: string[] = [];
    periods.forEach((period) => {
      const label =
        this.availablePeriodCheckboxItems.find((p) => {
          return p.value === period;
        })?.label || "";
      periodText.push(label.toUpperCase());
    });

    return periodText
      .sort()
      .join(", ")
      .replaceAll("OPTION PERIOD ", "OP")
      .replaceAll("BASE PERIOD", "Base");
  }

  public createNumberOfTripsTexts(item: TravelSummaryTableData): string{
    const totalNumberOfTrips = parseInt(item.number_of_trips) * item.selected_periods.length;
    return totalNumberOfTrips > 1 
      ? (totalNumberOfTrips + " total (" + item.number_of_trips + " per period)")
      : totalNumberOfTrips + " total"
  }

  public async mounted(): Promise<void> {
    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void>{
    this.isLoading = true;
    await DescriptionOfWork.loadTravel();
    this.isLoading = false;
    this.tableData = await DescriptionOfWork.getTravel();
  }

  public async saveOnLeave(): Promise<boolean>{
    await DescriptionOfWork.saveTravel(this.tableData);
    return true;
  }

}
</script>
