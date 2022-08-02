import { mount } from '@cypress/vue'
import ATATTextField from "@/components/ATATTextField.vue";

describe('HelloWorld', () => {
  it('renders a message', () => {
    const id="tony";
    const value = '1.00';
    const isCurrency = true;
    mount(ATATTextField, {
      propsData: {
        value,
        id,
        isCurrency 
      }
    })
    cy.get('#' + id + '_text_field').should((tb)=>{
      expect(tb)
        .to.have.value(value)
        .to.have.property('isCurrency', true)
        .to.have.property('iconColor', 'base-darkest')

    });
  })
})