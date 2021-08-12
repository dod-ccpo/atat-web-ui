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
  task_order_file: TaskOrderFile;
  clins: CLIN[];
}
