import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import MemberCard from "@/portfolio/components/MemberCard.vue";
Vue.use(Vuetify);

describe("Testing MemberCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(MemberCard, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing MemberCard Component Functions", () => {
    wrapper.setProps({
      members: {
        email: "maria.missionowner@mail.mil",
        firstName: "Maria",
        lastName: "Missionowner",
        phoneNumber: "5555555555",
        role: "Manager",
        title: "optinal title",
      }
    })

    it('it should return the initials of the user', ()=>{
      const initialResults = wrapper.vm.getUserInitials();
      expect(initialResults).toBe("MM")
    })
    it('it should return the phoneNumber formated (123) 456-7890', ()=>{
      const phoneNumerResults = wrapper.vm.formatPhoneNumber();
      expect(phoneNumerResults).toBe("(555) 555-5555")
    })

  })
})
