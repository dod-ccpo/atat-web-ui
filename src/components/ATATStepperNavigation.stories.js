/* eslint vue/no-child-content: 1 */
// The component I want to "storybook"
import ATATStepperNavigation from "./ATATStepperNavigation.vue";

export default {
  title: "ATAT/Navigation", // The story path
  component: ATATStepperNavigation, // The element the story is about
};

const Template = () => ({
  // Components available in the story template, just below
  components: { ATATStepperNavigation },
  template: `
   <ATATStepperNavigation/>
  `, // Let's use 6 variants of my button
}); // My variable "Template" will need to be bind to value before to become a story.

// "default" will be the story name, and so, last path element
export const Default = Template.bind({});
Default.args = {}; // Story args are for latter