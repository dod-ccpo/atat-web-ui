<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Do you want to request a PoP start date?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Due to project requirements and/or contractual obligations, your PoP may need to start
              on a specific date. If no date is specified, then your PoP will begin based upon the
              execution date of your task order.
            </p>
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="PoPStartDate"
              :card="true"
              :items="startPoPDateOptions"
              :value.sync="selectedPoPStartDateOption"
            />
          </div>
          <div v-if="selectedPoPStartDateOption ==='YesStartDate'">
            <hr class="my-9"/>
            <p class="mb-2">
              Requested start date
            </p>
            <div class="copy-max-width d-flex mb-9">
              <ATATSelect
                id="RequestDateOption"
                class="mr-7"
                label=""
                :items="requestDateOptions"
                :selectedValue.sync="selectedRequestDateOption"
                style="max-width: 196px"
              />
              <ATATDatePicker id="RequestDatePicker" class="mt-2"/>
            </div>
            <ATATAlert v-if="selectedRequestDateOption === 'Not later than' " type="warning">
              <template slot="content">
                <p>All efforts will be made to accommodate your requested period of performance
                  start date. However, there is no guarantee that the award will be made by said
                  date. Normal contracting lead times and/or complexity of requirements may prevent
                  meeting the requested date.
                </p>
              </template>
            </ATATAlert>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import {RadioButton, SelectData} from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATDatePicker,
    ATATRadioGroup,
    ATATSelect,
  },
})

export default class POPStart extends Vue {
  private selectedPoPStartDateOption = "";
  private startPoPDateOptions: RadioButton[] = [
    {
      id: "YesStartDate",
      label: "Yes.",
      value: "YesStartDate",
    },
    {
      id: "NoStartDate",
      label: "No. The PoP should start upon execution of the task order.",
      value: "NoStartDate",
    },
  ];
  private selectedRequestDateOption = "";
  private requestDateOptions: SelectData[] = [
    {
      text: 'No sooner than',
      value: "No sooner than"
    },
    {
      text: 'Not later than',
      value: "Not later than"
    }
  ];
}
</script>
