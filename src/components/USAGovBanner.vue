<template>
  <!-- Reference source https://designsystem.digital.gov/components/banner/ -->
  <v-card
    outlined
    style="border-radius: 0px"
    class="bg-base-lightest usa-gov-head"
  >
    <v-card-actions class="py-0">
      <div class="font-size-13">
        <div class="d-flex align-center">
          <div class="mr-3">
            <img
              src="../../public/img/us_flag_small.png"
              alt="USA Flag"
              height="11"
              width="16"
            />
          </div>
          <div class="USWDC-official-banner__text mr-3">
            An official website of the United States government
          </div>
          <v-btn
            @click="toggle"
            plain
            text
            x-small
            :ripple="false"
            class="p-0 btn-usa-gov-expand"
            :class="{ open: show }"
          >
            Here’s how you know
          </v-btn>
        </div>
      </div>
    </v-card-actions>

    <div v-show="show" class="usa-banner__guidance-container">
      <v-card-text class="pb-0">
        <v-row align="center" class="mb-3">
          <v-col
            cols="12"
            sm="6"
            align-self="start"
            class="d-flex align-left pb-0 usa-banner__guidance"
          >
            <img
              class="usa-banner__icon usa-media-block__img responsive mr-3"
              src="../../public/img/icon-dot-gov.svg"
              role="img"
              alt=""
              width="40"
              aria-hidden="true"
            />
            <div class="USWDC-official-banner__col-01">
              <strong>Official websites use .mil</strong><br />
              A <strong>.mil</strong> website belongs to an official U.S.
              Department of Defense organization.
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            align-self="start"
            class="d-flex align-left pb-0 usa-banner__guidance"
          >
            <img
              class="usa-banner__icon usa-media-block__img responsive mr-3"
              src="../../public/img/icon-https.svg"
              role="img"
              alt=""
              width="40"
              aria-hidden="true"
            />
            <div class="USWDC-official-banner__col-02">
              <strong>Secure .mil websites use HTTPS</strong><br />
              A <strong>lock</strong> (
              <img
                class="usa-banner__icon usa-media-block__img responsive"
                src="../../public/img/usa-banner-lock.svg"
                role="img"
                alt=""
                width="10"
                aria-hidden="true"
              />
              ) or <strong>https://</strong> means you’ve safely connected to
              the .mil website. Share sensitive information only on official,
              secure websites.
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit } from "vue-property-decorator";

@Component({})
export default class USAGovBanner extends Vue {
  private show = false;

  @Emit()
  public toggle(): boolean {
    this.show = !this.show;
    return this.show;
  }
}
</script>
