import { createDecorator} from 'vue-facing-decorator';

/**
 * Decorator for creating a two-way binding on a prop (sync modifier).
 * 
 * @param propName - The name of the property to sync.
 * @param options - The options for the prop (type, default, validator, etc.).
 */
export function PropSync(propName: string, options: any = {}) {
  return createDecorator((componentOptions, k) => {
    // Ensure props and computed options exist
    componentOptions.props ??= {};
    componentOptions.computed ??= {};

    // Define prop and computed prop for sync
    componentOptions.props[propName] = options;
    componentOptions.computed[k] = {
      get() {
        return this[propName];
      },
      set(value: any) {
        this.$emit(`update:${propName}`, value);
      },
    };
  });
}
