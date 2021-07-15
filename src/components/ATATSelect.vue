<template>
  <div :id="id + '_dropdown_field_control'" class="atat-select">
    <v-flex>
      <label
        :id="id + '_dropdown_field_label'"
        class="form-field-label my-1"
        :for="id + '_dropdown'"
      >
        DropDown Label
      </label>
    </v-flex>
    <v-flex>
      <v-select
        :id="id + '_dropdown'"
        :items="items"
        outlined
        dense
        :height="42"
        :rounded="rounded"
      >
        <template v-slot:selection="{ item }">
          {{ item }}
        </template>
        <template v-slot:item="{ item, on }">
          <v-list-item v-on="on">
            <!-- <v-list-item-action>
              <v-checkbox :input-value="active"></v-checkbox>
            </v-list-item-action> -->
            <v-list-item-content
              :id="id + '_dropdown_list_item_' + item.replace(/ /g, '_')"
            >
              <v-list-item-title class="body">
                <v-row no-gutters align="center">
                  <span>{{ item }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VSelect } from "vuetify/lib";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATSelect extends VSelect {
  @Prop({
    default: () => ["Foo", "Bar", "Fizz Tony", "Buzz"],
  })
  private items!: string[];
  @Prop({ default: "id_is_missing" }) private id!: string;

  //data
  private rounded = false;
}
</script>
