import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATTopNavBar from "@/components/ATATTopNavBar.vue";
Vue.use(Vuetify);

describe("Testing ATATTopNavBar Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTopNavBar, {
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("checks if menu item is active or not", async () => {
    await wrapper.setData({
      activeMenuItems: ["foo"]
    });
    let isActive = wrapper.vm.isMenuItemActive({title: "foo"});
    expect(isActive).toBeTruthy();
    isActive = wrapper.vm.isMenuItemActive({title: "bar"});
    expect(isActive).toBeFalsy();
  });

  it("sets current user initials for profile menu", async () => {
    const currentUser ={
      firstName: "Foo",
      lastName: "Bar"
    }
    let initials = wrapper.vm.getUserInitials(currentUser);
    expect(initials).toEqual("FB");

    await wrapper.setData({
      currentUser: {}
    });
    initials = wrapper.vm.getUserInitials({});
    expect(initials).toEqual("XX");

  });

  it("sets active menu item(s)", async () => {
    await wrapper.setData({
      activeMenuItems: []
    });
    wrapper.vm.navClicked({title: 'foo'});
    expect(wrapper.vm.$data.activeMenuItems.length).toBe(0);

    await wrapper.setData({
      activeMenuItems: []
    });

    wrapper.vm.navClicked({title: 'foo', spaSectionTitle: "spa section"});
    expect(wrapper.vm.$data.activeMenuItems.length).toBe(1);

    await wrapper.setData({
      activeMenuItems: []
    });

    wrapper.vm.navClicked({title: 'foo', spaSectionTitle: "spa section", parentTitle: "bar"});
    expect(wrapper.vm.$data.activeMenuItems.length).toBe(2);

    await wrapper.setData({
      activeMenuItems: []
    });

    wrapper.vm.navClicked({title: 'foo', externalUrl: 'http://foo.com'});
    expect(wrapper.vm.$data.activeMenuItems.length).toBe(0);

  });

});
