<template>
  <div>{{ pageTitle }} </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

@Component({})
export default class BlankPage extends Vue {
  public pageTitle = "";

  private mounted() : void{
    debugger;
    const stepLabel  = this.$route.name?.replaceAll("_", " ");
    this.pageTitle = stepLabel !== "" ? "Future " + stepLabel + " page" : "Blank Page";
  }
}
</script>