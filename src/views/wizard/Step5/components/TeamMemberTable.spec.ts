import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, mount } from "@vue/test-utils";
import TeamMemberTable from "@/views/wizard/Step5/components/TeamMemberTable.vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(Vuetify);

describe("Testing ApplicationsEnvironmentsSummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
  const store = new Vuex.Store({
    state: {
      portfolioOperators: [
        {
          display_name: "Zach Clark",
          email: "Zach.clark.ctr@navy.mil",
          access: "administrator",
          id: "562580695-3943565392-133314166-295014367",
        },
      ],
    },
  });
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
      store,
      propsData: {
        data: [
          {
            name: "app1",
            description: "test app",
            operators: [
              {
                display_name: "Zach Clark",
                email: "Zach.clark.ctr@navy.mil",
                access: "administrator",
                id: "561580695-3943565392-133314166-295014367",
              },
            ],
            environments: [
              {
                name: "Development",
                operators: [
                  {
                    display_name: "Sar",
                    email: "sar@ss.mil",
                    access: "contributor",
                    id: "3828921767-897083545-4169711873-1711730514",
                  },
                ],
                id: "2247679727-1796514614-765215127-3722248939",
              },
              {
                name: "Testing",
                operators: [
                  {
                    display_name: "Sar",
                    email: "sar@ss.mil",
                    access: "contributor",
                    id: "4176272411-1896250974-2167074280-3353590155",
                  },
                ],
                id: "2527282020-931494908-3246558546-748548897",
              },
              {
                name: "Staging",
                operators: [
                  {
                    display_name: "Sar",
                    email: "sar@ss.mil",
                    access: "read_only",
                    id: "3543956481-1104845080-2644944270-2799717884",
                  },
                ],
                id: "2028727406-1005851013-886944661-631909235",
              },
              {
                name: "Production",
                operators: [],
                id: "3603487191-1894379752-2988864848-801674135",
              },
            ],
            id: "73257629-909530589-3113378507-3185009131",
          },
          {
            name: "app2",
            description: "app2",
            operators: [
              {
                display_name: "Sammy Saxena",
                email: "sammy.saxena@hs.mil",
                access: "read_only",
                id: "940162809-1647986521-3974197534-2463217520",
              },
            ],
            environments: [
              {
                name: "Development",
                operators: [],
                id: "4219284761-2610011508-2179849022-1395475101",
              },
              {
                name: "Testing",
                operators: [],
                id: "3261060648-3142988575-2159140386-3007437720",
              },
            ],
            id: "2367297998-1668235977-3505671069-756748914",
          },
          {
            name: "app3",
            description: "app3",
            operators: [],
            environments: [
              {
                name: "Development",
                operators: [],
                id: "1399262081-2710166845-1189357112-2906113028",
              },
              {
                name: "Testing",
                operators: [],
                id: "3257337421-1639848947-2507637052-2546714813",
              },
            ],
            id: "2927258070-2429224463-4121966776-2784745036",
          },
          {
            name: "app 04",
            description: "",
            operators: [],
            environments: [
              {
                name: "Development",
                operators: [],
                id: "1307021621-1074678896-1566037725-581621056",
              },
              {
                name: "Testing",
                operators: [],
                id: "2006526322-2519006064-2387408358-2124966171",
              },
              {
                name: "Staging",
                operators: [],
                id: "938092695-2788641705-3038787397-3683398253",
              },
              {
                name: "Production",
                operators: [],
                id: "3058560492-2450828886-3136367538-3564157673",
              },
            ],
            id: "1990002903-411725093-219915659-1389852477",
          },
        ],
        name: "dev",
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test onEdit", async () => {
    await wrapper.vm.onEdit("dev");
    expect(wrapper.exists()).toBe(true);
  });
});
