<template>
  <v-btn :id="id">{{ value }}</v-btn>
</template>

<script lang="ts">
import { VBtn } from "vuetify/lib";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATLinkButton extends VBtn {
  // props
  @Prop({ default: "Link_Button" }) private value!: string;
  @Prop({ default: "default-id" }) private id!: string;

}
</script>
