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
                  U.S. flag An official website of the United States government
                </span>
                <span class="USWDC-official-banner__link blue--text">
                  <v-icon
                    color="blue"
                    small
                    class="USWDC-official-banner__link_icon"
                    x-small
                    >mdi-help-circle-outline</v-icon
                  >
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
                  <v-col sm="1" md="1">
                    <img
                      src="../../public/img/icon-dot-gov.svg"
                      width="30"
                      class="USWDC-official-banner_drawer__content__icon1"
                    />
                  </v-col>
                  <v-col sm="11" md="4">
                    <h3>Official websites use .mil</h3>
                    <p>
                      A .mil website belongs to an official government
                      organization in the United States.
                    </p>
                  </v-col>
                  <v-col sm="1" md="1">
                    <img
                      src="../../public/img/icon-https.svg"
                      width="30"
                      class="USWDC-official-banner_drawer__content__icon2"
                    />
                  </v-col>
                  <v-col sm="11" md="4">
                    <h3>Secure .mil websites use HTTPS</h3>
                    <p>
                      A lock ( ) or https:// means you’ve safely connected to
                      the .mil website. Share sensitive information only on
                      official, secure websites.
                    </p>
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
        <v-col>
          <div class="atat-nav-logo">
            <img
              src="../../public/img/icons/atat-logo.svg"
              width="56"
              class="atat-nav-logo__icon"
            />
          </div>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

interface ClassificationType {
  color: string;
  text: string;
}
interface ClassificationTypeArray {
  [key: string]: ClassificationType;
}

@Component({})
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
      }
      .USWDC-official-banner_drawer__content {
        background-color: #f0f0f0;
        position: relative;
        padding-top: 2rem;
        min-height: 96px;
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
