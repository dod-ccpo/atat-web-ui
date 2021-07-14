<template>
  <v-footer class="atat-footer">
    <v-container>
      <v-row>
        <v-col>.</v-col>
        <v-col class="body text-right"> Last login: {{ getToday() }} </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { Component } from "vue-property-decorator";
@Component({})
export default class ATATFooter extends Vue {
  private getToday() {
    return moment(new Date()).format("MMMM DD, YYYY, hh:mm Z");
  }
}
</script>

<style scoped>
.theme--light.v-footer,
v-footer.app-footer {
  z-index: 3;
  background-color: #fff;
  border-top: 1px solid #f1f1f1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4rem;
  color: #323a45;
  font-size: 1rem;
  padding: 0 1.2rem;
}
</style>
