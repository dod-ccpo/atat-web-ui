<template>
  <div>{{ pageTitle }} </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Watch} from "vue-property-decorator";

@Component({})
export default class BlankPage extends Vue {
  public pageTitle = "";

  private mounted() : void{
    const stepLabel  = this.$route.name?.replaceAll("_", " ");
    this.pageTitle = stepLabel !== "" ? "Future " + stepLabel + " page" : "Blank Page";
 
    debugger;
  }

  @Watch("$route")
  async routeChange(): Promise<void> {
    debugger;
    const stepLabel  = this.$route.name?.replaceAll("_", " ");
    this.pageTitle = stepLabel !== "" ? "Future " + stepLabel + " page" : "Blank Page";
  }
}


</script>