
export interface NavButton {
  id: string;
  text: string;
  route?: string;
  link?: boolean;
  primary?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  icon?: string;
  iconPlacement?: string;
}

export interface NavButtonPanel {
  step: number;
  buttons: NavButton [];
}

export interface NavigationButtons {
  NavButtonPanels: NavButtonPanel []
}
