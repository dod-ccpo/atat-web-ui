<template>
  <div class="atat-header">
    <v-container fluid>
      <v-row
        class="
          classification-banner
          text-center
          light-green
          white--text
          font-weight-bold
        "
      >
        <v-col>
          <span class="classification-banner__text">
            {{ getClassificationText }}
          </span>
          <span class="classification-banner__msg">
            - {{ classificationMsg }}
          </span>
        </v-col>
      </v-row>
      <v-row class="USWDC-official-banner">
        <v-col>
          <v-expansion-panels accordion class="USWDC-official-banner_drawer">
            <v-expansion-panel>
              <v-expansion-panel-header
                class="USWDC-official-banner_drawer__header text-left"
              >
                <span class="USWDC-official-banner__flag">
                  <img
                    src="../../public/img/us_flag_small.png"
                    height="11"
                    width="16"
                  />
                </span>
                <span class="USWDC-official-banner__text">
                  An official website of the United States government
                </span>
                <span class="USWDC-official-banner__link">
                  <span
                    class="
                      USWDC-official-banner__link_msg
                      text-decoration-underline
                    "
                  >
                    Here’s how you know
                  </span>
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content
                class="USWDC-official-banner_drawer__content"
              >
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
                        connected to the .mil website. Share sensitive
                        information only on official, secure websites.
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row
        class="atat-header-nav primary_darken white--text font-weight-bold"
      >
        <v-col cols="2">
          <div class="atat-nav-logo">
            <img
              src="../../public/img/icons/atat-logo.svg"
              width="56"
              class="atat-nav-logo__icon"
            />
          </div>
        </v-col>
        <v-col cols="10" class="text-right">
          <ATATHeaderNav />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATHeaderNav from "../components/ATATHeaderNav.vue";

export interface ClassificationType {
  color: string;
  text: string;
}
export interface ClassificationTypeArray {
  [key: string]: ClassificationType;
}

@Component({
  components: {
    ATATHeaderNav,
  },
})
export default class ATATHeader extends Vue {
  private classificationTypes: ClassificationTypeArray = {
    U: {
      color: "light-green",
      text: "UNCLASSIFIED",
    },
    C: {
      color: "red darken-1",
      text: "CLASSIFIED",
    },
    T: {
      color: "red darken-1",
      text: "TOP SECRET",
    },
  };

  @Prop({ default: "U" }) private classificationType = "U";
  @Prop({ default: "Official Use Only" }) private classificationMsg =
    "Official Use Only";

  get getClassificationColor(): string {
    return this.classificationTypes[this.classificationType].color;
  }
  get getClassificationText(): string {
    return this.classificationTypes[this.classificationType].text;
  }
}
</script>
<style lang="scss">
.atat-header {
  .classification-banner .col {
    padding: 0.2rem;
    font-size: 0.7rem;
  }
  .USWDC-official-banner .col {
    padding: 0;
    font-size: 0.7rem;
    .USWDC-official-banner_drawer {
      box-shadow: none;
      border-radius: 0;
      color: #1b1b1b;
      background-color: #f0f0f0;
      .USWDC-official-banner_drawer__header {
        background-color: #f0f0f0;
        display: block;
        font-size: 0.7rem;
        padding: 0.2rem 0.5em;
        min-height: 10px;
        .v-expansion-panel-header__icon {
          display: inline-block;
        }
        .mdi:before, .mdi-set{
          color: #005EA2;

        }
        .v-icon.v-icon{
          color: #005EA2;
          font-size: 16px;
        }

      }
      .USWDC-official-banner_drawer__content {
        background-color: #f0f0f0;
        position: relative;
        padding-top: 2rem;
        min-height: 96px;
        .USWDC-official-banner__col-01,
        .USWDC-official-banner__col-02 {
          margin-left: 45px;
          display: block;
          position: relative;
          &::before {
            content: " ";
            width: 40px;
            height: 40px;
            position: absolute;
            display: block;
            left: -45px;
            margin-right: 4px;
            background-position: top center;
            background-size: 40px 40px;
            background-image: url("../../public/img/icon-dot-gov.svg");
          }
        }

        .USWDC-official-banner__col-02::before {
          background-image: url("../../public/img/icon-https.svg");
        }

        .USWDC-official-banner_drawer__content__icon2,
        .USWDC-official-banner_drawer__content__icon1 {
          position: relative;
          top: -1.5em;
          right: -2em;

        }

      }
    }

    .USWDC-official-banner__flag {
      position: relative;
      top: 3px;
      margin-right: 0.5em;
    }
    .USWDC-official-banner__link {
      text-transform: none;
      color: #005EA2;
      margin-left: 4px;
    }
    .USWDC-official-banner__link_icon {
      margin-right: 0.2em;
    }
    .USWDC-official-banner__link_msg {
      position: relative;
      top: -1px;
    }
  }
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
