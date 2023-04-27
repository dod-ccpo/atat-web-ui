<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pagewHeaderIntro }} the cause of your sole source situation
          </h1>
          <p>
            Intro paragraph
          </p>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class SoleSourceReview extends Vue {
  public writeOwnExplanation = false;
  public get pagewHeaderIntro(): string {
    return this.writeOwnExplanation ? "Tell us about" : "Let’s review";
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.writeOwnExplanation = storeData.write_own_sole_source_cause === "YES";
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
