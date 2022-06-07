import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";

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
  console.log("in action-handler: foo: " + foo + "bar: " + bar);
  AcquisitionPackage.sampleAdditionalButtonActionInStore(actionArgs);
  alert("\"Cancel\" will navigate to JWCC intro when completed.");
}

// used in Performance Requirements when user clicks "I don't need these cloud resources" button
function deleteServiceOfferingGroup() {
  const DOWObjectLength = DescriptionOfWork.DOWObject.length;
  const currentGroupId = DescriptionOfWork.currentGroupId;
  const currentGroupIndex = DescriptionOfWork.DOWObject.findIndex((obj) => {
    return obj.serviceOfferingGroupId === currentGroupId;
  });
  DescriptionOfWork.DOWObject = DescriptionOfWork.DOWObject.filter((obj) => {
    return obj.serviceOfferingGroupId !== currentGroupId;
  });

  // need to route to next category if more exist in DOWObject, 
  // or if last, or the last one is a "None apply" option, send to summary page
  
}

export default actionHandler;
