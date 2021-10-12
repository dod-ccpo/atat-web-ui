export interface Dialog {
    isDisplayed: boolean;
    type: string;
    setFocus: boolean;
    width: string;
    height: string;
}

export interface Toast {
    isDisplayed: boolean;
    message: string;
    contentClass: string;
}
