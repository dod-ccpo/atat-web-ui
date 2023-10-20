import Vue from 'vue'
import { createVuetify } from 'vuetify'
import { mount, VueWrapper } from '@vue/test-utils'
import ArchitecturalDesign from '@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.vue'

const Vuetify = createVuetify()
Vue.use(Vuetify)

describe('Testing ArchitecturalDesign Component', () => {
  let vuetify
  let wrapper: VueWrapper

  beforeEach(() => {
    vuetify = createVuetify()
    wrapper = mount(ArchitecturalDesign, {
      vuetify,
    })
  })

  describe('testing ArchitecturalDesign render', () => {
    it('renders successfully', async () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
