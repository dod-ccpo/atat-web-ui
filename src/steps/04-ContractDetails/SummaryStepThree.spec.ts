import { createApp } from 'vue';
import { VueWrapper, mount} from "@vue/test-utils";
import SummaryStepThree from "./SummaryStepThree.vue"
import Summary,  {isStepComplete} from "../../store/summary";
import vuetify from '@/plugins/vuetify';
import { describe, expect, test, vi, Mock } from "vitest";
vi.mock("../../store/summary")

describe("Testing SummaryStepThree Component", () => {
  const summaryStepThree = createApp(SummaryStepThree);
  const wrapper = mount(summaryStepThree, {
    // global: {
    //   plugins: [vuetify]
    // },
  });
 
  // beforeEach(() => {
  //   jest.spyOn(Summary, "validateStepThree").mockImplementation();
  // });


  // describe("testing SummaryStepThree render", () => {
  //   test("renders successfully", async () => {
  //     expect(wrapper.exists()).toBe(true);
  //   });
  // })

  describe("GETTERS", () => {
    // describe("introParagraph()=> ", () => {
      test("returns `We need some more details` statement", async () => {
        // expect(true)
       
        vi.mock("../../store/summary", "isStepComplete").mockReturnValue(false)
        wrapper.vm.$.exposed?.setIntroParagraph()
        //expect(wrapper.vm.$.data.introParagraph).toContain("We need some more details");
      });
      // it("returns `You are all done` statement", async () => {
      //   jest.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(true);
      //   wrapper.vm.$.exposed?.setIntroParagraph()
      //   expect(wrapper.vm.$.data.introParagraph).toContain("You are all done");
      // });
    // })
  })

  // describe("FUNCTIONS", () => {
  //   it("saveOnLeave()=> expect function to be called", async () => {
  //     const toggleButtonColorMock = jest.spyOn(Summary, "toggleButtonColor").mockImplementation(
  //       ()=> Promise.resolve()
  //     );
  //     await wrapper.vm.$.exposed?.saveOnLeave();
  //     expect(toggleButtonColorMock).toHaveBeenCalled();
  //   });
  // })


})
