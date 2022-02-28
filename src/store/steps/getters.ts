import { GetterTree } from "vuex";
import { StepsState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<StepsState, RootState> = {

    currentStep : (state)=> state.currentStep

}