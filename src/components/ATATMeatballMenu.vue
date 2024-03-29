<template>
  <v-menu
    :offset="getOffset"
    location="bottom"
    :width="menuWidth"
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
        <v-icon class="text-base-dark">mdi-dots-horizontal</v-icon>
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
import {Vue, Component, Prop, toNative, Emit } from "vue-facing-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { MeatballMenuItem } from "types/Global";
import { getIdText } from "@/helpers";

@Component({
  emits:["menuItemClick"],
  components: {
    ATATSVGIcon,
  }
})
class ATATMeatballMenu extends Vue {
  @Prop() public id!: string;
  @Prop({ default: false }) public left?: boolean;
  @Prop({ default: 0 }) public index!: number;
  @Prop() public menuItems!: MeatballMenuItem[];
  @Prop({ default: 200 }) public menuWidth!: number;
  

  private getIdText(string: string) {
    return getIdText(string);
  }
  @Emit("menuItemClick")
  public menuItemClick(item: MeatballMenuItem): void {
    this.$emit("menuItemClick", item, this.index);
  }

  get processedMenuItems() {
    return this.menuItems.map(item => ({
      ...item,
      disabled: item.disabled ?? false,  // Providing a default value if `disabled` is undefined
    }));
  }

  public get getOffset(): string {
    return this.left ?
      "0 " + String(this.menuWidth - 28): // button width is 28
      "0";
  }
}
export default toNative(ATATMeatballMenu)

</script>
