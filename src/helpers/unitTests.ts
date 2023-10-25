import { Vue } from "vue-facing-decorator";
import { VueWrapper } from "@vue/test-utils";
import { ValidationPlugin } from "@/plugins/validation";

let wrapper: VueWrapper;

export async function init(
  w: VueWrapper,
): Promise<void> {
  wrapper = w;
}

export async function generateString(length: number): Promise<string> {
  const characters =" ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for ( let i = 0; i < length - 1; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function validateInput(
  validatorName: keyof ValidationPlugin,
  props: Record<string, string> | Record<string, Record<string, string>>,
  componentRef: string,
  errorCount?: number,
): Promise<boolean> {
  let success = false;

  try {
    const mockValidator = jest.spyOn(wrapper.vm.$validators, validatorName);
    await wrapper.setProps(props); 
    expect(mockValidator).toHaveBeenCalled();

    const component = await wrapper.findComponent({ref: componentRef});

    await Vue.nextTick(async () => {
      const n = errorCount || 0;
      const errorLength = component.vm.$data.errorMessages.length;
      success = errorLength > n;
    });

    return success;
  } catch(error) {
    console.log("Error:", error);
    return success;
  }
}



