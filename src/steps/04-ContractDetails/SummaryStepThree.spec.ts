import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import SummaryStepThree from "./SummaryStepThree.vue";
import * as Summary from "@/store/summary";


describe('SummaryStepThree', () => {
  vi.mock("@/store/summary", async () => {
    const actual = await vi.importActual("@/store/summary") as typeof Summary;

    return {
      ...actual,
      isStepComplete: vi.fn().mockReturnValue(false),
      getSummaryItemsforStep: vi.fn().mockReturnValue({
        description: "",
        isComplete: false,
        isTouched: false,
        routeName: "",
        step: 0,
        substep: 0,
        title: ""
      }),
    }
  });

  const wrapper: VueWrapper = shallowMount(SummaryStepThree);

  describe("testing SummaryStepThree render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  it('sets the intro paragraph for a complete step', async () => {
    (Summary.isStepComplete as any).mockReturnValue(true);

    await (wrapper.vm as any).setIntroParagraph();
    expect((wrapper.vm as any).introParagraph).toContain('You are all done with this section');
  });

  it('sets the intro paragraph for an incomplete step', async () => {
    (Summary.isStepComplete as any).mockReturnValue(false);

    await (wrapper.vm as any).setIntroParagraph();
    expect((wrapper.vm as any).introParagraph).toContain('We need some more details for this' +
      ' section');
  });
});

