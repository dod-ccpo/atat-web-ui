
export interface NavButton {
  id: string;
  text: string;
  action: string[];
  width?: number,
  route?: string;
  link?: boolean;
  color?: string;
  disabled?: boolean;
  outlined?: boolean;
}

export interface NavButtonPanel {
  step: number;
  buttons: NavButton [];
}

export interface NavigationButtons {
  NavButtonPanels: NavButtonPanel []
}

export interface Step{
  id?: number,
  step: number,
  text: string,
  primary?: boolean,
  error?: boolean,
  success?: boolean,
  disabled?: boolean,
  route?: string,
  action?: string[];
}
export interface Stepper{
  Steps: Step[]
}