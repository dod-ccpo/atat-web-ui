import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import ATATSelect from "@/components/ATATSelect.vue";
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
      vuetify = new Vuetify();
      wrapper = mount(ATATSelect, {
        localVue,
        vuetify,
      });
    });

  it("renders successfully", async () => {
    await expect(wrapper.exists()).toBe(true);
  });

  it('has a `v-select getStatusIcon` with 3 items: ["Foo", "Bar", "Fizz Tony", "Buzz"]', async () => {
      await wrapper.setData({
            rules: 'correspondingIDIQRules'
          });
      const items = wrapper.find('.v-select').props('items');
      expect(items.length).toBe(4)
      expect(items).toStrictEqual(["Foo", "Bar", "Fizz Tony", "Buzz"]);
      wrapper.findAll('.v-select').at(0).trigger('click');
      await wrapper.vm.getStatusIcon();
      expect(await wrapper.vm.$data.success).toBe(false);
    });

  it('has a `v-select onChange` with 3 items: ["Foo", "Bar", "Fizz Tony", "Buzz"]', async () => {
      const items = wrapper.find('.v-select').props('items');
      wrapper.findAll('.v-select').at(0).trigger('click');
      await wrapper.vm.onChange();
  });

  it('has a `v-select onSelectedValueChanged` with 3 items: ["Foo", "Bar", "Fizz Tony", "Buzz"]', async () => {
        const items = wrapper.find('.v-select').props('items');
        wrapper.findAll('.v-select').at(0).trigger('click');
        await wrapper.vm.onSelectedValueChanged();
  });

  it('has a v-select onErrorBucketChanged', async () => {
          const items = wrapper.find('.v-select').props('items');
          await wrapper.vm.onErrorBucketChanged();
          await wrapper.vm.getStatusIcon();
          expect(await wrapper.vm.$data.success).toBe(false);
    });

});