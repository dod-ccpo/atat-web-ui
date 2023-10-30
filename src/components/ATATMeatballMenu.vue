<template>
  <v-menu
    :offset-y="true"
    :left="left"
    :id="id + '_' + index"
    class="_meatball-menu"
    attach
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :id="id + 'Button_' + index"
        class="_meatball-menu-button"
      >
        <v-icon class="text-base-dark">more_horiz</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, idx) in processedMenuItems"
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
            :width="+item.icon.width"
            :height="+item.icon.height"
          />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>  
</template>

<script lang="ts">
import {Vue, Component, Prop } from "vue-facing-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { MeatballMenuItem } from "types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATSVGIcon,
  }
})
class ATATMeatballMenu extends Vue {
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

  get processedMenuItems() {
    return this.menuItems.map(item => ({
      ...item,
      disabled: item.disabled ?? false,  // Providing a default value if `disabled` is undefined
    }));
  }
}
export default ATATMeatballMenu;

</script>
