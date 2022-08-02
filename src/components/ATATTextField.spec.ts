import { mount } from '@cypress/vue'
import {} from 'cypress';
import ATATTextField from "@/components/ATATTextField.vue";
import Vue, { Component } from 'vue';

describe('HelloWorld', () => {
  // const wrapper: Component = ATATTextField;

  it('renders a message', () => {
    const id="tony";
    const value = '1.00';
    const isCurrency = false;
    mount(ATATTextField, {
      propsData: {
        value,
        id,
        isCurrency 
      }
    }).vueWrapper()
      .then((wrapper: { emitted: (arg0: string) => any; }) => {
        debugger;
        expect(wrapper.emitted('save')).to.be.undefined
      })
    // cy.get('#' + id + '_text_field').should((tb)=>{
    //   debugger;
    //   expect(tb)
    //     .to.have.value(value)
    //     .to.have.property('isCurrency', true)
    //     .to.have.property('iconColor', 'base-darkest')

    // });
  })
})