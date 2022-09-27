import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import validators from "@/plugins/validation";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import {VBtn} from "vuetify/lib/components";

describe("ATATSlideoutPanel Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  Vue.use(Vuetify);
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);
  jest.useFakeTimers()

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSlideoutPanel, {
      /**
       * mounting 'data()' and 'computed' are a way to mock and alter the computed properties of
       * a component in the test cases
       */
      data() {
        return {
          computedTitle: null,
          computedIsSlideoutPanelOpen: false
        };
      },
      computed: {
        panelTitle: {
          get() {
            // @ts-ignore
            return this.computedTitle;
          },
          set(val) {
            // @ts-ignore
            this.computedTitle = val;
          }
        },
        /*isSlideoutPanelOpen: {
          get() {
            // @ts-ignore
            return this.computedIsSlideoutPanelOpen;
          },
          set(val) {
            // @ts-ignore
            this.computedIsSlideoutPanelOpen = val;
          }
        }*/
      },
      localVue,
      vuetify,
      provide: {
        SlideoutPanel,
        document
      }
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should not attach the title tag in the DOM if not set", async () => {
    expect(wrapper.find('#PanelTitle').element).not.toBeInTheDOM();
  });

  it("should display the title in the DOM when set", async () => {
    wrapper.vm.panelTitle = 'TEST TITLE 2';
    await wrapper.vm.$nextTick(); // without this line the updated panel title will not render
    const titleTag = wrapper.find('#PanelTitle');
    expect(titleTag.text()).toEqual('TEST TITLE 2'); // computed title must be set during the mount
  });

  it("should return the panel title that is set'", async () => {
    wrapper.vm.panelTitle = 'TEST TITLE 3';
    await wrapper.vm.$nextTick(); // without this line the updated panel title will not render
    expect(wrapper.vm.panelTitle).toEqual('TEST TITLE 3');
  });

  it("should open slide out panel if class list contains 'v-navigation-drawer--open'", () => {
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

  it("should close slide out panel if class list not contains 'v-navigation-drawer--open'",
    () => {
      const eventMock = {
        currentTarget: {
          classList: {
            contains: (className: string) => {
              return false;
            }
          }
        }
      }
      jest.spyOn(SlideoutPanel, 'closeSlideoutPanel');
      wrapper.vm.transitionEnded(eventMock);
      expect(SlideoutPanel.closeSlideoutPanel).toHaveBeenCalled();
    });

  it("should close slide out panel on close button click'", async () => {
    jest.spyOn(SlideoutPanel, 'closeSlideoutPanel');
    wrapper.vm.panelTitle = 'TEST TITLE 4';
    await wrapper.vm.$nextTick();
    await wrapper.findComponent(VBtn).trigger('click')
    expect(SlideoutPanel.closeSlideoutPanel).toHaveBeenCalled();
  });

  /*it("should set the boolean value of 'isSlideoutPanelOpen'", async () => {
    wrapper.vm.isSlideoutPanelOpen = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSlideoutPanelOpen).toEqual(true);
  });*/

  it("should focus on panel title after toggling the slide out panel", async () => {
    // @ts-ignore
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      return {
        focus() {
          return null;
        },
        scrollTop: -1
      }
    });
    wrapper.vm.slideoutPanelToggle(true);
    await wrapper.vm.$nextTick();
    expect(document.getElementById).toHaveBeenCalledWith('PanelTitle');
  });

  /*it("should focus on slide out panels opener id after panel toggles to closed state", async () => {
    jest.spyOn(document, 'getElementById');
    wrapper.vm.slideoutPanelToggle(false);
    wrapper.vm.isSlideoutPanelOpen = false;
    await wrapper.vm.$nextTick();
    expect(document.getElementById).not.toHaveBeenCalledWith('PanelTitle');
  });*/

});

