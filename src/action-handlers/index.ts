import AcquisitionPackage from "@/store/acquisitionPackage";

const storeNames = {
  AcquisitionPackage: "AcquisitionPackage",
}

const stores = {
  [storeNames.AcquisitionPackage]: AcquisitionPackage
}

const actionHandlerNames = {
  doSomething: "doSomething",
}

const actions =  {
  [actionHandlerNames.doSomething]: doSomething,
};

async function actionHandler(
  actionName: string, 
  actionArgs: string[],
  stepStore: string,
): Promise<void> {
  await actions[actionName](actionArgs, stepStore);
} 

function doSomething(actionArgs: string[], stepStore: string) {
  console.log('args in actionHandler:', actionArgs);
  const foo = actionArgs[0];
  const bar = actionArgs[1];
  const store = stores[stepStore];
  store.doSomethingInStore(foo, bar);
  alert("\"Cancel\" will navigate to JWCC intro when completed.")
}

export default actionHandler;