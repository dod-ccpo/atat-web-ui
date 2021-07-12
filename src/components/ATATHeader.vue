<template>
  <div class="atat-header">
    <v-container fluid>
      <v-row
        class="classification-banner text-center light-green white--text font-weight-bold"
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
      <v-row class="USWDC-official-banner ">
        <v-col>
          <span class="USWDC-official-banner__flag">
            <img src="../../public/img/us_flag_small.png"
                 height="11"
                 width="16"/>
          </span>
          <span class="USWDC-official-banner__text">
            U.S. flag An official website of the United States government
          </span>
          <v-btn class="USWDC-official-banner__link blue--text"
                 x-small
                 text>
            <v-icon color="blue" small class="USWDC-official-banner__link_icon" x-small>mdi-help-circle-outline</v-icon>
            <span class="USWDC-official-banner__link_msg"> Here’s how you know </span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="atat-header-nav primary_darken white--text font-weight-bold">
        <v-col>
          <div>ATAT</div>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATHeader extends Vue {
  private classificationTypes: any = {
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
   border: blue 2px solid;
   .classification-banner .col{
     padding: .2rem;
     font-size: .7rem;
   }
   .USWDC-official-banner .col{
     padding: .2rem;
     font-size: .7rem;
     .USWDC-official-banner__flag {
       position: relative;
       top: 3px;
       margin-right: .5em;
     }
     .USWDC-official-banner__link{
       text-transform: none;
     }
     .USWDC-official-banner__link_icon {
       margin-right: .2em;
     }
     .USWDC-official-banner__link_msg {
       position: relative;
       top: -1px;
     }
   }
 }
</style>
