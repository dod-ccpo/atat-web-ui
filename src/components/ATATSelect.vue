<template>
  <div>
    <v-flex>
      <div class="text-form-field-label my-1">DropDown Label</div>
    </v-flex>
    <v-flex>
      <v-select
        :items="items"
        outlined
        dense
        :height="42"
        :rounded="rounded"
      ></v-select>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VSelect } from "vuetify/lib";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATSelect extends VSelect {
  @Prop({
    default: () => ["Foo", "Bar", "Fizz", "Buzz"],
  })
  private items!: string[];
  //data
  private rounded = false;
}
</script>
