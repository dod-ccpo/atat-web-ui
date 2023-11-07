import { createDecorator} from 'vue-facing-decorator';
import { PropsConfig } from 'vue-facing-decorator/dist/option/props';

/**
 * Decorator for creating a two-way binding on a prop (sync modifier).
 * 
 * @param propName - The name of the property to sync.
 * @param options - The options for the prop (type, default, validator, etc.).
 */
export function PropSync(propName: string, options: PropsConfig = {}) {
  return createDecorator((componentOptions, k: string) => {
    // Ensure props and computed options exist
    componentOptions.emits = [...componentOptions.emits, `update:${propName}`]
    componentOptions.props ??= {};
    componentOptions.computed ??= {};
    // Define prop and computed prop for sync
    componentOptions.props[propName] = options;
    componentOptions.computed[k] = {
      get() {
        return this[propName];
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(value: any) {
        this.$emit(`update:${propName}`, value);
      },
    };
  });
}
