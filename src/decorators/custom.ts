import { createDecorator} from 'vue-facing-decorator'
import { PropsConfig } from 'vue-facing-decorator/dist/option/props'

//https://morioh.com/a/9876aadb338e/vuejs-and-property-decorator#PropSync
//https://github.com/kaorun343/vue-property-decorator/blob/master/src/decorators/PropSync.ts     

/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
export function PropSync (
    name: string,
    value : PropsConfig,
  ) {
    createDecorator((options, k) => {
        return true;
        // (options.computed || (options.computed = {}))[k] = {
        //   get() {
        //     return [name]//(this as any)[name]
        //   },
        //   set(this: Vue, value) {
        //     this.$emit(`update:${name}`, value)
        //   },
        // }
      })//(target, key)
    }
  

// export const PropSync = createDecorator((options, key) => {
//     // Keep the original method for later.
//     const originalMethod = options.prop[key]
  
//     // Wrap the method with the logging logic.
//     options.methods[key] = function wrapperMethod(...args: any[]) {
//       // Print a log.
//       console.log(`Invoked: ${key}(`, ...args, ')')
  
//       // Invoke the original method.
//       originalMethod.apply(this, args)
//     }
//   })

//   @PropSync("selectedAddressType") 
    //public _selectedAddressType?: string;
  

//   import { Log } from './decorators'

// @Component
// class MyComp extends Vue {
//   // It prints a log when `hello` method is invoked.
//   @Log
//   hello(value) {
//     // ...
//   }
// }
// Invoked: hello( 42 )



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


// function Log(prefix: string) {
//     return createDecorator(function (options, key) {
//         const old = options.methods?.[key]
//         if (!old) {
//             throw 'not found'
//         }
//         options.methods[key] = function (...args: any[]) {
//             old.apply(this, args)
//         }
//     }, {
//         preserve: true
//     })
// }
