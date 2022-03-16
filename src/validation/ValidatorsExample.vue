<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3)]"
          :value.sync="minValue"
          label="Min Length 3"
          ref="minLengthField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3, 'need at least than 3 chars bud')]"
          :value="minValueCustom"
          label="Min Length 3 Custom message"
          ref="minLengthCustom"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.maxLength(9)]"
          :value="maxValue"
          label="Max Length 9"
          ref="maxLengthField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.required()]"
          :value="requiredValue"
          label="Value Required"
          ref="requiredField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.integer()]"
          :value="integerValue"
          label="Integers only"
          ref="integerField"
      /></v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
  },
})
export default class ValidatatorsExample extends Vue {
  private minValue = "a";
  private minValueCustom = "a";
  private maxValue = "12345678910";
  private requiredValue = "";
  private integerValue = "y";

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public async validateForm(): Promise<boolean> {
    let valid = false;

    await this.$nextTick(() => {
      valid = this.Form.validate();
    });

    return valid;
  }

  public async mounted(): Promise<void> {
    await this.validateForm();
  }
}
</script>