/// <reference types="vitest" />
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {checker} from 'vite-plugin-checker'
import resolve from '@rollup/plugin-node-resolve'
import VueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dotenv from 'dotenv'
dotenv.config()
import path from 'node:path'

const servicenowConfig = require('./servicenow.config')

const DEFAULTS = {
	ASSET_SIZE_LIMIT: 10000
}
const CONFIG = {
	...DEFAULTS,
	...servicenowConfig
}

export default defineConfig(({command, mode}) => {
	const env = loadEnv(mode, process.cwd(), '')
	const BASE_API_URL = env.BASE_API_URL.endsWith('/')
			? env.BASE_API_URL + 'api'
			: env.BASE_API_URL + '/api',
		SNOWUSER = mode === 'development' ? env.SNOWUSER : '',
		SNOWPASS = mode === 'development' ? env.SNOWPASS : '',
		SNOW_USER_SYSID =
			mode === 'development' ? env.userId : 'e0c4c728875ed510ec3b777acebb356f', // pragma: allowlist secret
		VERSION = env.VERSION,
		VUE_APP_allowDeveloperNavigation = mode === 'development' ? env.VUE_APP_allowDeveloperNavigation: false
	//  if(command === 'serve') {
	return {
		define: {
			'process.env.VUE_APP_BASE_API_URL': JSON.stringify(BASE_API_URL),
			'process.env.VUE_APP_SNOWUSER': JSON.stringify(SNOWUSER),
			'process.env.VUE_APP_SNOWPASS': JSON.stringify(SNOWPASS),
			'process.env.SNOW_USER_SYSID': JSON.stringify(SNOW_USER_SYSID),
			'process.env.VUE_APP_allowDeveloperNavigation': JSON.stringify(VUE_APP_allowDeveloperNavigation),
			'process.env.VERSION': JSON.stringify(VERSION)
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, "src"),
				vue: 'vue/dist/vue.esm-bundler.js', // Alias 'vue' to Vue 3
				'vue/compat': 'vue/dist/vue.runtime.esm-bundler.js'
			},
			extensions: ['.ts', '.vue', '.js']
		},
		plugins: [
			VueDevTools({analyze: true}), 
			vue(),
			vuetify(),
			Components({
				dts: true,
				directives: false,
				resolvers: [],
				types: [
					{
						from: 'vue-router',
						names: ['RouterLink', 'RouterView']
					}
				],
				version: 3
			}),
			//TODO Migrate unit tests and enable vueTsc
			checker({
				// typescript: true,
				// vueTsc: true
				// eslint: {lintCommand:'eslint '},
			}),
			cssInjectedByJsPlugin(),
			resolve()
			//splitVendorChunkPlugin(),
		],
		server: {
			port: 8080,
			watch: {
				usePolling: true,
			  }
		},
		build: {
			target: 'esnext',
			assetsDir: './',
			cssCodeSplit: false,
			// optimizeDeps: {
			// 	include: ['node_modules/*']
			// },
			rollupOptions: {
				output: {
					dir: './dist',
					format: 'iife', //iife || umd !cjs
					entryFileNames: 'js/app-js',
					chunkFileNames: 'js/vendor-js',
					assetFileNames: assetInfo => {
						
						if (/\.(png|jpe?g|gif|webp|svg)$/.test(assetInfo.name)) {
							return `img/[name]-[hash:6]-[ext]`
						} else if (/\.(woff2?|eot|ttf|otf|ttc)$/i.test(assetInfo.name)) {
							return `other_assets/[name]-[hash:6]-[ext]`
						}
						return assetInfo.name
					}
					//doesn't work with iife/umd
					// manualChunks: (id) => {
					//   if(id.includes("node_modules")){
					//     const depName = id.split('/node_modules/')[1].split('/')[0]
					//     if((pkg.dependencies && pkg.dependencies[depName]) /*|| (pkg.devDependencies && pkg.devDependencies[depName])*/){
					//       return `js/vendor-js`
					//     }
					//   }
					//   else if(id.includes('/src/assets/')){
					//     return `js/vendor-js`
					//   }
					// }
				}
			}
		},
		test: {
			globals: true,
			environment: 'jsdom',
			coverage: { 
			  enabled: true,
			  provider: 'v8', 
			  clean: true,
			  reportOnFailure: true,
			  skipFull: true,
			  perFile: true,
			//   lines: 80,
			//   functions: 80,
			//   branches: 80,
			//   statements: 80,
			  reporter: ['text','html', 'lcov'],
			  restoreMocks: true,
			  maxConcurrency: 10,
			  concurrent: true,
			  typecheck: {
          enabled: true,
          checker: 'vue-tsc'
			  },
			//  bail: 10,

			},
			server: {
			  deps: {
				  inline: ['vuetify'],
			  }
			},
      open: false,
			root: './',
			ui: true,
			//Default exclude: node_modules/, dist/, cypress/, *.config.*, **/.{idea,git,cache,output,temp} 
			exclude: [
        'node_modules/**',
        'src/api/gInvoicing/index.spec.ts',
        'src/api/portfolio/index.spec.ts',
        'src/AppPackageBuilder.spec.ts',
        'src/components/ATATAddressForm.spec.ts',
        'src/components/ATATAlert.spec.ts',
        'src/components/ATATAutoComplete.spec.ts',
        'src/components/ATATCheckboxGroup.spec.ts',
        'src/components/ATATContactForm.spec.ts',
        'src/components/ATATDatePicker.spec.ts',
        'src/components/ATATDialog.spec.ts',
        'src/components/ATATDivider.spec.ts',
        'src/components/ATATErrorValidation.spec.ts',
        'src/components/ATATPhoneInput.spec.ts',
        'src/components/ATATSearch.spec.ts',
        'src/components/ATATSelect.spec.ts',
        'src/components/ATATSideStepper.spec.ts',
        'src/components/ATATSlideoutPanel.spec.ts',
        'src/components/ATATStepperNavigation.spec.ts',
        'src/components/ATATTextArea.spec.ts',
        'src/components/ATATTextField.spec.ts',
        'src/components/ATATToast.spec.ts',
        'src/components/ATATTooltip.spec.ts',
        'src/components/ATATTopNavBar.spec.ts',
        'src/components/DOW/CurrentUsage.spec.ts',
        'src/components/DOW/DescriptionOfNeed.spec.ts',
        'src/components/DOW/PerformanceTier.spec.ts',
        'src/components/DOW/PricingDetails.spec.ts',
        'src/components/DOW/RegionsDeployedAndUserCount.spec.ts',
        'src/documentReview/components/CommentsPanel.spec.ts',
        'src/documentReview/components/DocReviewHead.spec.ts',
        'src/documentReview/form.spec.ts',
        'src/documentReview/index.spec.ts',
        'src/documentReview/preview.spec.ts',
        'src/helpers/index.spec.ts',
        'src/helpers/unitTests.ts',
        'src/helpers/unitTest.spec.ts',
        'src/home/components/ExistingTaskOrderCard.spec.ts',
        'src/home/components/HelpfulResourcesCards.spec.ts',
        'src/home/components/NewAcquisitionCard.spec.ts',
        'src/home/ExistingUser.spec.ts',
        'src/home/Index.spec.ts',
        'src/home/NewUser.spec.ts',
        'src/main.spec.ts',
        'src/packages/components/ArchiveModal.spec.ts',
        'src/packages/components/Card.spec.ts',
        'src/packages/components/DeletePackageModal.spec.ts',
        'src/packages/components/Search.spec.ts',
        'src/packages/Index.spec.ts',
        'src/portfolios/components/FiltersSlideout.spec.ts',
        'src/portfolios/components/PortfolioCard.spec.ts',
        'src/portfolios/components/PortfoliosSummary.spec.ts',
        'src/portfolios/Index.spec.ts',
        'src/portfolios/portfolio/components/FundingTracker/FundingTracker.spec.ts',
        'src/portfolios/portfolio/components/Index.spec.ts',
        'src/portfolios/portfolio/components/shared/MemberCard.spec.ts',
        'src/portfolios/portfolio/components/shared/Members.spec.ts',
        'src/portfolios/portfolio/components/shared/PortfolioDrawer.spec.ts',
        'src/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.spec.ts',
        'src/portfolios/portfolio/components/TaskOrder/TaskOrder.spec.ts',
        'src/portfolios/portfolio/components/TaskOrder/TaskOrderCard.spec.ts',
        'src/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.spec.ts',
        'src/portfolios/portfolio/CreateFirstPortfolio.spec.ts',
        'src/portfolios/portfolio/FundingAlert.spec.ts',
        'src/portfolios/portfolio/Portfolio.spec.ts',
        'src/portfolios/provisioning/AddToExistingPortfolio.spec.ts',
        'src/portfolios/provisioning/PortfolioDetails.spec.ts',
        'src/portfolios/provisioning/ProvisionWorkflow.spec.ts',
        'src/router/resolvers/__test__/index.spec.ts',
        'src/router/resolvers/index.spec.ts',
        'src/services/alertservice.spec.ts',
        'src/services/reqCostEstimateSupportingDocs.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/AcorInfo.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/AlternateCOR.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/Common.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/ContactInfoForm.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/CorInfo.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/COR_ACOR/PersonCard.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/SummaryStepOne.spec.ts',
        'src/steps/02-EvaluationCriteria/Exceptions.spec.ts',
        'src/steps/02-EvaluationCriteria/SummaryStepTwo.spec.ts',
        'src/steps/03-Background/components/BusinessSize.spec.ts',
        'src/steps/03-Background/components/ContractNumber.spec.ts',
        'src/steps/03-Background/components/IncumbentContractorName.spec.ts',
        'src/steps/03-Background/components/LevelOfCompetition.spec.ts',
        'src/steps/03-Background/components/TaskOrderNumber.spec.ts',
        'src/steps/03-Background/CurrentContract/components/CurrentContractOptions.spec.ts',
        'src/steps/03-Background/CurrentContract/CurrentContract.spec.ts',
        'src/steps/03-Background/CurrentContract/CurrentContractDetails.spec.ts',
        'src/steps/03-Background/CurrentContract/ProcurementHistorySummary.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/ClassificationLevelsPage.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/CurrentEnvironment.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/CurrentEnvironmentLocation.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/EnvironmentSummary.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/InstanceDetails.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/ReplicateDetails.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/UploadMigrationDocuments.spec.ts',
        'src/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.spec.ts',
        'src/steps/03-Background/SummaryStepFour.spec.ts',
        'src/steps/05-PerformanceRequirements/CurrentFunctions/ReplicateAndOptimize.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/DOWLandingPage.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/OtherRequirementSummary.spec.ts',
        'src/steps/07-OtherContractConsiderations/CoILearnMore.spec.ts',
        'src/steps/07-OtherContractConsiderations/ConflictOfInterest.spec.ts',
        'src/steps/07-OtherContractConsiderations/PackagingPackingAndShipping.spec.ts',
        'src/steps/07-OtherContractConsiderations/SummaryStepSix.spec.ts',
        'src/steps/07-OtherContractConsiderations/Travel.spec.ts',
        'src/steps/08-StandardsAndCompliance/BAA.spec.ts',
        'src/steps/08-StandardsAndCompliance/BAALearnMore.spec.ts',
        'src/steps/08-StandardsAndCompliance/FOIA.spec.ts',
        'src/steps/08-StandardsAndCompliance/FOIACoordinator.spec.ts',
        'src/steps/08-StandardsAndCompliance/PII.spec.ts',
        'src/steps/08-StandardsAndCompliance/PIIRecord.spec.ts',
        'src/steps/08-StandardsAndCompliance/Section508AccessibilityRequirements.spec.ts',
        'src/steps/08-StandardsAndCompliance/Section508Standards.spec.ts',
        'src/steps/08-StandardsAndCompliance/SummaryStepSeven.spec.ts',
        'src/steps/10-FinancialDetails/components/GeneratingDocumentsFunding.spec.ts',
        'src/steps/10-FinancialDetails/components/ReviewDocumentsFunding.spec.ts',
        'src/steps/10-FinancialDetails/GeneratePackageDocumentsFunding.spec.ts',
        'src/steps/10-FinancialDetails/RequireFundingDocuments.spec.ts',
        'src/steps/10-FinancialDetails/Upload7600.spec.ts',
        'src/store/acquisitionPackage/currentEnvironment.spec.ts',
        'src/store/acquisitionPackage/index.spec.ts',
        'src/store/classificationRequirements/__test__/index.spec.ts',
        'src/store/contactData/index.spec.ts',
        'src/store/financialDetails/index.spec.ts',
        'src/store/organizationData/index.spec.ts',
        'src/store/portfolio/index.spec.ts',
        'src/store/portfolioSummary/index.spec.ts',
        'src/store/steps/__test__/stepsStore.spec.ts',
        'src/store/summary/index.spec.ts',
        'src/store/taskOrder/index.spec.ts',
        'src/store/user/index.spec.ts',
        'tests/unit/example.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/ContactInfo.spec.ts',
        //ignored test files by jest
        'src/steps/01-AcquisitionPackageDetails/Organization.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/ProjectOverview.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/components/DoDAAC.spec.ts',
        'src/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/Differentiators.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/NoEvalPlan.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/Summary.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/components/Callout.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/components/CreateEvalPlanSlideOut.spec.ts',
        'src/steps/02-EvaluationCriteria/EvalPlan/components/CustomSpecifications.spec.ts',
        'src/steps/02-EvaluationCriteria/Exceptions.spec.ts',
        'src/steps/02-EvaluationCriteria/JandA/ImpactOfRequirement.spec.ts',
        'src/steps/02-EvaluationCriteria/JandA/UniqueSource.spec.ts',
        'src/steps/02-EvaluationCriteria/JustificationAndApproval.spec.ts',
        'src/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.spec.ts',
        'src/steps/02-EvaluationCriteria/MRR/CertificationPOCs.spec.ts',
        'src/steps/02-EvaluationCriteria/MRR/MarketResearchEfforts.spec.ts',
        'src/steps/02-EvaluationCriteria/components/FairOppExceptions.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/ArchitecturalDesignDOW.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/ComputeFormElements.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/EntireDuration.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/OtherOfferings.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/OtherRequirementSummary.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/ServiceOfferingDetails.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/ServiceOfferings.spec.ts',
        'src/steps/05-PerformanceRequirements/DOW/SummaryStepFive.spec.ts',
        'src/steps/10-FinancialDetails/CurrentlyHasFunding.spec.ts',
        'src/steps/10-FinancialDetails/GTCInformation.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/CannotProceed.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/CostSummary.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/CreatePriceEstimate.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/EstimatesDeveloped.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/FeeCharged.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/Index.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/SupportingDocumentation.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/SurgeCapabilities.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/SurgeCapacity.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/TravelEstimates.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/components/Card_Requirements.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/components/ICGELearnMore.spec.ts',
        'src/steps/10-FinancialDetails/IGCE/components/SlideOut_GatherPricesEstimates.spec.ts',
        'src/steps/10-FinancialDetails/IncrementalFunding.spec.ts',
        'src/steps/11-GeneratePackageDocuments/UploadSignedDocuments.spec.ts',
      ]
		  },
		minify: 'esbuild',
		commonjsOptions: {
			esmExternals: false
		},

		css: {
			extract: false,
			preprocessorOptions: {
				scss: {
					additionalData: "@import 'src/sass/atat.scss';"
				}
			},
		},
		
	}
})
