import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import BAALearnMore from "./BAALearnMore.vue";

describe("Testing BAALearnMore Page", () => {
  const wrapper: VueWrapper = shallowMount(BAALearnMore);

  describe("testing BAALearnMore.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
