<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s review your agency’s plans to remove barriers to fair opportunity
          </h1>
          <p>
            Based on what you’ve told us, we’ve suggested language to describe the actions proposed
            to remove barriers to fair opportunity. You can edit any details to meet your
            requirements.
          </p>
          <ATATTextArea
            class="textarea-max-width"
            id="ExceptionTextArea"
            label="Briefly discuss any other
              facts or details supporting the use of this exception"
            :value.sync="exceptionDiscussion"
            :maxChars="1000"
            :rows="6"
            :validateItOnBlur="true"
            :rules="[
                $validators.required('Enter a description for your other supporting factors.'),
                $validators.maxLength(1000)
            ]"
          />
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class ReviewBarriers extends Vue {}
</script>
