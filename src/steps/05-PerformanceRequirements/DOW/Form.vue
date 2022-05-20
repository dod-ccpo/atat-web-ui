
<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s work on your performance requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Through JWCC, you have the ability to procure many offerings for
              Anything as a Service (XaaS) and Cloud Support Packages. Specify
              any categories that may apply to your acquisition below, and we’ll
              walk through each selection to get more details next.
              <a
                role="button"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
                tabindex="0"
              >
                Learn more about categories.
              </a>
            </p>

            <p id="XaaSLabel" class="_checkbox-group-label">
              What type of XaaS resources, tools and services do you need?
            </p>

            <ATATCheckboxGroup
              id="XaaSCheckboxes"
              aria-describedby="XaaSLabel"
              :value.sync="xaasSelectedOptions"
              :items="xaasCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
            />

            <hr />

            <p id="CloudSupportLabel" class="_checkbox-group-label">
              What type(s) of cloud support packages do you need?
            </p>
            <ATATCheckboxGroup
              id="CloudSupportCheckboxes"
              aria-describedby="CloudSupportLabel"
              :value.sync="cloudSupportSelectedOptions"
              :items="cloudSupportCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";


@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class Form extends Vue {
  // props
  @Prop({ default: true }) private dense!: boolean;

}
</script>

