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
          mission_owners: "62826bf03710200044e0bfc8bcbe5df1,0e826bf03710200044e0bfc8bcbe5d6a,bd1585b21bf901107b782f84604bcb40",
          package_status: "TASK_ORDER_AWARDED",
          project_overview: "",
          secondary_reviewers: "",
          sys_created_by: "julius.fitzhugh-ctr@ccpo.mil",
          sys_updated_on: "2022-08-29 13:52:43",
          title: "Sprint 40 Demo",
        }
      }
    });
  });

  describe("testing Funding Alert", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });


  });
});
