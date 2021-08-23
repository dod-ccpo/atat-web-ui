export interface NavButton {
  id: string;
  text: string;
  action: string[];
  width?: number;
  route?: string;
  link?: boolean;
  color?: string;
  disabled?: boolean;
  outlined?: boolean;
}

export interface NavButtonPanel {
  step: number;
  buttons: NavButton[];
}

export interface NavigationButtons {
  NavButtonPanels: NavButtonPanel[];
}

export interface Step {
  id?: number;
  step: number;
  description: string;
  primary?: boolean;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  route?: string;
  action?: string[];
}
export interface Stepper {
  Steps: Step[];
}

export interface CreatePortfolioFormModel {
  name: string;
  description?: string;
  dod_components: string[];
}
export interface CreateTaskOrderFormModel {
  task_order_number: string;
}
export interface TaskOrderFile {
  description: string;
  id: string;
  created_at: string;
  updated_at: string;
  size: number;
  name: string;
  status: string;
}

export interface CLIN {
  clin_number: string;
  idiq_clin: string;
  total_clin_value: number;
  obligated_funds: number;
  pop_start_date: string;
  pop_end_date: string;
}

export interface TaskOrderDetails {
  task_order_number: string;
  task_order_file?: TaskOrderFile;
  clins: CLIN[];
}

export interface TaskOrders{
  details: TaskOrderDetails[];
}

export interface NavButton {
  id: string;
  text: string;
  action: string[];
  width?: number;
  route?: string;
  link?: boolean;
  color?: string;
  disabled?: boolean;
  outlined?: boolean;
}

export interface NavButtonPanel {
  step: number;
  buttons: NavButton[];
}

export interface NavigationButtons {
  NavButtonPanels: NavButtonPanel[];
}

export interface Step {
  id?: number;
  step: number;
  description: string;
  primary?: boolean;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  route?: string;
  action?: string[];
}
export interface Stepper {
  Steps: Step[];
}

/**
 * Model to represent Portfolio data
 *
 * @interface CreatePortfolioFormModel
 * @member {name} label Portfolio Name
 * @member {string} description Portfolio Description
 * @member {string[]}  dod_components DoD component(s) funding the Portfolio
 * @member {string} csp Cloud Service Provider
 */
export interface CreatePortfolioFormModel {
  name: string;
  description?: string;
  dod_components: string[];
  csp: string[];
}

/**
 * Represents an object passed to ATAButtonCard items array
 *
 * @interface ButtonCardItem
 * @member {string} label used for item
 * @member {string} value unique value of the radio button
 * @member {string} content used for ButtonCard content could be a string or HTML
 */
export interface ButtonCardItem {
  label: string;
  value: string;
  content: string;
}

export interface ValidatableForm {
  validateForm(): Promise<boolean>;
}

export interface ATATSummaryCardItem {
  type?: string;
  title?: string;
  description?: string;
  icon?: string;
  groupedItemsHeader?: string;
  items?: ATATSummaryCardGroupedItems[];
  edit?: string,
  delete?: string
}

export interface ATATSummaryCardGroupedItems {
    title?: string,
    prefix?: string,
    value?: number,
}


export interface ATATSummaryCards {
  cards: ATATSummaryCardItem[];
}
