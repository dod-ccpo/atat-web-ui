import Vue from "vue";
import Vuetify from "vuetify";
import { Wrapper, createLocalVue, shallowMount, mount } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import DAPPSChecklist from "@/steps/01-AcquisitionPackageDetails/DAPPSChecklist.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";

const mockedSaveOnLeaveMixin = {
  methods: {
    saveOnLeave() { return true; },
    beforeRouteLeave() {return;}
  }
}
describe("Testing this stupid thing ", () => {

  it("does shit", async () => {
    const mockedComponent = {
      ...DAPPSChecklist,
      mixins: [mockedSaveOnLeaveMixin]
    }
    const localVue = createLocalVue();
    const wrapper = mount(mockedComponent, {
      localVue,
    });
    expect(wrapper.exists()).toBe(true);
  });
})
// describe("Testing DAPPSChecklist component ", () => {
//   const localVue = createLocalVue();
//   //localVue.use(Vuetify);
//   localVue.use(validators);

//   let vuetify: Vuetify;
//   let wrapper: Wrapper<DefaultProps & Vue, Element>;

//   beforeEach(() => {
//     vuetify = new Vuetify();
//     wrapper = shallowMount(DAPPSChecklist, {
//       localVue,
//       vuetify,
//     });
//   });

//   afterEach(()=>{
//     jest.clearAllMocks();
//   })

//   it("renders successfully", async () => {
//     expect(wrapper.exists()).toBe(true);
//   });

//   it.skip("openSlideOut() properly evaluates event object for null ", async () => {
//     const spy = jest.spyOn(SlideoutPanel,'openSlideoutPanel');
//     spy.mockImplementation(jest.fn());
//     await (wrapper.vm as any).openSlideoutPanel(undefined);
//     expect(spy).not.toHaveBeenCalled();

//     const anchor = wrapper.find("#LearnMoreGInvoicing");
//     anchor.trigger('click');
//     expect(spy).toHaveBeenCalled();
//   })
  
// });

