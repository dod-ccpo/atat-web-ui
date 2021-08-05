import Vue from "vue";
import Vuetify from "vuetify";
// import { jest } from "@vue/cli-plugin-unit-jest"
Vue.use(Vuetify);
Vue.config.productionTip = false;

import buttonNav from "@/wizard/Navigation/ButtonNavigation.vue";

import { shallowMount } from "@vue/test-utils";

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
  // let shallowMountFunction: (options?: object) => Wrapper<Vue>
  let sMount: any;
  beforeEach(() => {
    sMount = shallowMount(buttonNav, {
      propsData: {
        propsData: propsData,
      },
    });
  });

  it("button navigation bar initialization", () => {
    const mountedButtons = sMount.findAll("[type=button]").length;
    const expectedButtons = propsData.NavButtonPanels[0].buttons.length;
    expect(mountedButtons === expectedButtons);
  });

  it("get pageButtonPanel function()", async () => {
    await sMount.setProps({ stepNumber: 2 });
    expect(sMount.vm.pageButtonPanel.step).toBe(2);

    await sMount.setProps({ stepNumber: 1400 });
    expect(sMount.vm.pageButtonPanel.step).toBe(1);
  });

  it("clickedAction function()", async () => {
    await sMount.vm.$emit("clickedAction", "save");
    expect(sMount.emitted().clickedAction[0][0]).toBe("save");
  });
});
