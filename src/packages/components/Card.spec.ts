import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Card from "./Card.vue";

Vue.use(Vuetify);

describe("Testing Card Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Card, {
      vuetify,
      localVue,
      propsData: {
        cardData : {
          /* eslint-disable camelcase */
          contract_award: "",
          // eslint-disable-next-line max-len
          mission_owners: "62826bf03710200044e0bfc8bcbe5df1,e0c4c728875ed510ec3b777acebb356f,bd1585b21bf901107b782f84604bcb40",
          package_status: "DRAFT",
          project_overview: "",
          secondary_reviewers: "",
          sys_created_by: "test@.mil",
          contributors: "",
          sys_updated_on: "2022-08-29 13:52:43",
          title: "Sprint 40 Demo",
        }
      }
    });
  });

  describe("testing Card component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('test different statuses',()=>{
      wrapper.vm.$props.cardData.package_status = 'WAITING_FOR_SIGNATURES';
      wrapper.vm.loadOnEnter()
      const status1 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status1).toBe("WAITING FOR SIGNATURES");

      wrapper.vm.$props.cardData.package_status = 'WAITING_FOR_TASK_ORDER';
      wrapper.vm.loadOnEnter()
      const status2 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status2).toBe("WAITING FOR TASK ORDER");

      wrapper.vm.$props.cardData.package_status = 'TASK_ORDER_AWARDED';
      wrapper.vm.loadOnEnter()
      const status3 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status3).toBe("TASK ORDER AWARDED");

      wrapper.vm.$props.cardData.package_status = 'ARCHIVED';
      wrapper.vm.loadOnEnter()
      const status4 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status4).toBe("ARCHIVED");
    })

  });
});
