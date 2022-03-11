<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3)]"
          :value="minValue"
          label="Min Length 3"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3, 'need more than 3 chars bud')]"
          :value="minValueCustom"
          label="Min Length 3 Custom message"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.maxLength(9)]"
          :value="maxValue"
          label="Max Length 9"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.required()]"
          :value="requiredValue"
          label="Value Required"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.integer()]"
          :value="integerValue"
          label="Integers only"
      /></v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import Vue from "vue";
import ATATTextField from "@/components/ATATTextField.vue";
import Validators from "@/mixins/Validators";

@Component({
  components: {
    ATATTextField,
  },
})
export default class ValidatatorsExample extends Vue {
  private minValue = "a";
  private minValueCustom = "a";
//   private minCustomRules: Array<unknown> = [
//     validators.minLength(3, "you need at least 3 chars"),
//   ];
//   private minRules: Array<unknown> = [validators.minLength(3)];
  private maxValue = "12345678910";
//   private maxRules: Array<unknown> = [validators.maxLength(9)];
  private requiredValue = "";
//   private requiredRules: Array<unknown> = [validators.required()];
  private integerValue = "y";
//   private integerRules: Array<unknown> = [validators.integer()];

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
    console.log(this.$validators)
    await this.validateForm();
  }
}
</script>
