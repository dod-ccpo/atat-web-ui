<template>
    <div>
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
              id="NoTravelMessage"
              v-if="!hasListings"
              class="
                w-100
                py-10
                border1
                _border-rounded border-base-lighter
                text-center
                mb-10
                mt-10
              "
            >
              You do not have any travel requirements yet.
            </div>
            <div v-if="hasListings">
              <v-table
                  v-if="hasListings"
                  :headers="setTableHeaders"
                  :items="tableData"
                  :items-per-page="-1"
                  class="elevation-0 _offering-instances mt-10"
                  :hide-default-footer="true"
              >
                <thead>
                  <tr>
                    <th
                      v-for="item in setTableHeaders"
                      :key="item.title"
                      class="text-left" scope="row"
                    >
                      {{ item.title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item, i in tableData"
                    :key="item.sys_id"
                  >
                    <td>
                      {{ i + 1 }}
                    </td>
                    <td>
                      {{ item.trip_location }}
                    </td>
                    <td>
                      {{ item.duration_in_days }}
                      {{ // @ts-ignore
                        item.duration_in_days>1 ? 'days': 'day'
                      }}
                    </td>
                    <td>
                      {{ item.number_of_travelers }}
                      {{ // @ts-ignore
                        item.number_of_travelers>1 ? 'travelers': 'traveler'
                      }}
                    </td>
                    <td>
                      {{ createNumberOfTripsTexts(item)  }}
                    </td>
                    <td>
                      {{ createPeriodText(item.selected_periods) }}
                    </td>
                    <td>
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
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
            <hr class="mt-0" v-if="hasListings" />
          </div>
          <div v-if="isLoading"
            class="d-flex justify-space-around py-10 border1 _border-rounded border-base-lighter
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
            class="_secondary _normal _small-text mt-5"
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
      okButtonId="AddTrip"
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
                :value="travelItem.trip_location"
                @update:value="travelItem.trip_location = $event"
                :rules="[
                    $validators.required('Enter your trip location'),
                ]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-sm-4">
              <ATATTextField
                id="Duration"
                label="Duration"
                suffix="days"
                :value="travelItem.duration_in_days"
                @update:value="travelItem.duration_in_days = $event"
                type="number"
                :rules="[
                    $validators.required('Enter the number of days for your trip'),
                ]"
              />
            </v-col>
            <v-col class="col-sm-4">
              <ATATTextField
                id="NumberOfTravelers"
                label="Number of travelers"
                suffix="people"
                :value="travelItem.number_of_travelers"
                @update:value="travelItem.number_of_travelers = $event"
                type="number"
                :rules="[
                  $validators.required('Enter the number of people traveling'),
                ]"
              />
            </v-col>
            <v-col class="col-sm-4">
              <ATATTextField
                id="NumberOfTrips"
                label="Number of trips"
                suffix="per period"
                :value="travelItem.number_of_trips"
                @update:value="travelItem.number_of_trips = $event"
                tooltipText="This number of trips will be applied to each period selected below."
                type="number"
                :rules="[
                    $validators.required('Enter the number of trips needed per period'),
                ]"
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
                name="periodsCheckboxes"
                :hasOtherValue="false"
                :items="availablePeriodCheckboxItems"
                :value="travelItem.selected_periods"
                @update:value="travelItem.selected_periods = $event"
                :resetSelected="resetSelectedPeriods"
                :card="false"
                class="copy-max-width"
                :rules="[
                    $validators.required('Select at least once performance period.'),
                ]"
              />

            </v-col>
          </v-row>
        </div>
      </template>
    </ATATDialog>

    <ATATDialog
      id="DeleteInstanceModal"
      okButtonId="DeleteTrip"
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
  </div>
</template>

<style>
.v-tooltip__content {
    z-index: 10000 !important;
}
</style>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";
import { Checkbox, DataTableHeader, SaveOnLeaveRefs, TravelSummaryTableData } from "types/Global";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { createPeriodCheckboxItems } from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import {routeNames} from "@/router/stepper";
import acquisitionPackage from "@/store/acquisitionPackage";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATSVGIcon,
    ATATDialog,
    ATATTextField,
    ATATCheckboxGroup,
  },
})
class Travel extends Vue {

  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

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


  get resetSelectedPeriods():boolean{
    return this.isCreate;
  }

  get isAddTripsDisabled(): boolean {
    return Object.values(this.travelItem).some(
      (travelItem) => travelItem?.length === 0
    );
  }

  get setTableHeaders(): DataTableHeader[] {
    return this.hasListings
      ? [
        { title: "", value: "instanceNumber", width: "50" },
        { title: "Location", value: "trip_location" },
        { title: "Duration", value: "duration_in_days" },
        { title: "Number of travelers", value: "number_of_travelers" },
        { title: "Number of trips", value: "number_of_trips" },
        { title: "Performance period(s)", value: "selected_periods" },
        { title: "", value: "actions", width: "100" },
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
    acquisitionPackage.setIsTravelTouched(true)
    if (!this.isLoading && showModal) {
      if (this.hasListings){
        this.confirmDeleteModal();
      } else {
        DescriptionOfWork.setConfirmTravelDeleteAll(false);
        this.$router.push({
          name: routeNames.SummaryStepSix,
          query: {
            direction: "next"
          },
          replace: true
        }).catch(() => console.log("avoiding redundant navigation"));
      }
    } else {
      DescriptionOfWork.setConfirmTravelDeleteAll(false);
    }
  }

  public createInstance(): void {
    this.isCreate = true;
    this.resetTravelItem();
    this.showTravelFormDialog = true;
  }

  public cancelDialog(): void {
    this.showTravelFormDialog = false;
    this.isCreate = false;
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
    acquisitionPackage.setIsTravelTouched(true)
    if (this.deleteAll){
      await DescriptionOfWork.deleteTravelAll(
        this.tableData.filter(td => td.sys_id && td.sys_id.trim().length > 0)
          .map(td => td.sys_id as string)
      );
      this.tableData = [];
      DescriptionOfWork.setConfirmTravelDeleteAll(false);
      this.$router.push({
        name: routeNames.SummaryStepSix,
        query: {
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
      this.isCreate = false;
    }
    this.showTravelFormDialog = false;
    acquisitionPackage.setIsTravelNeeded("YES")
    acquisitionPackage.setIsTravelTouched(true)
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

export default toNative(Travel)
</script>
