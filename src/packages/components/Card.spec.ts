import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Card from "./Card.vue";
import UserStore from "@/store/user";

Vue.use(Vuetify);

describe("Testing Card Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    UserStore.setCurrentUser(UserStore.getInitialUser);
    UserStore.setInitialized(true);
    wrapper = mount(Card, {
      vuetify,
      localVue,
      propsData: {
        cardData : {
          /* eslint-disable camelcase */
          contract_award: {value:"",display_value:""},
          // eslint-disable-next-line max-len
          mission_owners:
              {value:"62826bf03710200044e0bfc8bcbe5df1,e0c4c728875ed510ec3b777acebb356f"
                ,display_value:""},
          package_status: {value:"DRAFT",display_value:"DRAFT"},
          project_overview:{value:"",display_value:""} ,
          secondary_reviewers:{value:"",display_value:""},
          sys_created_by: "test@.mil",
          contributors:{value:"",display_value:""},
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

    it.skip('test different statuses',()=>{
      wrapper.vm.$props.cardData.package_status.display_value = 'WAITING FOR SIGNATURES';
      wrapper.vm.$props.cardData.package_status.value = 'WAITING_FOR_SIGNATURES';
      wrapper.vm.loadOnEnter()
      const status1 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status1).toBe("WAITING FOR SIGNATURES");

      wrapper.vm.$props.cardData.package_status.display_value = 'WAITING FOR TASK ORDER';
      wrapper.vm.$props.cardData.package_status.value = 'WAITING_FOR_TASK_ORDER';
      wrapper.vm.loadOnEnter()
      const status2 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status2).toBe("WAITING FOR TASK ORDER");

      wrapper.vm.$props.cardData.package_status.display_value = 'TASK ORDER AWARDED';
      wrapper.vm.$props.cardData.package_status.value = 'TASK_ORDER_AWARDED';
      wrapper.vm.loadOnEnter()
      const status3 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status3).toBe("TASK ORDER AWARDED");

      wrapper.vm.$props.cardData.package_status.display_value = 'ARCHIVED';
      wrapper.vm.$props.cardData.package_status.value = 'ARCHIVED';
      wrapper.vm.loadOnEnter()
      const status4 = wrapper.vm.$data.modifiedData.packageStatus;
      expect(status4).toBe("ARCHIVED");
    })

    it('test cardMenuClick()',()=>{
      const archiveItem={
        action: "Archive acquisition"
      }
      const deleteItem={
        action: "Delete acquisition package"
      }
      const showArchive = wrapper.vm.$data.showArchiveModal
      expect(showArchive).toBe(false);
      wrapper.vm.cardMenuClick(archiveItem)
      Vue.nextTick(()=>{
        expect(showArchive).toBe(true);
      })

      const showDelete = wrapper.vm.$data.showDeleteModal
      expect(showDelete).toBe(false);
      wrapper.vm.cardMenuClick(deleteItem)
      Vue.nextTick(()=>{
        expect(showDelete).toBe(true);
      })
    })

  });
});
