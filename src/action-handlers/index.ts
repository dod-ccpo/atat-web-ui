import AcquisitionPackage from "@/store/acquisitionPackage";

const actionHandlerNames = {
  sampleAdditionalButtonAction: "sampleAdditionalButtonAction",
}

const actions =  {
  [actionHandlerNames.sampleAdditionalButtonAction]: sampleAdditionalButtonAction,
};

async function actionHandler(actionName: string, actionArgs: string[]): Promise<void> {
  await actions[actionName](actionArgs);
} 

function sampleAdditionalButtonAction(actionArgs: string[]) {
  console.log('args in actionHandler:', actionArgs);
  const [foo, bar] = actionArgs;
  debugger;
  AcquisitionPackage.sampleAdditionalButtonActionInStore(foo, bar);
  alert("\"Cancel\" will navigate to JWCC intro when completed.");
}

export default actionHandler;
