import {expect, test} from '@jest/globals'
import {VueWrapper, shallowMount} from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld.vue', () => {
  test('renders successfully', () => {
    const wrapper:VueWrapper = shallowMount(HelloWorld, {
      props: {msg: 'test'},
    })
    expect(wrapper.exists()).toBe(true)
  })
  test('renders props.msg when passed', () => {
    const msg = `new message`
    const wrapper = shallowMount(HelloWorld, {
      props: {msg},
    })
    expect(wrapper.text()).toContain(msg)
  })
})
