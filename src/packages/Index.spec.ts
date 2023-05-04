import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Packages from "./Index.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

Vue.use(Vuetify);

jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
  .mockImplementation()
describe("Testing Packages Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(VueRouter);

  const routes = [
    {
      name: "Packages",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Packages, {
      vuetify,
      localVue,
      router,
    });
  });

  describe("testing tabClicked()", () => {
    it("renders successfully", async () => {
      wrapper.vm.tabClicked("ALL");
      const activeTab = wrapper.vm.$data.activeTab
      expect(activeTab).toBe("ALL");
    });
  });

  describe("testing index functions", () => {

    it("toAcquisitions() - tests back to home", async () => {
      wrapper.vm.$data.altBackDestination = "Home";
      await wrapper.vm.toAcquisitions();
      expect(router.app.$route.name).toBe("DAPPSChecklist");
    });

    it("test tabIndex changes",()=>{
      const apStatus = wrapper.vm.$data.searchDTO.acquisitionPackageStatus
      wrapper.vm.tabIndexChanged(0)
      Vue.nextTick(()=>{
        expect(apStatus).toBe("DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER");
      })
      wrapper.vm.tabIndexChanged(1)
      Vue.nextTick(()=>{
        expect(apStatus).toBe("TASK_ORDER_AWARDED");
      })
      wrapper.vm.tabIndexChanged(2)
      Vue.nextTick(()=>{
        expect(apStatus).toBe("ARCHIVED");
      })
      wrapper.vm.tabIndexChanged(3)
      Vue.nextTick(()=>{
        expect(apStatus).toBe(
          "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER,TASK_ORDER_AWARDED,ARCHIVED");
      })
    })

    it("test updateStatus()",()=>{
      const spy = jest.spyOn(AcquisitionPackageSummary,"searchAcquisitionPackageSummaryList")
        .mockImplementation()
      wrapper.vm.updateStatus()
      expect(spy).toBeCalled();
    })

    it("test search()",()=>{
      wrapper.vm.$data.searchString = 'hello'
      wrapper.vm.search()
      const searchedString = wrapper.vm.$data.searchedString
      Vue.nextTick(()=>{
        expect(searchedString).toBe("hello");
      })
    })

    it("test clear()",()=>{
      wrapper.vm.$data.searchString = 'Hello'
      wrapper.vm.clear()
      const searchString = wrapper.vm.$data.searchString
      Vue.nextTick(()=>{
        expect(searchString).toBe("");
      })
    })
  });
});
