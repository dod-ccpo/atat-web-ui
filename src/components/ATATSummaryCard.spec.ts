import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ATATSummaryCard from "@/components/ATATSummaryCard.vue";
import { ATATSummaryCards, ATATSummaryCardItem } from "types/Wizard";
Vue.use(Vuetify);

describe("Testing ATATSummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  let mockcard: ATATSummaryCardItem = {
          type: "TASK ORDER",
          title: "TaskOrder_0001",
          showChevronRight: true,
          items: [
            {
              title: "CLINS",
              prefix: "",
              value: 1,
            },
            {
              title: "Total Value",
              prefix: "$",
              value: 500000,
            },
            {
              title: "Obligated Funds",
              prefix: "$",
              value: 200000,
            },
          ],
          leftButtonText: "Edit",
          rightButtonText: "Delete",
        };

    const portfolioCard: ATATSummaryCardItem = {
          id: "portId_1",
          type: "PORTFOLIO",
          title: "Mock Portfolio",
          description: "Mock Portfolio for testing cards",
          showChevronRight: true,
          leftButtonText: "OPEN",
          rightButtonText: "DELETE",
        };

    const applicationCard: ATATSummaryCardItem = {
              type: "APPLICATION",
              id: "application_1",
              title: "Mock Application",
              description: "Mock Application for testing cards",
              showChevronRight: true,
              groupedItemsHeader: "Environments",
              leftButtonText: "Edit",
              rightButtonText: "Delete",
            };

   const validPropsData = {
      data: { cards: [ mockcard ]  }
   };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSummaryCard, {
      router,
      localVue,
      vuetify,
      propsData: validPropsData,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

 it('left button click success', async () => {
    const leftButton = await wrapper.find("#Edit_0");
    expect(leftButton.exists()).toBe(true);
    await leftButton.trigger("click");
    await wrapper.vm.leftButtonClicked(mockcard);
  });

  it('right button click success', async () => {
      const leftButton = await wrapper.find("#Delete_1");
      expect(leftButton.exists()).toBe(true);
      await leftButton.trigger("click");
      await wrapper.vm.rightButtonClicked(mockcard);
   });

  it('onDelete click success', async () => {
      await wrapper.setProps({showDialogWhenClicked: true});
      const leftButton = await wrapper.find("#Delete_1");
      expect(leftButton.exists()).toBe(true);
      await leftButton.trigger("click");
      await wrapper.vm.rightButtonClicked(mockcard);

      const deleteDialog = wrapper.find('button');
      expect(deleteDialog.exists()).toBe(true);
      await deleteDialog.trigger("click");
      await wrapper.vm.onDelete();
  });

  it('truncateText success', async () => {
      expect(wrapper.vm.truncateText(mockcard.title, 10)).toBe("TaskOrder...");
  });

  it('deleteItem success', async () => {
      await wrapper.setData({
        isItemDeleted: true,
      });
      await wrapper.vm.deleteItem();
  });

  it('PORTFOLIO update success', async () => {
      await wrapper.setProps({
         data: { cards: [ portfolioCard ]  }
      });
      expect(wrapper.vm.truncateText(portfolioCard.title, 10)).toBe("Mock Port...");
    });

  it('left button click for portfolio success', async () => {
      const leftButton = wrapper.find('button');
      expect(leftButton.exists()).toBe(true);
      await leftButton.trigger("click");
      await wrapper.vm.leftButtonClicked(portfolioCard);
  });

  it('right button click for portfolio success', async () => {
      const leftButton = await wrapper.find("#Delete_1");
      expect(leftButton.exists()).toBe(true);
      await leftButton.trigger("click");
      await wrapper.vm.rightButtonClicked(portfolioCard);
  });

  it('APPLICATION update success', async () => {
        await wrapper.setProps({
           data: { cards: [ applicationCard ]  }
        });
        expect(wrapper.vm.truncateText(applicationCard.title, 10)).toBe("Mock Appl...");
      });

  it('left button click for portfolio success', async () => {
        const leftButton = wrapper.find('button');
        expect(leftButton.exists()).toBe(true);
        await leftButton.trigger("click");
        await wrapper.vm.leftButtonClicked(applicationCard);
  });

  it('right button click for portfolio success', async () => {
        const leftButton = await wrapper.find("#Delete_1");
        expect(leftButton.exists()).toBe(true);
        await leftButton.trigger("click");
        await wrapper.vm.rightButtonClicked(applicationCard);
  });

});