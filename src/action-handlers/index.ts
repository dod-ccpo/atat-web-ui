import AcquisitionPackage from "@/store/acquisitionPackage";

const storeNames = {
  AcquisitionPackage: "AcquisitionPackage",
}

const stores = {
  [storeNames.AcquisitionPackage]: AcquisitionPackage
}

const actionHandlerNames = {
  sampleAdditionalButtonAction: "sampleAdditionalButtonAction",
}

const actions =  {
  [actionHandlerNames.sampleAdditionalButtonAction]: sampleAdditionalButtonAction,
};

async function actionHandler(
  actionName: string, 
  actionArgs: string[],
  stepStore: string,
): Promise<void> {
  await actions[actionName](actionArgs, stepStore);
} 

function sampleAdditionalButtonAction(actionArgs: string[], stepStore: string) {
  console.log('args in actionHandler:', actionArgs);
  const foo = actionArgs[0];
  const bar = actionArgs[1];
  const store = stores[stepStore];
  store.sampleAdditionalButtonActionInStore(foo, bar);
  alert("\"Cancel\" will navigate to JWCC intro when completed.")
}

export default actionHandler;
