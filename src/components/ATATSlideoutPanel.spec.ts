import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import validators from "@/plugins/validation";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

describe("ATATSlideoutPanel Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  Vue.use(Vuetify);
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);
  jest.useFakeTimers();

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSlideoutPanel, {
      localVue,
      vuetify,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("transitionEnded() should open slide out panel if class list "  +
    "contains 'v-navigation-drawer--open'", () => {
    const eventMock = {
      currentTarget: {
        classList: {
          contains: (className: string) => {
            return className === 'v-navigation-drawer--open';
          }
        }
      }
    }
    jest.spyOn(SlideoutPanel, 'openSlideoutPanel');
    wrapper.vm.transitionEnded(eventMock);
    expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalled();
  });

  it("transitionEnded() should close slide out panel if class list not " +
    "contains 'v-navigation-drawer--open'", () => {
    const eventMock = {
      currentTarget: {
        classList: {
          contains: () => {
            return false;
          }
        }
      }
    }
    jest.spyOn(SlideoutPanel, 'closeSlideoutPanel');
    wrapper.vm.transitionEnded(eventMock);
    expect(SlideoutPanel.closeSlideoutPanel).toHaveBeenCalled();
  });

  it("closeSlideoutPanel() test if clicking close button closes panel", async () => {
    await SlideoutPanel.setSlideoutPanelComponent({
      title: "dummy panel Title",
      component: {}
    })
    const button = await wrapper.findComponent(
      {ref: 'panelCloserRef'}
    )
    button.trigger('click')
    expect(await SlideoutPanel.slideoutPanelIsOpen).toBe(false);
  });

  it("set isSlideoutPanelOpen(true) is to set the boolean value of " +
  "$data.isOpen to be true", async () => {
    await wrapper.setProps({
      alwaysOpen:  true
    });
    wrapper.vm.isSlideoutPanelOpen = true;
    expect(await wrapper.vm.$data.isOpen).toBe(true);
  })

  it("set isSlideoutPanelOpen(false) is to set the boolean value of " +
  "$data.isOpen to be false", async () => {
    wrapper.vm.isSlideoutPanelOpen = false;
    expect(wrapper.vm.$data.isOpen).toBe(false);
  })

  it("get isSlideoutPanelOpen() " +
  "$data.isOpen to be false", async () => {

    //mock div
    const div = document.createElement("input");
    div.setAttribute("class", "v-overlay--active");
    document.body.appendChild(div);

    SlideoutPanel.doOpenSlideoutPanel("dummyId");
    wrapper.vm.$vuetify.breakpoint.sm = true;
    await wrapper.vm.isSlideoutPanelOpen;
    jest.advanceTimersByTime(2000);
    expect(SlideoutPanel.slideoutPanelIsOpen).toBe(true);
  })

  it("slideoutPanelToggle(true) should focus on panel title after toggling " +
    "the slide out panel", async () => {
    
    //mock div
    const div = document.createElement("input");
    div.setAttribute("id", "PanelWrap");
    document.body.appendChild(div);

    //call slideoutPanelToggle()
    await wrapper.vm.slideoutPanelToggle(true);
    Vue.nextTick();
    const panelWrap = wrapper.find("#PanelWrap");
    expect(panelWrap.element.scrollTop).toBe(0)
  });

});

