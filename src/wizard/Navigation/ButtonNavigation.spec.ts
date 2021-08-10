import Vue from "vue";
import Vuetify from "vuetify";
import buttonNav from "@/wizard/Navigation/ButtonNavigation.vue";
import { createLocalVue, mount } from "@vue/test-utils";

Vue.use(Vuetify);

const propsData = {
  NavButtonPanels: [
    {
      step: 1,
      buttons: [
        {
          text: "Save and Close",
          link: true,
          id: "save_and_close",
          action: ["save", "close"],
        },
        {
          id: "add_funding",
          text: "Next: Add Funding",
          color: "primary",
          action: ["next"],
        },
      ],
    },
    {
      step: 2,
      buttons: [
        {
          text: "Cancel",
          link: true,
          id: "cancel",
          action: ["cancel"],
        },
        {
          text: "Previous",
          outlined: true,
          id: "previous",
          color: "primary",
          action: ["previous"],
        },
        {
          text: "Next",
          color: "primary",
          id: "next",
          action: ["next"],
        },
      ],
    },
  ],
};

describe("Testing Button Navigation Bar", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify= new Vuetify();
    wrapper = mount(buttonNav, {
      localVue,
      vuetify,
      propsData: {
        propsData: propsData,
      }
    })
  });

  it("button navigation bar initialized", () => {
    const mountedButtons = wrapper.findAll("[type=button]").length;
    const expectedButtons = propsData.NavButtonPanels[0].buttons.length;
    expect(mountedButtons === expectedButtons);
  });

  it('Next button clicked', async () => {    
    await wrapper.find("#step_1_navbtn_add_funding").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$emit("clickedAction", "save");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().clickedAction[0][0]).toBe("save");
   })

  it("get pageButtonPanel function()", async () => {
    await wrapper.setProps({ stepNumber: 2 });
    expect(wrapper.vm.pageButtonPanel.step).toBe(2);

    await wrapper.setProps({ stepNumber: 1400 });
    expect(wrapper.vm.pageButtonPanel.step).toBe(1);
  });

  it("clickedAction function()", async () => {
    await wrapper.vm.$emit("clickedAction", "save");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().clickedAction[0][0]).toBe("save");
  });
});
