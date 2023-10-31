<template>
  <div class="_divider-wrap">
    <div 
      v-if="badgeText"
      :class="[ '_divider-badge', 'bg-' + badgeColor ]"
    >
      {{ badgeText }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, toNative } from "vue-facing-decorator";

@Component({})
class ATATDivider extends Vue {
  @Prop() badgeText?: string;
  @Prop({ default: "base-lightest" }) badgeColor?: string;
}
export default ATATDivider;
</script>
