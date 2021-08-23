<template>
  <v-dialog :max-width="width" v-model="_showDialog">
    <v-card>
      <v-card-title class="h3"> {{ title }} </v-card-title>
      <v-card-text class="body-lg">
        {{ message }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          class="link-button no-focus-shift"
          :ripple="false"
          @click="_showDialog = false"
          >{{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          class="px-5"
          :ripple="false"
          @click="_showDialog = false"
        >
          {{ okText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop } from "vue-property-decorator";
import { VDialog } from "vuetify/lib";

@Component({})
export default class ATATModalDelete extends VDialog {
  @Prop() private message!: string;
  @Prop() private title!: string;
  @Prop({ default: "500px" }) private width!: string;
  @Prop({ default: "Cancel" }) private cancelText!: string;
  @Prop({ default: "OK" }) private okText!: string;

  @PropSync("showDialog")
  private _showDialog!: boolean;
}
</script>
