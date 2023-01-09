<template>
  <v-row>
    <v-col>
      <div class="d-flex">
        <div style="width: 450px">
          <div class="d-flex justify-space-between align-center">
            <label for="InitialAmount">Initial funding increment</label>
            <ATATTextField
                id="InitialAmount"
                :value.sync="initialAmountStr"
                :alignRight="true"
                :isCurrency="true"
                :showErrorMessages="false"
                width="190"
                class="mr-2"
                :class="[{ 'error--text': errorMissingInitialIncrement },]"
                style="margin-left: 39px;"
                :validateOnBlur="false"
                :rules="[$validators.required('', true)]"
                @blur="calcAmounts('initialIncrement')"
            />
            <span class="d-block" style="width: 9px"></span>
          </div>
          <div
              v-if="errorMissingInitialIncrement"
              class="d-flex justify-start align-top atat-text-field-error mb-1 mt-3"
              id="InitialIncrementError">
            <ATATSVGIcon
                style="margin-top: 2px"
                name="exclamationMark"
                :width="18"
                :height="18"
                color="error"
            />
            <div class="field-error ml-2">
              {{ errorMissingInitialIncrementMessage }}
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATTextField
  },
})

export default class IncFundingPlanInitial extends Mixins(SaveOnLeave) {
  public initialAmountStr = "";
  public errorMissingInitialIncrement = false;
  public errorMissingInitialIncrementMessage =
      "Please enter the amount of your initial funding.";

  public async loadOnEnter(): Promise<void> {
    // do something
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
