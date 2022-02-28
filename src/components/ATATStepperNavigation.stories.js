import ATATStepperNavigation from "./ATATStepperNavigation.vue"; // The component I want to "storybook"

export default {
  title: "ATAT/Navigation", // The story path
  component: ATATStepperNavigation, // The element the story is about
};

const Template = () => ({
  components: { ATATStepperNavigation }, // Components available in the story template, just below
  template: `
   <ATATStepperNavigation/>
  `, // Let's use 6 variants of my button
}); // My variable "Template" will need to be bind to value before to become a story.

export const Default = Template.bind({}); // "default" will be the story name, and so, last path element
Default.args = {}; // Story args are for latter