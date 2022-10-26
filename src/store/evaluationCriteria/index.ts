// /* eslint-disable camelcase */
// import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
// import rootStore from "@/store";
// // import {EvaluationCriteriaDTO } from "@/api/models";
// import AcquisitionPackage from "../acquisitionPackage";


// /**
//  * This module contains all the store and api support that is needed for "Evaluation Criteria" of
//  * a new Acquisition
//  */
// @Module({
//   name: "EvaluationCriteriaStore",
//   namespaced: true,
//   dynamic: true,
//   store: rootStore,
// })

// export class EvaluationCriteriaStore extends VuexModule {
//   initialized = false;
//   evaluationCriteria: EvaluationCriteriaDTO | null = null;

//   @Action
//   public async getEvaluationCriteria():
//     Promise<EvaluationCriteriaDTO | null> {
//     await this.ensureInitialized();
//     return this.evaluationCriteria;
//   }

//   @Mutation
//   public setInitialized(value: boolean): void {
//     this.initialized = value;
//   }

//   @Mutation
//   public async setEvaluationCriteria(value: EvaluationCriteriaDTO): Promise<void> {
//     if (this.evaluationCriteria) {
//       this.evaluationCriteria = Object.assign(this.evaluationCriteria, value);
//     } else {
//       this.evaluationCriteria = value;
//     }
//   }

//   get acquisitionPackageSysId(): string {
//     return AcquisitionPackage.getAcquisitionPackageSysId();
//   }

//   @Action({rawError: true})
//   async initialize(): Promise<void> {
//     await this.loadEvaluationCriteria() 
//     this.setInitialized(true);
//   }

//   @Action({rawError: true})
//   async ensureInitialized(): Promise<void> {
//     if (!this.initialized) {
//       await this.initialize();
//     }
//   }

//   /**
//    * Loads the evaluation criteria by making BE api calls and sets it to this store
//    */
//   @Action({rawError: true})
//   async loadEvaluationCriteria():
//     Promise<void> {
//     // TODO: map the store object to the DB tables and make proper API calls to either
//     //  create or update the evaluation criteria.
//     try {
//       // TODO: figure out the tables to call to load the evaluation criteria
//       //  if available, return the object or return undefined to indicate that evaluation
//       //  needs to started

//       // FIXME: delete below code after the api hookup
//       const evaluationCriteria: EvaluationCriteriaDTO = {
//         evaluation_plan: {
//           source_selection: "",
//           method: "",
//           standard_specifications: [],
//           custom_specifications: []
//         },
//         // fair_opportunity: {
//         //   exception_to_fair_opportunity: ""
//         // }
//       }
//       // FIXME: delete above code after the api hookup

//       await this.setEvaluationCriteria(evaluationCriteria);
//     } catch (error) {
//       throw new Error(`an error occurred while loading evaluation criteria ${error}`);
//     }
//   }

//   /**
//    * Gets the evaluation criteria from this store and makes the api calls to save.
//    */
//   @Action({rawError: true})
//   async saveEvaluationCriteria(data: EvaluationCriteriaDTO): Promise<boolean> {
//     // TODO: map the store object to the DB tables and make proper API calls to either
//     //  create or update the evaluation criteria.
//     try {
//       // EJY
//       await this.setEvaluationCriteria(data);

//       let isSaveSuccessfull = false;
//       if (this.evaluationCriteria) {
//         // TODO: update or create
//         isSaveSuccessfull = true;
//       }
//       return isSaveSuccessfull;
//     } catch (error) {
//       throw new Error(`an error occurred saving evaluation criteria ${error}`);
//     }
//   }
// }

// const EvaluationCriteria = getModule(EvaluationCriteriaStore);
// export default EvaluationCriteria;
