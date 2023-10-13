import UnitTestingMockComponent from "@/steps/UnitTestingMockComponent.vue"
import { shallowMount } from "@vue/test-utils";
import * as SOL from "./saveOnLeave";
import { Route } from "vue-router";

const mockRouter = {
  push: jest.fn(),
}

const to: Route ={
  path: "/toComponent",
  hash: "",
  query: {"packageId": "1"},
  params: {"direction": "next"},
  fullPath: "/to",
  matched: [],
}

const from: Route ={
  path: "/fromComponent",
  hash: "",
  query: {"packageId": "1"},
  params: {"direction": "next"},
  fullPath: "/from",
  matched: [],
}

describe('saveOnLeave mixin', function () {
  const wrapper = shallowMount(UnitTestingMockComponent, {
    mixins: [SOL.default],
    mocks: {
      $router: mockRouter
    }
  });
  

  it("beforeRouteLeave()=> ", async()=>{
    jest.spyOn(wrapper.vm, "saveOnLeave").mockReturnValue(true);
    await wrapper.vm.$options.beforeRouteLeave(to, from)
    expect(to.params.direction).toBe("next");
  })



  it('returnToSummary(7) => mock route to `Summary_Step_Seven`', async()=>{
    await wrapper.vm.returnToSummary(7);
    expect(mockRouter.push).toHaveBeenCalledWith({
      "name":  "Summary_Step_Seven",
      "params": {
        "direction": "next"
      },
    });
  })

});
