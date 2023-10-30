import { createDecorator} from 'vue-facing-decorator'
import { PropsConfig } from 'vue-facing-decorator/dist/option/props'
//TODO: REFACTOR AFTER VUE 3 UPGRADE

//https://morioh.com/a/9876aadb338e/vuejs-and-property-decorator#PropSync
//https://github.com/kaorun343/vue-property-decorator/blob/master/src/decorators/PropSync.ts  


/**
 * 
 * @param prefix - the string given as the first argument to the decorator
 * @param options - the same options object that's normally passed 
 * as the second argument to a `@Props` decorator
 */
export function PropSync(prefix: string, options?: PropsConfig) {
  /**
   * 
   * @param component - the options API version of the component being decorated
   * @param key - the name of the variable being decorated
   */
  return createDecorator(function (component, key) {

    if (prefix === 'value') {
      console.log(component)
    }

    const newComponent = {
      ...component,
      props: {
        ...component.props,
        [prefix]: options ?? {},
      },
      emits: [...component.emits, key],
      watch: {
        ...component.watch,
        [key]: {
          key: key,
          handler: (newValue: any) => { console.log(newValue) }
        }
      }
    }

    if (prefix === 'value') {
      console.log(newComponent)
    }

    return newComponent



    // return {
    //   props: {
    //     name: {
    //       type: String,
    //     },
    //   },
    //   computed: {
    //     syncedName: {
    //       get() {
    //         return this.name
    //       },
    //       set(value) {
    //         this.$emit('update:name', value)
    //       },
    //     },
    //   },
    // }

    // prototype
    // export default {
    //     props: {
    //       name: {
    //         type: String,
    //       },
    //     },
    //     computed: {
    //       syncedName: {
    //         get() {
    //           return this.name
    //         },
    //         set(value) {
    //           this.$emit('update:name', value)
    //         },
    //       },
    //     },
    //   }

    // //from old propsync 
    // export function PropSync(
    //   propName: string,
    //   options: PropOptions | Constructor[] | Constructor = {},
    // ) {
    //   return (target: Vue, key: string) => {
    //     applyMetadata(options, target, key)
    //     createDecorator((componentOptions, k) => {
    //       ;(componentOptions.props || (componentOptions.props = {} as any))[
    //         propName
    //       ] = options
    //       ;(componentOptions.computed || (componentOptions.computed = {}))[k] = {
    //         get() {
    //           return (this as any)[propName]
    //         },
    //         set(this: Vue, value) {
    //           this.$emit(`update:${propName}`, value)
    //         },
    //       }
    //     })(target, key)
    //   }
    // }

  }, {
    preserve: true
  })
}



