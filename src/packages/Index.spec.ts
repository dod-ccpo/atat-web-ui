import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Packages from "./Index.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

Vue.use(Vuetify);

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
      expect(router.app.$route.name).toBe("Project_Overview");
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
        expect(apStatus).toBe("");
      })
    })

    it("test updateStatus()",()=>{
      const spy = jest.spyOn(AcquisitionPackageSummary,"updateAcquisitionPackageStatus")
      wrapper.vm.updateStatus("testsysID","DELETE")
      wrapper.vm.updateStatus("testsysID","ARCHIVED")
      wrapper.vm.updateStatus("testsysID","DRAFT")
      expect(spy).toBeCalled();
    })
  
  });
});
