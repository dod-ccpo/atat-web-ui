<template>
  <v-menu
    :offset-y="true"
    :left="left"
    :id="id + '_' + index"
    class="_meatball-menu"
    attach
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        :id="id + 'Button_' + index"
        class="_meatball-menu-button"
      >
        <v-icon class="text-base-dark">more_horiz</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, idx) in menuItems"
        :key="idx"
        :id="getIdText(item.title) + '_MenuItem' + index"
        :class="[
          { '_separator-before': item.separatorBefore },
          { '_disabled': item.disabled },
          {'d-none': item.hidden },
        ]"
        @click="menuItemClick(item)"
        :disabled="item.disabled"
      >
        <v-list-item-title>
          {{ item.title }}
          <ATATSVGIcon
            v-if="item.icon"
            :name="item.icon.name"
            :color="item.icon.color"
            :width="item.icon.width"
            :height="item.icon.height"           
          />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { MeatballMenuItem } from "types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class ATATMeatballMenu extends Vue {
  @Prop() public id!: string;
  @Prop({ default: false }) public left?: boolean;
  @Prop({ default: 0 }) public index!: number;
  @Prop() public menuItems!: MeatballMenuItem[];

  private getIdText(string: string) {
    return getIdText(string);
  }

  public menuItemClick(item: MeatballMenuItem): void {
    this.$emit("menuItemClick", item, this.index);
  }

}


</script>
