export const displayErrorInPanel = (
  selectorId: string,
  type: string
): boolean => {
  return (
    document.querySelector(
      "[id^='" + selectorId + "']." + type + " .error--text"
    ) !== null
  );
};
