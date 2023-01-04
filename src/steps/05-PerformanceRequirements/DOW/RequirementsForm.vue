<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12 pa-0">
          <div class="copy-max-width">
            <div 
              v-for="(instance, index) in _instances" 
              :key="instance.labelShort"
            >
              <span v-if="avlInstancesLength > 1">
                <hr />
                <h2
                  :id="'RequirementHeading_' + (index + 1)"
                  class="mb-5"
                >
                  {{ index + 1 }}. Tell us about the 
                  {{ instance.labelShort }} instance
                </h2>
              </span>
              
              <div v-if="isTacticalEdge">
                <ATATRadioGroup 
                  v-if="isDelivery"
                  id="DeliveryOptions"
                  class="mb-8"
                  :items="deliveryOptions"
                  :value.sync="instance.typeOfDelivery"
                  legend="What type of delivery do you need?"
                  :rules="[$validators.required('Please select a type of delivery.')]"
                />
                <ATATRadioGroup 
                  v-if="isMobile"
                  id="MobilityOptions"
                  class="mb-8"
                  :items="mobilityOptions"
                  :value.sync="instance.typeOfMobility"
                  legend="What type of mobility do you need?"
                  :hasOtherValue="true"
                  otherValueRequiredMessage="Please enter your other type of mobility."
                  :validateOtherOnBlur="true"
                  otherValue="OTHER"
                  :otherValueEntered.sync="instance.typeOfMobilityOther"
                  :rules="[$validators.required('Please select a type of mobility.')]"
                />                           
              </div>

              <AnticipatedDurationandUsage
                typeForUsage="requirement"
                typeForDuration="requirement"
                :anticipatedNeedUsage.sync="instance.anticipatedNeedUsage"
                :entireDuration.sync="instance.entireDuration"
                :selectedPeriods.sync="instance.selectedPeriods"
                :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
                :isPeriodsDataMissing="isPeriodsDataMissing"
                :index="index"
              />
             
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";

import { 
  Checkbox, 
  DOWClassificationInstance,
  RadioButton,
} from "../../../../types/Global";

import { routeNames } from "../../../router/stepper"
import { createPeriodCheckboxItems } from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
    AnticipatedDurationandUsage
  }
})

export default class RequirementsForm extends Vue {
  // props
  @PropSync("instances") private _instances!: DOWClassificationInstance[];
  @Prop() private avlInstancesLength!: number;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public groupId!: string;
  @Prop() public serviceOfferingName!: string;
  
  public isTacticalEdge = false;
  public isDelivery = false;
  public isMobile = false;

  private selectedOptions: string[] = [];
  private routeNames = routeNames;
  private availablePeriodCheckboxItems: Checkbox[] = [];

  public mobilityOptions: RadioButton[] = [
    {
      id: "ManPortable",
      label: "Man-portable",
      value: "MAN_PORTABLE",
    },
    {
      id: "Modular",
      label: "Modular",
      value: "MODULAR",
    },
    {
      id: "Other",
      label: "Other",
      value: "OTHER",
    },
    {
      id: "NoPreference",
      label: "No preference",
      value: "NO_PREFERENCE",
    }
  ];

  public deliveryOptions: RadioButton[] = [
    {
      id: "Shipped",
      label: "Shipped",
      value: "SHIPPED",
    },
    {
      id: "Pickup",
      label: "Pick-up",
      value: "PICK_UP",
    },
  ];

  @Watch("_instances", {deep: true}) 
  public instanceUpdate(newVal: DOWClassificationInstance[]): void {
    newVal.forEach(instance => {
      if (instance.typeOfMobility !== "OTHER") {
        instance.typeOfMobilityOther = "";
      }
    })
  }

  public async loadOnEnter(): Promise<void> {
    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
    this.isTacticalEdge = this.groupId === "EDGE_COMPUTING";
    this.isMobile = this.serviceOfferingName === "Mobility";
    this.isDelivery = this.serviceOfferingName === "Delivery";
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };

}
</script>

