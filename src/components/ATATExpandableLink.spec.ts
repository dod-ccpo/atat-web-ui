import { describe, it, expect, vi } from 'vitest';
import { shallowMount, VueWrapper } from "@vue/test-utils";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import { DefaultProps } from "vue/types/options";

describe("Testing ATATSelect Component", () => {
 
  let wrapper:VueWrapper
  const ariaId = "MyId";
  let expandLink: any

  // beforeEach(() => {
  //   vuetify = new Vuetify();
  //   wrapper = mount(ATATExpandableLink, {
  //     localVue,
  //     vuetify,
  //     propsData: {
  //       ariaId,
  //     }
  //   });
  //   
  // });
  

  describe("INITIALIZATION", () => { 
    const wrapper:VueWrapper = shallowMount(ATATExpandableLink, {
      props: {
        ariaId
      },
      global: {
        plugins: []
      }
    })

    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  

    describe("EVENTS", () => {
      it("test click event to expand -- link class will contain open", async () => {
        (wrapper.vm as any).isOpen = true;
        await wrapper.vm.$nextTick();
        expandLink = wrapper.find(".expandable-content-opener");
        console.log(expandLink)
        expect(expandLink.classes()).toContain("open");
      });

      it("test click event to expand -- link class will contain closed", async () => {
        (wrapper.vm as any).isOpen = true;
        await wrapper.vm.$nextTick();
        expandLink.trigger("keydown.enter");
        await wrapper.vm.$nextTick();
        expect(expandLink.classes()).toContain("closed");
      });
    });
  });
});
