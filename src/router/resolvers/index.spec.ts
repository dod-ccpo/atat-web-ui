/* eslint-disable camelcase */
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import {
  AcorsRouteResolver,
  EvalPlanDetailsRouteResolver,
  CurrentlyHasFundingResolver, 
  GTCInformationResolver, 
  Upload7600Resolver, 
  MIPRResolver, 
  IGCESupportingDocumentationResolver,
  AppropriationOfFundsResolver,
  SeverabilityAndIncrementalFundingResolver,
  RFDResolver,
  FinancialPOCResolver,
  IGCECannotProceedResolver,
  
} from "./index"
import * as ExportedResolverFunctions from "./index";
import { routeNames } from "@/router/stepper";
import Vue from "vue";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import Summary from "@/store/summary";
import FinancialDetails from "@/store/financialDetails";
import {FundingRequirementDTO} from "@/api/models";
import { isStepComplete } from "../../store/summary/index";

const acquisitionPackage = {
  acor: "",
  classification_level: "",
  contract_award: "",
  contract_considerations: "",
  contract_type: "",
  contracting_shop: "",
  cor: "",
  current_contract_and_recurring_information: "",
  current_environment: "",
  customer_feedback: "",
  docgen_job_status: "",
  docusign_envelope_id: "",
  environment_instance: "",
  fair_opportunity: {},
  funding_plans: "",
  funding_requirement: "",
  gfe_overview: "",
  is_travel_needed: "",
  number: "",
  organization: "",
  owner_needs_email_package_ready_to_submit: false,
  period_of_performance: "",
  periods: "",
  primary_contact: "",
  project_overview: "",
  required_services: "",
  sensitive_information: "",
  status: "",
  contracting_shop_require_funding_documents_for_submission_of_package: ''
};
const fundingReq: FundingRequirementDTO = {
  acquisition_package: "",
  funding_plan: "",
  funding_request: "",
  funds_obligated: "",
  funds_total: "",
  has_funding: "",
  incrementally_funded: "",
  pop_end_date: "",
  pop_start_date: "",
  task_order_number: ""
};
const summaryItem = {
  title:"",
  description:"",
  isComplete:true,
  isTouched:false,
  hasDelete:false,
  hasShowMore:false,
  routeName:"",
  step:0,
  substep:0
}

describe("testing route resolvers", () => {
  afterEach(()=>{
    // reset periodOfPerformance and DOW back to incomplete
    Periods.setPeriods([]);
    DescriptionOfWork.setIsIncomplete(true);
  })

  describe("ACORs Resolvers", () => {
    it ("AcorsRouteResolver() - routes to acquisition package summary", async () => {
      await AcquisitionPackage.setHasAlternateCOR(false);
      const route = AcorsRouteResolver(routeNames.AlternateCor);
      expect(route).toBe(routeNames.SummaryStepOne);
    });

    it ("AcorsRouteResolver() - routes to 'has ACOR' question page", async () => {
      await AcquisitionPackage.setHasAlternateCOR(false);
      const route = AcorsRouteResolver(routeNames.AcqPackageSummary);
      expect(route).toBe(routeNames.AcorInformation);
    });

    it ("AcorsRouteResolver() - routes to ACOR info form", async () => {
      await AcquisitionPackage.setHasAlternateCOR(true);
      const route = AcorsRouteResolver(routeNames.AcqPackageSummary);
      Vue.nextTick(() => {
        expect(route).toBe(routeNames.AcorInformation);
      })
    });
  });

  describe("Evaluation Plan Resolvers", () => {
    it ("EvalPlanDetailsRouteResolver() - routes to EvalPlan page", async () => {
      expect(EvalPlanDetailsRouteResolver(routeNames.CreateEvalPlan))
        .toBe(routeNames.SummaryStepTwo);
    });
  });

  describe("RequirementCostEstimates Resolvers", () => {
    describe('IGCESupportingDocumentationResolver()', () => {
      
      const POPSummaryItem = {
        ...summaryItem,
        "step":3,
        "substep":1
      }
      const DOWSummaryItem = {
        ...summaryItem,
        "step":5,
      }
      Summary.doSetSummaryItem(POPSummaryItem);
      Summary.doSetSummaryItem(DOWSummaryItem)
     
      it('returns SupportingDocumentation if current is EstimatesDeveloped', async () =>
      {
        expect(IGCESupportingDocumentationResolver(routeNames.EstimatesDeveloped))
          .toBe(routeNames.SupportingDocumentation)
      }
      );

      it('returns SupportingDocumentation if current is '
         + 'SeverabilityAndIncrementalFunding && (isSubStepComplete(3,1) && '
         + 'isStepComplete(5)) ', async () =>
      {
        expect(IGCESupportingDocumentationResolver(
          routeNames.SeverabilityAndIncrementalFunding
        )).toBe(routeNames.SupportingDocumentation)
      }
      );

      it('returns Cannot Proceed if current is '
      + 'SeverabilityAndIncrementalFunding && !(isSubStepComplete(3,1) && '
      + 'isStepComplete(5)) ', async () =>
      {
        DOWSummaryItem.isComplete = false;
        POPSummaryItem.isComplete = false;
        expect(IGCESupportingDocumentationResolver(
          routeNames.SeverabilityAndIncrementalFunding
        )).toBe(routeNames.CannotProceed)
      });
    })

    describe('IGCECannotProceedResolver()', () => {
      it('returns routeNames.SurgeCapacity by default ' +
          'if current === routeNames.CreatePriceEstimate)', 
      async () =>{
        expect(IGCECannotProceedResolver(
          routeNames.CreatePriceEstimate
        )).toBe(routeNames.SurgeCapacity)
      });

      it('returns routeNames.CreatePriceEstimate by default ' +
        'if current === routeNames.OptimizeOrReplicate)', 
      async () =>{
        expect(IGCECannotProceedResolver(
          routeNames.OptimizeOrReplicate
        )).toBe(routeNames.CreatePriceEstimate)
      });
      
      it('returns current by default' +
        'if !current.includes(routeNames.OptimizeOrReplicate, ' +
        'ArchitecturalDesignDetails,routeNames.GatherPriceEstimates,' +
        'CreatePriceEstimates)', 
      async () =>{
        const current = "customRouteName"
        expect(IGCECannotProceedResolver(current)).toBe(current)
      });


    })

    describe('AppropriationOfFundsResolver()', () => {
      let RCESummaryItem = summaryItem;
      beforeEach(()=>{
        RCESummaryItem = {
          ...summaryItem,
          "step":8,
          "isTouched": true
        }
        Summary.doSetSummaryItem(RCESummaryItem);
      })
      
      it('returns SummaryStepEight if (StepHasBeenVisited && if current === '
          + 'routeNames.SeverabilityAndIncrementalFunding) ', async () =>{
        expect(AppropriationOfFundsResolver(
          routeNames.SeverabilityAndIncrementalFunding
        )).toBe(routeNames.SummaryStepEight)
      });

      it('returns SeverabilityAndIncrementalFunding if (!StepHasBeenVisited && '
      + 'if current === routeNames.SeverabilityAndIncrementalFunding) ', async () =>{
        RCESummaryItem.isTouched = false;
        expect(AppropriationOfFundsResolver(
          routeNames.SeverabilityAndIncrementalFunding
        )).toBe(routeNames.AppropriationOfFunds)
      });

      it('returns AppropriationOfFunds if hasExceptionToFairOpp', async () =>{
        AcquisitionPackage.doSetFairOpportunity({
          exception_to_fair_opportunity: "C"
        })
        expect(AppropriationOfFundsResolver(routeNames.EstimatesDeveloped))
          .toBe(routeNames.AppropriationOfFunds)
      });

      it('returns SummaryStepEight if !hasExceptionToFairOpp', async () =>{
        AcquisitionPackage.doSetFairOpportunity({
          exception_to_fair_opportunity: "NO_NONE"
        })
        expect(AppropriationOfFundsResolver(routeNames.EstimatesDeveloped))
          .toBe(routeNames.SummaryStepEight)
      });
    })

    describe('SeverabilityAndIncrementalFundingResolver()', () => {
      let RCESummaryItem = summaryItem;
      beforeEach(()=>{
        RCESummaryItem = {
          ...summaryItem,
          "step":8,
          "isTouched": true
        }
        Summary.doSetSummaryItem(RCESummaryItem);
      })
      
      it('returns SummaryStepEight if Summary.hasCurrentStepBeenVisited && '
          +'current === routeNames.AppropriationOfFunds', async () =>{
        expect(SeverabilityAndIncrementalFundingResolver(
          routeNames.AppropriationOfFunds
        )).toBe(routeNames.SummaryStepEight)
      });

      it('returns SummaryStepEight if Summary.hasCurrentStepBeenVisited && '
          +'current !== routeNames.AppropriationOfFunds', async () =>{
        
        expect(SeverabilityAndIncrementalFundingResolver(
          'Some Different Route'
        )).toBe(routeNames.SeverabilityAndIncrementalFunding)
      });
    })
  })

  describe("FundingStep Resolvers", () => {
    describe("CurrentlyHasFundingResolver()", () => {
      let RCESummaryItem = summaryItem;
    
      beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line max-len
        acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package = '';
        acquisitionPackage.contracting_shop = '';
        RCESummaryItem = {
          ...summaryItem,
          "step":8,
          "isTouched": true
        }
        Summary.doSetSummaryItem(RCESummaryItem);
      });

      it('returns SummaryStepEight when current is RFD and doesNotNeedFundingDoc is true',
        async () => {
          // eslint-disable-next-line max-len
          acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package="NO";
          await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
          expect(CurrentlyHasFundingResolver(routeNames.RFD))
            .toBe(routeNames.SummaryStepEight);
        });

      it('returns SummaryStepEight when hasCurrentStepBeenVisited is true', () => {
        
        expect(CurrentlyHasFundingResolver('any-other-route'))
          .toBe(routeNames.CurrentlyHasFunding);
      });

      it('returns CurrentlyHasFunding when user is not a DITCO user', async () => {
        await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
        expect(CurrentlyHasFundingResolver('any-other-route'))
          .toBe(routeNames.CurrentlyHasFunding);
      });

      it('returns RFD when user is a DITCO user', async () => {
        acquisitionPackage.contracting_shop = "DITCO";
        await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
        const result = CurrentlyHasFundingResolver('any-other-route');
        expect(result).toBe(routeNames.CurrentlyHasFunding);
      });
    });

    
    describe('GTCInformationResolver', () => {
      beforeEach(() => {
        FinancialDetails.setHasFunding('');
      });

      it('should return GTC route if FinancialDetails has funding', async () => {
        await FinancialDetails.setHasFunding("HAS_FUNDING");
        const result = GTCInformationResolver('anyRoute');
        expect(result).toBe(routeNames.GTC);
      });

      it('should return GeneratingPackageDocumentsFunding if current route is not ' +
        'GeneratingPackageDocumentsFunding and no funding', async () => {
        await FinancialDetails.setHasFunding("HAS_FUNDING");
        const result = GTCInformationResolver(routeNames.CurrentlyHasFunding);
        expect(result).toBe(routeNames.GeneratingPackageDocumentsFunding);
      });

      it('should return CurrentlyHasFunding if current route is ' +
        'GeneratingPackageDocumentsFunding and no funding', () => {
        const result = GTCInformationResolver(routeNames.CurrentlyHasFunding);
        expect(result).toBe(routeNames.GeneratingPackageDocumentsFunding);
      });
    });

    describe('RFDResolver', () => {
      let RCESummaryItem = summaryItem;
    
      beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line max-len
        RCESummaryItem = {
          ...summaryItem,
          "step":8,
          "isTouched": true
        }
        Summary.doSetSummaryItem(RCESummaryItem);
      });

      it('should return routeNames.SummaryStepEight when Summary.hasCurrentStepBeenVisited '
          + '&& current === routeNames.FinancialPOCForm', () => {
        expect(RFDResolver(routeNames.FinancialPOCForm))
          .toBe(routeNames.SummaryStepEight)
      });

      it('should return routeNames.RFD if !isDitcoUser()', () => {
        acquisitionPackage.contracting_shop = "is not ditco user";
        expect(RFDResolver(''))
          .toBe(routeNames.RFD)
      });

      it('should return routeNames.CurrentlyHasFunding if isDitcoUser()', () => {
        acquisitionPackage.contracting_shop = "DITCO";
        expect(RFDResolver(''))
          .toBe(routeNames.CurrentlyHasFunding)
      });
    });

    describe('FinancialPOCResolver', () => {
      let RCESummaryItem = summaryItem;
    
      beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line max-len
        RCESummaryItem = {
          ...summaryItem,
          "step":8,
          "isTouched": true
        }
        Summary.doSetSummaryItem(RCESummaryItem);
      });

      it('should return routeNames.SummaryStepEight when Summary.hasCurrentStepBeenVisited '
          + '&& current === routeNames.RFD', () => {
        expect(FinancialPOCResolver(routeNames.RFD))
          .toBe(routeNames.SummaryStepEight)
      });

      it('should return routeNames.FinancialPOCForm when !Summary.hasCurrentStepBeenVisited '
          + '&& current === routeNames.RFD', () => {
        RCESummaryItem.isTouched=false;
        expect(FinancialPOCResolver(routeNames.RFD))
          .toBe(routeNames.FinancialPOCForm)
      });
    });

    describe('MIPRResolver', () => {
      beforeEach(() => {
        FinancialDetails.setHasFunding('');
        FinancialDetails.setFundingRequirement(fundingReq);
        FinancialDetails.setFundingRequest({ funding_request_type: '' })
      });

      it('should return CurrentlyHasFunding route if FinancialDetails has no funding and' +
        ' current page is GeneratingPackageDocsFunding', async () => {
        await FinancialDetails.setHasFunding("NO_FUNDING");
        const result = MIPRResolver(routeNames.GeneratingPackageDocumentsFunding);
        expect(result).toBe(routeNames.CurrentlyHasFunding);
      });

      it('should return MIPR route if fundingType is MIPR', async () => {
        const fundingRequest = { funding_request_type: 'MIPR' };
        FinancialDetails.setFundingRequest(fundingRequest);
        const result = MIPRResolver('anyRoute');
        expect(result).toBe(routeNames.MIPR);
      });

      it('should return SummaryStepEight route if fundingType is FS_FORM', async () => {
        const fundingRequest = { funding_request_type: 'FS_FORM' };
        FinancialDetails.setFundingRequest(fundingRequest);
        const result = MIPRResolver('anyRoute');
        expect(result).toBe(routeNames.SummaryStepEight);
      });

      it('should return FundingPlanType route if routing from GTC page', async () => {
        const result = MIPRResolver(routeNames.GTC);
        expect(result).toBe(routeNames.FundingPlanType);
      });

      it('should return GTC route if no other conditions are met', async () => {
        const result = MIPRResolver('anyRoute');
        expect(result).toBe(routeNames.GTC);
      });
    });

    describe('Upload7600Resolver', () => {
      beforeEach(() => {
        FinancialDetails.setHasFunding('');
      });

      it('should return MIPR route if current is FundingPlanType and fundingRequestType ' +
        'returns "MIPR"', async () => {
        const fundingRequest = {
          funding_request_type: 'MIPR'
        };
        await FinancialDetails.setFundingRequest(fundingRequest)
        expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.MIPR);
      });

      it('should return Upload7600 route if current is FundingPlanType and '+
        'fundingRequestType does not return "MIPR"', async () => {
        const fundingRequest = {
          funding_request_type: 'NOT_MIPR'
        };
        await FinancialDetails.setFundingRequest(fundingRequest)
        expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.Upload7600);
      });

      it('returns GTC when current is SeverabilityAndIncrementalFunding', () => {
        const result = Upload7600Resolver(routeNames.SeverabilityAndIncrementalFunding);
        expect(result).toBe(routeNames.Upload7600);
      });

      it('returns GTC when current is AppropriationOfFunds', () => {
        const result = Upload7600Resolver(routeNames.AppropriationOfFunds);
        expect(result).toBe(routeNames.Upload7600);
      });

      it('returns AppropriationOfFunds when there is an exception to fair opp', async () => {
        acquisitionPackage.fair_opportunity = {exception_to_fair_opportunity: "NO_NONE"};
        await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
        const result = Upload7600Resolver('someOtherRoute');
        // this can be any route that's not in the ones explicitly mentioned
        expect(result).toBe(routeNames.Upload7600);
      });
    });
  });
});