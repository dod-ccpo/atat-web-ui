
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
