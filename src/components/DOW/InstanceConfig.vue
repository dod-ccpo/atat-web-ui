<template>
  <section id="InstanceConfig">
    <v-row>
      <v-col class="col col-sm-12 col-md-6">
        <ATATTextField
          id="Licensing"
          label="Licensing"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { Checkbox, RadioButton, CurrentEnvUsageData } from "types/Global";

@Component({
  components: {
    ATATSelect,
    ATATTextField,
  }
})

export default class InstanceConfig extends Vue {
  // @PropSync("instanceConfig")


}

</script>
