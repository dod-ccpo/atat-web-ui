import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import TeamMemberTable from "@/wizard/Step5/components/TeamMemberTable.vue";
import VueRouter from "vue-router";

Vue.use(Vuetify);

describe("Testing ApplicationsEnvironmentsSummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const routes = [
    {
      name: "dev",
      path: "/wizard/dev",
    },
  ];
  const router = new VueRouter({ routes });
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TeamMemberTable, {
      localVue,
      vuetify,
      router,
      propsData: {
        data: {
          member: {
            name: "Ryan",
            email: "RyanTest@test",
            permissions: [
              {
                id: "edit_team",
                label: "Edit Team",
                is_granted: true,
              },
              {
                id: "manage_environments",
                label: "Manage Environments",
                is_granted: true,
              },
            ],
            environments_settings: [
              { id: "12", label: "testlabel", accessLevel: "admin" },
            ],
          },
        },
        name: "dev",
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test GrantedPermissions  ", async () => {
    const permissions = [
      {
        id: "edit_team",
        label: "Edit Team",
        is_granted: true,
      },
    ];
    await wrapper.vm.grantedPermissions(permissions);
    expect(wrapper.vm.grantedPermissions).toBeDefined();
    await wrapper.vm.grantedPermissions([]);
  });

  it("test handleClick", async () => {
    await wrapper.vm.handleClicked("dev");
    expect(wrapper.exists()).toBe(true);
  });
});
