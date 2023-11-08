/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import SummaryStepThree from "./SummaryStepThree.vue";
import { createStore } from 'vuex';

describe('SummaryStepThree', () => {
  
  const vuetify = createVuetify({
    components,
    directives,
  })
  const actions = { 
    isStepComplete: vi.fn().mockReturnValue(false),
    getSummaryItemsforStep: vi.fn().mockReturnValue({
      description: "",
      isComplete: false,
      isTouched: false,
      routeName: "",
      step: 0,
      substep: 0,
      title: ""
    }),
  }
  const mockStore = createStore({
    modules: {
      myModule: {
        namespaced: true,
        actions
      }
    }
  })

  const wrapper: VueWrapper = shallowMount(SummaryStepThree, {
    global: {
      plugins: [mockStore,vuetify]
    }
  });

  describe("testing SummaryStepThree render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  it('sets the intro paragraph for a complete step', async () => {
    actions.isStepComplete.mockReturnValue(true); //ideally work with this through vm

    await wrapper.vm.$options.methods.setIntroParagraph();
    expect(wrapper.vm.$.data.introParagraph).toContain('You are all done with this section');
  });

  it('sets the intro paragraph for an incomplete step', async () => {
    actions.isStepComplete.mockReturnValue(false);

    await wrapper.vm.$options.methods.setIntroParagraph();
    expect(wrapper.vm.$options.methods.introParagraph)
      .toContain('We need some more details for this section');
  });
});