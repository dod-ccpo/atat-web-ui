import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import { AutoCompleteItem } from "types/Global";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATAutoComplete Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const items: AutoCompleteItem[] =  [
    {
      Id: 1,
      FullName: "Test Data01",
      Email: "tony.civ@mail.mil",
      Phone: "555-555-5555",
      OrgName: "HQ1234 - Corresponding Organization Name"
    },
    {
      Id: 2,
      FullName: "Carl Contractingofficerep",
      Email: "carl.contractingofficerrep.civ@mail.mil",
      Phone: "555-555-5555",
      OrgName: "HQ1234 - Corresponding Organization Name"
    },
    {
      Id: 3,
      FullName: "Selia Wentzel",
      Email: "sel.wentz@acusage.net",
      Phone: "444-444-4444",
      OrgName: "HQ567 - Other Organization Name"
    },
  ];


  const searchFields = ['FullName'];
  const id="dummyAutoComplete";
  const label="Dummy Auto Complete";
  const titleKey = "value";
  

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAutoComplete, {
      localVue,
      vuetify,
      propsData: {
        items,
        searchFields,
        id,
        label,
        titleKey,
        rules: [(v: string) => !!v || "is required"],
      }
    });
  });
  describe("INITIALIZATION", () => { 
      it("renders successfully", async () => {
        expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("optional", async()=>{
      await wrapper.setProps({optional: true});
      expect(wrapper.find(".optional")).toBeDefined;
      
      await wrapper.setProps({optional: false});
      expect(wrapper.find(".optional")).toBeUndefined;
    });
  });

  describe("DATA", () => { 
    it("items.length", async () => {
      const select =  wrapper.find('.v-select');
      const items = select.props('items');
      expect(items.length).toBe(3);
    }); 
  });
 
  describe("FUNCTIONS", () => {
    it("onChange", async () => {
      const spy = jest.spyOn(wrapper.vm, "onChange");
      const changedValue = {
        Id: 2,
        FullName: "Carl Contractingofficerep",
        Email: "carl.contractingofficerrep.civ@mail.mil",
        Phone: "555-555-5555",
        OrgName: "HQ1234 - Corresponding Organization Name"
      };
      wrapper.vm.onChange(changedValue);
      expect(spy).toHaveBeenCalled();
    });

    it("customFilter > returns true", async () => {
      const item = {
        Id: 2,
        FullName: "Carl Contractingofficerep",
        Email: "carl.contractingofficerrep.civ@mail.mil",
        Phone: "555-555-5555",
        OrgName: "HQ1234 - Corresponding Organization Name"
      };
      const queryText = "car";
      expect(wrapper.vm.customFilter(item, queryText)).toBe(true);
    });
    it("customFilter > returns false", async () => {
      const item =     {
        Id: 3,
        FullName: "Selia Wentzel",
        Email: "sel.wentz@acusage.net",
        Phone: "444-444-4444",
        OrgName: "HQ567 - Other Organization Name"
      };
      const queryText = "bad-input-data";
      expect(wrapper.vm.customFilter(item, queryText)).toBe(false);
    });
    it("noResultsAction", async () => {
      const spy = jest.spyOn(wrapper.vm, "noResultsAction");
      wrapper.vm.noResultsAction();
      expect(spy).toHaveBeenCalled();
    });
  })

  describe("COMPUTED FIELDS", () => {
    it("inputClass() > 'dummy-icon'", async () => {
      const iconName = "dummy-icon";
      const autoComplete = wrapper.find('.v-autocomplete');
      await wrapper.setProps({icon: iconName});
      expect(autoComplete.classes()).toContain("is-" + iconName + "-icon");
     });
     it("inputClass() > 'search'", async () => {
      const iconName = "search";
      const autoComplete = wrapper.find('.v-autocomplete');
      await wrapper.setProps({icon: iconName});
      expect(autoComplete.classes()).toContain("icon-no-rotate");
     });
  })

});
