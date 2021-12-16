import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ReviewTable from "@/views/wizard/Step5/components/ReviewTable.vue";
import { ApplicationMember } from "types/Portfolios";
Vue.use(Vuetify);

describe("Testing ReviewTable Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  const applicationMembersMock: ApplicationMember = {
    id: "john.smith@mail.mil",
    email: "john.smith@mail.mil",
    name: "John Smith",
    permissions: [
      {
        id: "manage_environments",
        label: "Manage Environments",
        is_granted: true,
      },
    ],
    environments_settings: [
      {
        id: "development",
        label: "Development",
        accessLevel: "Administrator",
      },
      {
        id: "testing",
        label: "Testing",
        accessLevel: "Administrator",
      },
    ],
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReviewTable, {
      router,
      localVue,
      vuetify,
      propsData: {
        application: {
          name: "Tracker",
          description: "",
          dod_components: [],
          csp: "",
          members: applicationMembersMock,
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("grantedPermissions success", async () => {
    expect(
      wrapper.vm.grantedPermissions(applicationMembersMock.permissions)
    ).toEqual(["Manage Environments"]);
  });
});
