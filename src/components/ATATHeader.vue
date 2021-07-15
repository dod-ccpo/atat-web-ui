<template>
  <v-app-bar
    app
    clipped-left
    :class="[show ? 'expandedHeader' : 'condensedHeader']"
    class="atat-header-nav py-2"
  >
    <template v-slot:extension>
      <!-- <div class="d-block width-100 usa-gov"> -->
      <v-card outlined style="border-radius: 0px">
        <v-card-actions class="py-0">
          <div class="h6">
            <div class="d-flex align-center">
              <div class="mr-3">
                <img
                  src="../../public/img/us_flag_small.png"
                  height="11"
                  width="16"
                />
              </div>
              <div class="USWDC-official-banner__text mr-3">
                An official website of the United States government
              </div>
              <div>
                <v-btn
                  @click="show = !show"
                  plain
                  text
                  x-small
                  :ripple="false"
                  class="p-0 btn-usa-gov-expand h6"
                >
                  <span
                    class="
                      USWDC-official-banner__link_msg
                      text-decoration-underline
                    "
                  >
                    Here’s how you know
                  </span>
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-actions>

       
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text class="h6">
              <v-row align="center">
                <v-col cols="12" md="4" lg="3" xl="2">
                  <div class="USWDC-official-banner__col-01">
                    <h3>Official websites use .mil</h3>
                    <p>
                      A <strong>.mil</strong> website belongs to an official
                      U.S. Department of Defense organization.
                    </p>
                  </div>
                </v-col>
                <v-col cols="12" md="4" lg="3" xl="2">
                  <div class="USWDC-official-banner__col-02">
                    <h3>Secure .mil websites use HTTPS</h3>
                    <p>
                      A <strong>lock</strong> (
                      <span class="icon-lock"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="8"
                          style="overflow: hidden"
                          viewBox="0 0 52 64"
                          class="usa-banner__lock-image"
                          role="img"
                          aria-labelledby="banner-lock-title-dot-mil banner-lock-description-dot-mil"
                          focusable="false"
                        >
                          <title id="banner-lock-title-dot-mil">Lock</title>
                          <desc id="banner-lock-description-dot-mil">
                            A locked padlock
                          </desc>
                          <path
                            fill="#000000"
                            fill-rule="evenodd"
                            d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z"
                          ></path></svg
                      ></span>
                      ) or <strong>https://</strong> means you’ve safely
                      connected to the .mil website. Share sensitive information
                      only on official, secure websites.
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
      </v-card>
      <!-- </div> -->
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center px-4">
          <img
            src="../../public/img/icons/atat-logo.svg"
            width="56"
            class="atat-nav-logo__icon pt-1"
          />
        </div>
        <ATATHeaderNav />
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATHeaderNav from "../components/ATATHeaderNav.vue";
@Component({
  components: {
    ATATHeaderNav,
  },
})
export default class ATATHeader extends Vue {
  public expanded = false;
  public show = false;
}
</script>
<style lang="scss">
.expandedHeader {
  height: 185px !important;
}

.condensedHeader {
  height: 60px !important;
}

.usa-gov {
  height: 20px !important;
  background-color: lightgray !important;
}

.atat-header {
  .atat-nav-logo {
    .atat-nav-logo__icon {
      display: inline-block;
      position: relative;
      top: 0.2em;
      margin-right: 0.5rem;
    }
    .atat-header-logo {
      display: inline-block;
      position: relative;
    }
  }
}
</style>
