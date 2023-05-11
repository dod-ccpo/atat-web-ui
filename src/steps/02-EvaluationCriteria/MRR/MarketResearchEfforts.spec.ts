/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import MarketResearchEfforts from "@/steps/02-EvaluationCriteria/MRR/MarketResearchEfforts.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import SlideoutPanel from "@/store/slideoutPanel";

Vue.use(Vuetify);

describe("Testing MarketResearchEfforts Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    jest.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );
    vuetify = new Vuetify();
    wrapper = mount(MarketResearchEfforts, {
      vuetify,
      localVue
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("initializeSlideoutPanel() - should make a call to set the correct component to" +
    " the slideout panel", async () => {
    jest.spyOn(SlideoutPanel, 'setSlideoutPanelComponent').mockImplementation(
      () => Promise.resolve()
    );
    await wrapper.vm.initializeSlideoutPanel();
    expect(SlideoutPanel.setSlideoutPanelComponent).toHaveBeenCalled();
  });

  it("openSlideoutPanel() - should make a call to open the slideout panel", async () => {
    jest.spyOn(SlideoutPanel, 'openSlideoutPanel').mockImplementation(
      () => Promise.resolve()
    );
    const event: Event = {
      currentTarget: {} as HTMLElement
    } as unknown as Event;
    await wrapper.vm.openSlideoutPanel(event);
    expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalled();
  });
})
