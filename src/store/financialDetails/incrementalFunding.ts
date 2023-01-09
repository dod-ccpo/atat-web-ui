/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {FundingIncrementDTO, FundingPlanDTO, ReferenceColumn} from "@/api/models";
import {convertColumnReferencesToValues} from "@/api/helpers";
import FinancialDetails from "@/store/financialDetails/index";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
import rootStore from "@/store";
import TaskOrder from "@/store/taskOrder";
import {fundingIncrement} from "../../../types/Global";
import {currencyStringToNumber} from "@/helpers";

const initialFundingPlan: FundingPlanDTO = {
  attachment: "",
  extension: "",
  file_name: "",
  initial_amount: "",
  estimated_task_order_value: "",
  remaining_amount_increments: ""
}

@Module({
  name: 'IncrementalFunding',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class IncrementalFundingStore extends VuexModule {
  fundingPlanBaseYear: FundingPlanDTO | null = null;
  fundingIncrementsList: FundingIncrementDTO[] = [];

  /**
   * Gets the funding requirement and uses the funding_plan reference value to load the
   * base year funding plan. Funding plan reference in the funding requirement is assumed
   * to be the base year funding plan.
   *
   * Otherwise, if funding plan is null and NOT tied to funding requirement, then
   * initializes funding plan and ties that to the funding requirement.
   */
  @Action({rawError: true})
  public async loadFundingPlanBaseYear(): Promise<void> {
    try {
      await FinancialDetails.loadFundingRequirement();
      const fundingRequirementDTO = await FinancialDetails.getFundingRequirement();
      const fundingPlanBaseYearDTO = this.fundingPlanBaseYear;
      if (fundingPlanBaseYearDTO === null && fundingRequirementDTO.funding_plan) {
        // load funding plan
        const fundingPlanBaseYearSysId = typeof fundingRequirementDTO.funding_plan === "object"
          ? (fundingRequirementDTO.funding_plan as unknown as ReferenceColumn).value as string
          : fundingRequirementDTO.funding_plan;
        const fundingPlanBaseYearResponse = await api.fundingPlanTable
          .retrieve(fundingPlanBaseYearSysId);
        this.setFundingPlanBaseYear(fundingPlanBaseYearResponse);
      } else if (fundingPlanBaseYearDTO === null && !fundingRequirementDTO.funding_plan) {
        // initialize funding plan and set it to funding requirement
        const fundingPlanBaseYearResponse = await api.fundingPlanTable
          .create(initialFundingPlan);
        fundingRequirementDTO.funding_plan = fundingPlanBaseYearResponse.sys_id as string;
        await FinancialDetails.saveFundingRequirement();
        this.setFundingPlanBaseYear(fundingPlanBaseYearResponse);
        const taskOrder = TaskOrder.taskOrder;
        if (taskOrder) {
          Object.assign(taskOrder, {funding_plan: fundingPlanBaseYearResponse.sys_id as string});
          if (taskOrder.sys_id) {
            // since only update is performed here, need to check for task order sys id
            // before calling save. Otherwise, record gets created and may be undesirable
            await TaskOrder.save(taskOrder);
          }
        }
      }
    } catch (error) {
      throw new Error(`Error occurred loading funding plan base year data ${error}`);
    }
  }

  /**
   * Saves the funding increments and funding plan base year records.
   */
  @Action({rawError: true})
  public async saveFundingPlanBaseYear(): Promise<FundingPlanDTO> {
    let savedFundingPlan = await api.fundingPlanTable
      .update(this.fundingPlanBaseYear?.sys_id as string,
        {...this.fundingPlanBaseYear as FundingPlanDTO,
          initial_amount: currencyStringToNumber(
            this.fundingPlanBaseYear?.initial_amount as string)?.toString()});
    savedFundingPlan = convertColumnReferencesToValues(savedFundingPlan);
    this.setFundingPlanBaseYear(savedFundingPlan);
    return savedFundingPlan;
  }

  /**
   * Loads the funding increments using the reference list stored in the funding plan.
   *
   * If funding plan has not references of funding increments, just sets the funding
   * increments to an empty array.
   */
  @Action({rawError: true})
  public async loadFundingIncrementList(): Promise<void> {
    try {
      // the below check helps performance by not making an API call every
      // time this load function is called.
      if (this.fundingIncrementsList.length === 0) {
        const fundingPlanBaseYear = await this.getFundingPlanBaseYear();
        if (fundingPlanBaseYear && fundingPlanBaseYear.remaining_amount_increments.length > 0) {
          const fundingIncrementsRequestConfig: AxiosRequestConfig = {
            params: {
              sysparm_query: "^sys_idIN" + fundingPlanBaseYear.remaining_amount_increments
            }
          };
          const fundingIncrementsList = await api.fundingIncrementTable
            .getQuery(fundingIncrementsRequestConfig);
          this.setFundingIncrementsList(fundingIncrementsList);
        } else {
          this.setFundingIncrementsList([])
        }
      }
    } catch (error) {
      throw new Error(`Error occurred loading funding requirement ${error}`);
    }
  }

  /**
   * Compares the funding increment List of this store with the new funding increment
   * list passed to this function and marks them for create, update and delete.
   *
   * Since items marked for create do not have sys_ids, additional logic is put in place
   * to properly identify the new funding increment sys_ids that need to be set to the
   * funding plan record.
   * @param newFundingIncrementList
   */
  @Action({rawError: true})
  public async saveFundingIncrementList(
    newFundingIncrementList: fundingIncrement[]): Promise<boolean> {
    const newFundingIncrementDTOList: FundingIncrementDTO[] =
      newFundingIncrementList.map((fundingIncrement): FundingIncrementDTO => {
        return {
          sys_id: fundingIncrement.sysId,
          amount: currencyStringToNumber(fundingIncrement.amt)?.toString(),
          description: fundingIncrement.text,
          order: fundingIncrement.order?.toString()
        }
      })
    const createList = newFundingIncrementDTOList
      .filter(newFI => !(newFI.sys_id && newFI.sys_id.length > 0));
    const updateList = newFundingIncrementDTOList
      .filter(newFI => (newFI.sys_id && newFI.sys_id.length > 0));
    const deleteList = this.fundingIncrementsList.filter(currentFI => {
      return newFundingIncrementDTOList.map(newFI => newFI.sys_id).indexOf(currentFI.sys_id) === -1;
    })
    const createAndUpdateApiCallList: Promise<FundingIncrementDTO>[] = [];
    createList.forEach(markedForCreate => {
      createAndUpdateApiCallList.push(api.fundingIncrementTable
        .create(markedForCreate));
    })
    updateList.forEach(markedForUpdate => {
      createAndUpdateApiCallList.push(api.fundingIncrementTable
        .update(markedForUpdate.sys_id as string, markedForUpdate));
    })
    const deleteApiCallList: Promise<void>[] = [];
    deleteList.forEach(markedForDelete => {
      deleteApiCallList.push(api.fundingIncrementTable
        .remove(markedForDelete.sys_id as string));
    })
    const createAndUpdateFIResponseList = await Promise.all(createAndUpdateApiCallList);
    this.setFundingIncrementsList(createAndUpdateFIResponseList);
    const fundingPlanBaseYear = await this.getFundingPlanBaseYear();
    fundingPlanBaseYear.remaining_amount_increments = createAndUpdateFIResponseList
      .map(newFI => newFI.sys_id).toString();
    this.setFundingPlanBaseYear(fundingPlanBaseYear);
    await this.saveFundingPlanBaseYear();
    await Promise.all(deleteApiCallList);
    return true;
  }

  @Action({rawError: true})
  public async getFundingPlanBaseYear(): Promise<FundingPlanDTO> {
    return this.fundingPlanBaseYear as FundingPlanDTO;
  }

  @Mutation
  public setFundingPlanBaseYear(value: FundingPlanDTO): void {
    this.fundingPlanBaseYear = value;
  }

  @Action({rawError: true})
  public async getFundingIncrementsList(): Promise<FundingIncrementDTO[]> {
    return this.fundingIncrementsList;
  }

  @Mutation
  public setFundingIncrementsList(value: FundingIncrementDTO[]): void {
    this.fundingIncrementsList = value;
  }

  @Mutation
  private doReset(): void {
    this.fundingPlanBaseYear = null;
    this.fundingIncrementsList = [];
  }
}

const IncrementalFunding = getModule(IncrementalFundingStore);
export default IncrementalFunding;
