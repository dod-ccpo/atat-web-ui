<template>
  <v-footer class="atat-footer" app>
    <div class="body footer-content">Last login: {{ getToday() }}</div>
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
