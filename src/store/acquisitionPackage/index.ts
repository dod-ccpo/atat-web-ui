import {getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "../index";
import { AutoCompleteItemGroups, SelectData } from "types/Global";

@Module({
  name: 'AcquisitionPackage',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class AcquisitionPackageStore extends VuexModule {
  projectTitle = "";
  hasAlternativeContactRep: boolean | null = null;

  public getTitle(): string {
    return this.projectTitle;
  }

  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  public branchData: SelectData[] = [
    { text: "U.S. Air Force", value: "USAF", },
    { text: "U.S. Army", value: "ARMY", },
    { text: "U.S. Coast Guard", value: "USCG", },
    { text: "U.S. Marine Corps", value: "USMC", },
    { text: "U.S. Navy", value: "NAVY", },
    { text: "U.S. Space Force", value: "USSF", },
  ];

  public branchRanksData: AutoCompleteItemGroups = {
    USAF: [
      { rank: "Airman Basic (AB)", value: "Airman Basic", grade: "E-1", },
      { rank: "Airman (Amn)", value: "Airman", grade: "E-2", },
      { rank: "Airman First Class (A1C)", value: "Airman First Class", grade: "E-3", },
      { rank: "Senior Airman (SrA)", value: "Senior Airman", grade: "E-4", },
      { rank: "Staff Sergeant (SSgt)", value: "Staff Sergeant", grade: "E-5", },
      { rank: "Technical Sergeant (TSgt)", value: "Technical Sergeant", grade: "E-6", },
      { rank: "Master Sergeant (MSgt)", value: "Master Sergeant", grade: "E-7", },
      { rank: "Senior Master Sergeant (SMSgt)", value: "Senior Master Sergeant", grade: "E-8", },
      { rank: "Chief Master Sergeant (CMSgt)", value: "Chief Master Sergeant", grade: "E-9", },
      { rank: "Command Chief Master Sergeant (CCM)", value: "Command Chief Master Sergeant", grade: "E-9", },
      { rank: "First Sergeant", value: "First Sergeant", grade: "E-9", },
      { rank: "Second Lieutenant (2d Lt)", value: "Second Lieutenant", grade: "O-1", },
      { rank: "First Lieutenant (1st Lt)", value: "First Lieutenant", grade: "O-2", },
      { rank: "Captain (Capt)", value: "Captain", grade: "O-3", },
      { rank: "Major (Maj)", value: "Major", grade: "O-4", },
      { rank: "Lieutenant Colonel (Lt Co)", value: "Lieutenant Colonel", grade: "O-5", },
      { rank: "Colonel (Col)", value: "Colonel", grade: "O-6", },
      { rank: "Brigadier General (Brig Gen)", value: "Brigadier General", grade: "O-7", },
      { rank: "Major General (Maj Gen)", value: "Major General", grade: "O-8", },
      { rank: "Lieutenant General (Lt Gen)", value: "Lieutenant General", grade: "O-9", },
      { rank: "General (Gen)", value: "General", grade: "O-10", },
    ],
    ARMY: [
      { rank: "Private (PVT)", value: "Private", grade: "E-1", },
      { rank: "Private (PV2)", value: "Private", grade: "E-2", },
      { rank: "Private First Class (PFC)", value: "Private First Class", grade: "E-3", },
      { rank: "Corporal (CPL)", value: "Corporal", grade: "E-4", },
      { rank: "Specialist (SPC)", value: "Specialist", grade: "E-4", },
      { rank: "Sergeant (SGT)", value: "Sergeant", grade: "E-5", },
      { rank: "Staff Sergeant (SSG)", value: "Staff Sergeant", grade: "E-6", },
      { rank: "Sergeant First Class (SFC)", value: "Sergeant First Class", grade: "E-7", },
      { rank: "Master Sergeant (MSG)", value: "Master Sergeant", grade: "E-8", },
      { rank: "First Sergeant (1SG)", value: "First Sergeant", grade: "E-8", },
      { rank: "Sergeant Major (SGM)", value: "Sergeant Major", grade: "E-9", },
      { rank: "Command Sergeant Major (CSM)", value: "Command Sergeant Major", grade: "E-9", },
      { rank: "Warrant Officer 1 (WO1)", value: "Warrant Officer 1", grade: "W-1", },
      { rank: "Chief Warrant Officer 2 (CW2)", value: "Chief Warrant Officer 2", grade: "W-2", },
      { rank: "Chief Warrant Officer 3 (CW3)", value: "Chief Warrant Officer 3", grade: "W-3", },
      { rank: "Chief Warrant Officer 4 (CW4)", value: "Chief Warrant Officer 4", grade: "W-4", },
      { rank: "Chief Warrant Officer 5 (CW5)", value: "Chief Warrant Officer 5", grade: "W-5", },
      { rank: "Second Lieutenant (2LT)", value: "Second Lieutenant", grade: "O-1", },
      { rank: "First Lieutenant (1LT)", value: "First Lieutenant", grade: "O-2", },
      { rank: "Captain (CPT)", value: "Captain", grade: "O-3", },
      { rank: "Major (MAJ)", value: "Major", grade: "O-4", },
      { rank: "Lieutenant Colonel (LTC)", value: "Lieutenant Colonel", grade: "O-5", },
      { rank: "Colonel (COL)", value: "Colonel", grade: "O-6", },
      { rank: "Brigadier General (BG)", value: "Brigadier General", grade: "O-7", },
      { rank: "Major General (MG)", value: "Major General", grade: "O-8", },
      { rank: "Lieutenant General (LTG)", value: "Lieutenant General", grade: "O-9", },
      { rank: "General (GEN)", value: "General", grade: "O-10", },
    ],
    USCG: [
      { rank: "Seaman Recruit (SR)", value: "Seaman Recruit", grade: "E-1", },
      { rank: "Seaman Apprentice (SA)", value: "Seaman Apprentice", grade: "E-2", },
      { rank: "Seaman (SN)", value: "Seaman", grade: "E-3", },
      { rank: "Petty Officer Third Class (PO3)", value: "Petty Officer Third Class", grade: "E-4", },
      { rank: "Petty Officer Second Class (PO2)", value: "Petty Officer Second Class", grade: "E-5", },
      { rank: "Petty Officer First Class (PO1)", value: "Petty Officer First Class", grade: "E-6", },
      { rank: "Chief Petty Officer (CPO)", value: "Chief Petty Officer", grade: "E-7", },
      { rank: "Senior Chief Petty Officer (SCPO)", value: "Senior Chief Petty Officer", grade: "E-8", },
      { rank: "Master Chief Petty Officer (MCPO)", value: "Master Chief Petty Officer", grade: "E-9", },
      { rank: "Command Master Chief Petty Officer (CMC)", value: "Command Master Chief Petty Officer", grade: "E-9", },
      { rank: "Warrant Officer 1 (WO-1)", value: "Warrant Officer 1", grade: "W-1", },
      { rank: "Chief Warrant Officer 2 (CWO-2)", value: "Chief Warrant Officer 2", grade: "W-2", },
      { rank: "Chief Warrant Officer 3 (CWO-3)", value: "Chief Warrant Officer 3", grade: "W-3", },
      { rank: "Chief Warrant Officer 4 (CWO-4)", value: "Chief Warrant Officer 4", grade: "W-4", },
      { rank: "Chief Warrant Officer 5 (CWO-5)", value: "Chief Warrant Officer 5", grade: "W-5", },
      { rank: "Ensign (ENS)", value: "Ensign", grade: "O-1", },
      { rank: "Lieutenant (LTJG)", value: "Lieutenant", grade: "O-2", },
      { rank: "Lieutenant (LT)", value: "Lieutenant", grade: "O-3", },
      { rank: "Lieutenant Commander (LCDR)", value: "Lieutenant Commander", grade: "O-4", },
      { rank: "Commander (CDR)", value: "Commander", grade: "O-5", },
      { rank: "Captain (CAPT)", value: "Captain", grade: "O-6", },
      { rank: "Rear Admiral Lower Half (RDML)", value: "Rear Admiral Lower Half", grade: "O-7", },
      { rank: "Rear Admiral (RADM)", value: "Rear Admiral", grade: "O-8", },
      { rank: "Vice Admiral (VADM)", value: "Vice Admiral", grade: "O-9", },
      { rank: "Admiral (ADM)", value: "Admiral", grade: "O-10", },
    ],
    USMC: [
      { rank: "Private (Pvt)", value: "Private", grade: "E-1", },
      { rank: "Private First Class (PFC)", value: "Private First Class", grade: "E-2", },
      { rank: "Lance Corporal (LCpl)", value: "Lance Corporal", grade: "E-3", },
      { rank: "Corporal (Cpl)", value: "Corporal", grade: "E-4", },
      { rank: "Sergeant (Sgt)", value: "Sergeant", grade: "E-5", },
      { rank: "Staff Sergeant (SSgt)", value: "Staff Sergeant", grade: "E-6", },
      { rank: "Gunnery Sergeant (GySgt)", value: "Gunnery Sergeant", grade: "E-7", },
      { rank: "Master Sergeant (MSgt)", value: "Master Sergeant", grade: "E-8", },
      { rank: "First Sergeant (1stSg)", value: "First Sergeant", grade: "E-8", },
      { rank: "Master Gunnery Sergeant (MGySg)", value: "Master Gunnery Sergeant", grade: "E-9", },
      { rank: "Sergeant Major (SgtMa)", value: "Sergeant Major", grade: "E-9", },
      { rank: "Warrant Officer 1 (WO1)", value: "Warrant Officer 1", grade: "W-1", },
      { rank: "Chief Warrant Officer 2 (CW2)", value: "Chief Warrant Officer 2", grade: "W-2", },
      { rank: "Chief Warrant Officer 3 (CW3)", value: "Chief Warrant Officer 3", grade: "W-3", },
      { rank: "Chief Warrant Officer 4 (CW4)", value: "Chief Warrant Officer 4", grade: "W-4", },
      { rank: "Chief Warrant Officer 5 (CW5)", value: "Chief Warrant Officer 5", grade: "W-5", },
      { rank: "Second Lieutenant (2ndLt)", value: "Second Lieutenant", grade: "O-1", },
      { rank: "First Lieutenant (1stLt)", value: "First Lieutenant", grade: "O-2", },
      { rank: "Captain (Capt)", value: "Captain", grade: "O-3", },
      { rank: "Major (Maj)", value: "Major", grade: "O-4", },
      { rank: "Lieutenant Colonel (LtCol)", value: "Lieutenant Colonel", grade: "O-5", },
      { rank: "Colonel (Col)", value: "Colonel", grade: "O-6", },
      { rank: "Brigadier General (BGen)", value: "Brigadier General", grade: "O-7", },
      { rank: "Major General (MajGen)", value: "Major General", grade: "O-8", },
      { rank: "Lieutenant General (LtGen)", value: "Lieutenant General", grade: "O-9", },
      { rank: "General (Gen)", value: "General", grade: "O-10", },
    ],
    NAVY: [
      { rank: "Seaman Recruit (SR)", value: "Seaman Recruit", grade: "E-1", },
      { rank: "Seaman Apprentice (SA)", value: "Seaman Apprentice", grade: "E-2", },
      { rank: "Seaman (SN)", value: "Seaman", grade: "E-3", },
      { rank: "Petty Officer Third Class (PO3)", value: "Petty Officer Third Class", grade: "E-4", },
      { rank: "Petty Officer Second Class (PO2)", value: "Petty Officer Second Class", grade: "E-5", },
      { rank: "Petty Officer First Class (PO1)", value: "Petty Officer First Class", grade: "E-6", },
      { rank: "Chief Petty Officer (CPO)", value: "Chief Petty Officer", grade: "E-7", },
      { rank: "Senior Chief Petty Officer (SCPO)", value: "Senior Chief Petty Officer", grade: "E-8", },
      { rank: "Master Chief Petty Officer (MCPO)", value: "Master Chief Petty Officer", grade: "E-9", },
      { rank: "Command Master Chief Petty Officer (CMDCM)", value: "Command Master Chief Petty Officer", grade: "E-9", },
      { rank: "Force Master Chief Petty Officer (FORCM)", value: "Force Master Chief Petty Officer", grade: "E-9", },
      { rank: "Fleet Master Chief Petty Officer (FLTCM)", value: "Fleet Master Chief Petty Officer", grade: "E-9", },
      { rank: "Warrant Officer 1 (WO-1)", value: "Warrant Officer 1", grade: "W-1", },
      { rank: "Chief Warrant Officer 2 (CWO-2)", value: "Chief Warrant Officer 2", grade: "W-2", },
      { rank: "Chief Warrant Officer 3 (CWO-3)", value: "Chief Warrant Officer 3", grade: "W-3", },
      { rank: "Chief Warrant Officer 4 (CWO-4)", value: "Chief Warrant Officer 4", grade: "W-4", },
      { rank: "Chief Warrant Officer 5 (CWO-5)", value: "Chief Warrant Officer 5", grade: "W-5", },
      { rank: "Ensign (ENS)", value: "Ensign", grade: "O-1", },
      { rank: "Lieutenant (LTJG)", value: "Lieutenant", grade: "O-2", },
      { rank: "Lieutenant (LT)", value: "Lieutenant", grade: "O-3", },
      { rank: "Lieutenant Commander (LCDR)", value: "Lieutenant Commander", grade: "O-4", },
      { rank: "Commander (CDR)", value: "Commander", grade: "O-5", },
      { rank: "Captain (CAPT)", value: "Captain", grade: "O-6", },
      { rank: "Rear Admiral Lower Half (RDML)", value: "Rear Admiral Lower Half", grade: "O-7", },
      { rank: "Rear Admiral (RADM)", value: "Rear Admiral", grade: "O-8", },
      { rank: "Vice Admiral (VADM)", value: "Vice Admiral", grade: "O-9", },
      { rank: "Admiral (ADM)", value: "Admiral", grade: "O-10", },
    ],
    USSF: [
      { rank: "Specialist 1 (Spc1)", value: "Specialist 1", grade: "E-1", },
      { rank: "Specialist 2 (Spc2)", value: "Specialist 2", grade: "E-2", },
      { rank: "Specialist 3 (Spc3)", value: "Specialist 3", grade: "E-3", },
      { rank: "Specialist 4 (Spc4)", value: "Specialist 4", grade: "E-4", },
      { rank: "Sergeant (Sgt)", value: "Sergeant", grade: "E-5", },
      { rank: "Technical Sergeant (TSgt)", value: "Technical Sergeant", grade: "E-6", },
      { rank: "Master Sergeant (MSgt)", value: "Master Sergeant", grade: "E-7", },
      { rank: "Senior Master Sergeant (SMSgt)", value: "Senior Master Sergeant", grade: "E-8", },
      { rank: "Chief Master Sergeant (CMSgt)", value: "Chief Master Sergeant", grade: "E-9", },
      { rank: "Second Lieutenant (2d Lt)", value: "Second Lieutenant", grade: "O-1", },
      { rank: "First Lieutenant (1st Lt)", value: "First Lieutenant", grade: "O-2", },
      { rank: "Captain (Capt)", value: "Captain", grade: "O-3", },
      { rank: "Major (Maj)", value: "Major", grade: "O-4", },
      { rank: "Lieutenant Colonel (Lt Col)", value: "Lieutenant Colonel", grade: "O-5", },
      { rank: "Colonel (Col)", value: "Colonel", grade: "O-6", },
      { rank: "Brigadier General (Brig Gen)", value: "Brigadier General", grade: "O-7", },
      { rank: "Major General (Maj Gen)", value: "Major General", grade: "O-8", },
      { rank: "Lieutenant General (LT Gen)", value: "Lieutenant General", grade: "O-9", },
      { rank: "General (Gen)", value: "General", grade: "O-10", },
    ],
  };

}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;