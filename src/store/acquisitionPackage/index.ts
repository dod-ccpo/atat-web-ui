import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { AdditionalButton } from "../steps/types";
import api from "@/api";
import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { AutoCompleteItemGroups, SelectData } from "types/Global";
const ATAT_ACQUISTION_PACKAGE_KEY="ATAT_ACQUISTION_PACKAGE_KEY";

@Module({
  name: 'AcquisitionPackage',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class AcquisitionPackageStore extends VuexModule {
  // NOTE: Make sure data vars that are typed are assigned a default value.
  // If left undefined, even when set with proper value, it will return undefined.
  // Also do not use `| undefined` e.g., `private foo: SelectData | undefined;` as
  // the undefined will be returned when getting the variable value.

  projectTitle = "";
  acquisitionPackage: AcquisitionPackageDTO  | null = null;
  hasAlternativeContactRep: boolean | null = null;

  public getTitle(): string {
    return this.projectTitle;
  }

  // EJY needs an action. shouldn't call mutations directly
  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  // EJY needs an action. shouldn't call mutations directly
  @Mutation
  public setAcquisitionPackage(value: AcquisitionPackageDTO): void {
    this.acquisitionPackage = value;
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  @Action
  public sampleAdditionalButtonActionInStore(actionArgs: string[]): void {
    console.log("in store: actionArgs", actionArgs);
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {

    const storedAcquisitionPackageData = sessionStorage.getItem(ATAT_ACQUISTION_PACKAGE_KEY) as string;

    if (storedAcquisitionPackageData && storedAcquisitionPackageData.length > 0) {
      const parsedData = JSON.parse(storedAcquisitionPackageData) as AcquisitionPackageDTO;
      this.setAcquisitionPackage(parsedData);
    }
    else {

      try {
        const acquisitionPackage = await api.acquisitionPackages.create();
        if (acquisitionPackage) {
          this.setAcquisitionPackage(acquisitionPackage);
          sessionStorage.setItem(ATAT_ACQUISTION_PACKAGE_KEY, JSON.stringify(acquisitionPackage));
        }

      } catch (error) {

        console.log(`error creating acquisition package ${error}`);
      }

    }
  }
  // service or agency selected on Organiation page
  selectedServiceOrAgency: SelectData = { text: "", value: "" };
  public getSelectedServiceOrAgency(): SelectData {
    return this.selectedServiceOrAgency;
  }
  @Action
  public setSelectedServiceOrAgency(value: SelectData): void {
    this.doSetSelectedServiceOrAgency(value);
  }

  @Mutation
  public doSetSelectedServiceOrAgency(value: SelectData): void {
    this.selectedServiceOrAgency = value;
  }

  // military branch selected on Contact Info page
  public selectedContactBranch: SelectData =  { text: "", value: "" };

  @Action
  public setSelectedContactBranch(value: SelectData): void {
    this.doSetSelectedContactBranch(value);
  }

  @Mutation
  public doSetSelectedContactBranch(value: SelectData): void {
    this.selectedContactBranch = value;
  }

  // used on Contact Info and COR/ACOR pages
  public branchData: SelectData[] = [
    { text: "U.S. Air Force", value: "USAF", },
    { text: "U.S. Army", value: "ARMY", },
    { text: "U.S. Coast Guard", value: "USCG", },
    { text: "U.S. Marine Corps", value: "USMC", },
    { text: "U.S. Navy", value: "NAVY", },
    { text: "U.S. Space Force", value: "USSF", },
  ];

  // used on Contact Info and COR/ACOR pages
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

  public serviceOrAgencyData: SelectData[] = [
    { text: "Communications & Electronics Command", value: "Communications & Electronics Command",},
    { text: "Defense Advanced Research Project Agency (DARPA)", value: "DARPA",},
    { text: "Defense Commissary Agency", value: "Defense Commissary Agency",},
    { text: "Defense Contract Audit Agency (DCAA)", value: "DCAA",},
    { text: "Defense Contract Management Agency (DCMA)", value: "DCMA",},
    { text: "Defense Counterintelligence and Security Agency", value: "Defense Counterintelligence and Security Agency",},
    { text: "Defense Criminal Investigation Service", value: "Defense Criminal Investigation Service",},
    { text: "Defense Finance and Accounting Service", value: "Defense Finance and Accounting Service",},
    { text: "Defense Information Systems Agency (DISA)", value: "DISA",},
    { text: "Defense Intelligence Agency (DIA)", value: "DIA",},
    { text: "Defense Logistics Agency (DLA)", value: "DLA",},
    { text: "Defense Media Activity (DMA)", value: "DMA",},
    { text: "Defense Security Cooperation Agency", value: "Defense Security Cooperation Agency",},
    { text: "Defense Technical Information Center", value: "Defense Technical Information Center",},
    { text: "Defense Threat Reduction Center (DTRA)", value: "DTRA",},
    { text: "Department of Defense", value: "Department of Defense",},
    { text: "Joint Chiefs of Staff", value: "Joint Chiefs of Staff",},
    { text: "Joint Forces Command", value: "Joint Forces Command",},
    { text: "Joint Informaiton Operations Warfare Command", value: "Joint Informaiton Operations Warfare Command",},
    { text: "Joint Logistics Systems Center", value: "Joint Logistics Systems Center",},
    { text: "Joint Staff Comptroller", value: "Joint Staff Comptroller",},
    { text: "Joint System Engineering & Integration Office (JSEIO)", value: "JSEIO",},
    { text: "Military Health System (MHS) Defense Health Agency (DHA)", value: "MHS DHA",},
    { text: "Military Sealift Command", value: "Military Sealift Command",},
    { text: "National Geospatial Intelligence Agency", value: "National Geospatial Intelligence Agency",},
    { text: "National Ground Intelligence Agency", value: "National Ground Intelligence Agency",},
    { text: "National Guard Bureau", value: "National Guard Bureau",},
    { text: "National Security Agency", value: "National Security Agency",},
    { text: "Office of the Secretary of Defense (OSD)", value: "OSD",},
    { text: "U.S. Africa Command", value: "U.S. Africa Command",},
    { text: "U.S. Air Force", value: "USAF",},
    { text: "U.S. Air Force Europe (USAFE)", value: "USAFE",},
    { text: "U.S. Army", value: "ARMY",},
    { text: "U.S. Central Command (USCENTCOM)", value: "USCENTCOM",},
    { text: "U.S. Coast Guard", value: "USCG",},
    { text: "U.S. Cyber Command", value: "U.S. Cyber Command",},
    { text: "U.S. European Command (USEUCOM)", value: "USEUCOM",},
    { text: "U.S. Marine Corps", value: "USMC",},
    { text: "U.S. Navy", value: "NAVY",},
    { text: "U.S. Northern Command (USNORTHCOM)", value: "USNORTHCOM",},
    { text: "U.S. Pacific Command (USPACCOM)", value: "USPACCOM",},
    { text: "U.S. Southern Command (USSOUTHCOM)", value: "USSOUTHCOM",},
    { text: "U.S. Special Operations Command (USSOCCOM)", value: "USSOCCOM",},
    { text: "U.S. Strategic Command (USSTRATCOM)", value: "USSTRATCOM",},
    { text: "U.S. Transportation Command (USTRANSCOM)", value: "USTRANSCOM",},
  ];

  public stateListData: SelectData[] = [
    { text: "Alabama", value: "AL" },
    { text: "Alaska", value: "AK" },
    { text: "Arizona", value: "AZ" },
    { text: "Arkansas", value: "AR" },
    { text: "California", value: "CA" },
    { text: "Colorado", value: "CO" },
    { text: "Connecticut", value: "CT" },
    { text: "Delaware", value: "DE" },
    { text: "District of Columbia", value: "DC" },
    { text: "Florida", value: "FL" },
    { text: "Georgia", value: "GA" },
    { text: "Hawaii", value: "HI" },
    { text: "Idaho", value: "ID" },
    { text: "Illinois", value: "IL" },
    { text: "Indiana", value: "IN" },
    { text: "Iowa", value: "IA" },
    { text: "Kansas", value: "KS" },
    { text: "Kentucky", value: "KY" },
    { text: "Louisiana", value: "LA" },
    { text: "Maine", value: "ME" },
    { text: "Maryland", value: "MD" },
    { text: "Massachusetts", value: "MA" },
    { text: "Michigan", value: "MI" },
    { text: "Minnesota", value: "MN" },
    { text: "Mississippi", value: "MS" },
    { text: "Missouri", value: "MO" },
    { text: "Montana", value: "MT" },
    { text: "Nebraska", value: "NE" },
    { text: "Nevada", value: "NV" },
    { text: "New Hampshire", value: "NH" },
    { text: "New Jersey", value: "NJ" },
    { text: "New Mexico", value: "NM" },
    { text: "New York", value: "NY" },
    { text: "North Carolina", value: "NC" },
    { text: "North Dakota", value: "ND" },
    { text: "Ohio", value: "OH" },
    { text: "Oklahoma", value: "OK" },
    { text: "Oregon", value: "OR" },
    { text: "Pennsylvania", value: "PA" },
    { text: "Rhode Island", value: "RI" },
    { text: "South Carolina", value: "SC" },
    { text: "South Dakota", value: "SD" },
    { text: "Tennessee", value: "TN" },
    { text: "Texas", value: "TX" },
    { text: "Utah", value: "UT" },
    { text: "Vermont", value: "VT" },
    { text: "Virginia", value: "VA" },
    { text: "Washington", value: "WA" },
    { text: "West Virginia", value: "WV" },
    { text: "Wisconsin", value: "WI" },
    { text: "Wyoming", value: "WY" },
  ];

  public countryListData = [ 
    { text: "United States of America", value: "US" }, 
    { text: "Afghanistan", value: "AF" }, 
    { text: "Åland Islands", value: "AX" }, 
    { text: "Albania", value: "AL" }, 
    { text: "Algeria", value: "DZ" }, 
    { text: "American Samoa", value: "AS" }, 
    { text: "Andorra", value: "AD" }, 
    { text: "Angola", value: "AO" }, 
    { text: "Anguilla", value: "AI" }, 
    { text: "Antarctica", value: "AQ" }, 
    { text: "Antigua and Barbuda", value: "AG" }, 
    { text: "Argentina", value: "AR" }, 
    { text: "Armenia", value: "AM" }, 
    { text: "Aruba", value: "AW" }, 
    { text: "Australia", value: "AU" }, 
    { text: "Austria", value: "AT" }, 
    { text: "Azerbaijan", value: "AZ" }, 
    { text: "Bahamas", value: "BS" }, 
    { text: "Bahrain", value: "BH" }, 
    { text: "Bangladesh", value: "BD" }, 
    { text: "Barbados", value: "BB" }, 
    { text: "Belarus", value: "BY" }, 
    { text: "Belgium", value: "BE" }, 
    { text: "Belize", value: "BZ" }, 
    { text: "Benin", value: "BJ" }, 
    { text: "Bermuda", value: "BM" }, 
    { text: "Bhutan", value: "BT" }, 
    { text: "Bolivia", value: "BO" }, 
    { text: "Bosnia and Herzegovina", value: "BA" }, 
    { text: "Botswana", value: "BW" }, 
    { text: "Bouvet Island", value: "BV" }, 
    { text: "Brazil", value: "BR" }, 
    { text: "British Indian Ocean Territory", value: "IO" }, 
    { text: "Brunei Darussalam", value: "BN" }, 
    { text: "Bulgaria", value: "BG" }, 
    { text: "Burkina Faso", value: "BF" }, 
    { text: "Burundi", value: "BI" }, 
    { text: "Cambodia", value: "KH" }, 
    { text: "Cameroon", value: "CM" }, 
    { text: "Canada", value: "CA" }, 
    { text: "Cape Verde", value: "CV" }, 
    { text: "Cayman Islands", value: "KY" }, 
    { text: "Central African Republic", value: "CF" }, 
    { text: "Chad", value: "TD" }, 
    { text: "Chile", value: "CL" }, 
    { text: "China", value: "CN" }, 
    { text: "Christmas Island", value: "CX" }, 
    { text: "Cocos (Keeling) Islands", value: "CC" }, 
    { text: "Colombia", value: "CO" }, 
    { text: "Comoros", value: "KM" }, 
    { text: "Congo", value: "CG" }, 
    { text: "Congo, The Democratic Republic of the", value: "CD" }, 
    { text: "Cook Islands", value: "CK" }, 
    { text: "Costa Rica", value: "CR" }, 
    { text: "Cote D\"Ivoire", value: "CI" }, 
    { text: "Croatia", value: "HR" }, 
    { text: "Cuba", value: "CU" }, 
    { text: "Cyprus", value: "CY" }, 
    { text: "Czech Republic", value: "CZ" }, 
    { text: "Denmark", value: "DK" }, 
    { text: "Djibouti", value: "DJ" }, 
    { text: "Dominica", value: "DM" }, 
    { text: "Dominican Republic", value: "DO" }, 
    { text: "Ecuador", value: "EC" }, 
    { text: "Egypt", value: "EG" }, 
    { text: "El Salvador", value: "SV" }, 
    { text: "Equatorial Guinea", value: "GQ" }, 
    { text: "Eritrea", value: "ER" }, 
    { text: "Estonia", value: "EE" }, 
    { text: "Ethiopia", value: "ET" }, 
    { text: "Falkland Islands (Malvinas)", value: "FK" }, 
    { text: "Faroe Islands", value: "FO" }, 
    { text: "Fiji", value: "FJ" }, 
    { text: "Finland", value: "FI" }, 
    { text: "France", value: "FR" }, 
    { text: "French Guiana", value: "GF" }, 
    { text: "French Polynesia", value: "PF" }, 
    { text: "French Southern Territories", value: "TF" }, 
    { text: "Gabon", value: "GA" }, 
    { text: "Gambia", value: "GM" }, 
    { text: "Georgia", value: "GE" }, 
    { text: "Germany", value: "DE" }, 
    { text: "Ghana", value: "GH" }, 
    { text: "Gibraltar", value: "GI" }, 
    { text: "Greece", value: "GR" }, 
    { text: "Greenland", value: "GL" }, 
    { text: "Grenada", value: "GD" }, 
    { text: "Guadeloupe", value: "GP" }, 
    { text: "Guam", value: "GU" }, 
    { text: "Guatemala", value: "GT" }, 
    { text: "Guernsey", value: "GG" }, 
    { text: "Guinea", value: "GN" }, 
    { text: "Guinea-Bissau", value: "GW" }, 
    { text: "Guyana", value: "GY" }, 
    { text: "Haiti", value: "HT" }, 
    { text: "Heard Island and Mcdonald Islands", value: "HM" }, 
    { text: "Holy See (Vatican City State)", value: "VA" }, 
    { text: "Honduras", value: "HN" }, 
    { text: "Hong Kong", value: "HK" }, 
    { text: "Hungary", value: "HU" }, 
    { text: "Iceland", value: "IS" }, 
    { text: "India", value: "IN" }, 
    { text: "Indonesia", value: "ID" }, 
    { text: "Iran, Islamic Republic Of", value: "IR" }, 
    { text: "Iraq", value: "IQ" }, 
    { text: "Ireland", value: "IE" }, 
    { text: "Isle of Man", value: "IM" }, 
    { text: "Israel", value: "IL" }, 
    { text: "Italy", value: "IT" }, 
    { text: "Jamaica", value: "JM" }, 
    { text: "Japan", value: "JP" }, 
    { text: "Jersey", value: "JE" }, 
    { text: "Jordan", value: "JO" }, 
    { text: "Kazakhstan", value: "KZ" }, 
    { text: "Kenya", value: "KE" }, 
    { text: "Kiribati", value: "KI" }, 
    { text: "Korea, Democratic People\"S Republic of", value: "KP" }, 
    { text: "Korea, Republic of", value: "KR" }, 
    { text: "Kuwait", value: "KW" }, 
    { text: "Kyrgyzstan", value: "KG" }, 
    { text: "Lao People\"S Democratic Republic", value: "LA" }, 
    { text: "Latvia", value: "LV" }, 
    { text: "Lebanon", value: "LB" }, 
    { text: "Lesotho", value: "LS" }, 
    { text: "Liberia", value: "LR" }, 
    { text: "Libyan Arab Jamahiriya", value: "LY" }, 
    { text: "Liechtenstein", value: "LI" }, 
    { text: "Lithuania", value: "LT" }, 
    { text: "Luxembourg", value: "LU" }, 
    { text: "Macao", value: "MO" }, 
    { text: "Macedonia, The Former Yugoslav Republic of", value: "MK" }, 
    { text: "Madagascar", value: "MG" }, 
    { text: "Malawi", value: "MW" }, 
    { text: "Malaysia", value: "MY" }, 
    { text: "Maldives", value: "MV" }, 
    { text: "Mali", value: "ML" }, 
    { text: "Malta", value: "MT" }, 
    { text: "Marshall Islands", value: "MH" }, 
    { text: "Martinique", value: "MQ" }, 
    { text: "Mauritania", value: "MR" }, 
    { text: "Mauritius", value: "MU" }, 
    { text: "Mayotte", value: "YT" }, 
    { text: "Mexico", value: "MX" }, 
    { text: "Micronesia, Federated States of", value: "FM" }, 
    { text: "Moldova, Republic of", value: "MD" }, 
    { text: "Monaco", value: "MC" }, 
    { text: "Mongolia", value: "MN" }, 
    { text: "Montserrat", value: "MS" }, 
    { text: "Morocco", value: "MA" }, 
    { text: "Mozambique", value: "MZ" }, 
    { text: "Myanmar", value: "MM" }, 
    { text: "Namibia", value: "NA" }, 
    { text: "Nauru", value: "NR" }, 
    { text: "Nepal", value: "NP" }, 
    { text: "Netherlands", value: "NL" }, 
    { text: "Netherlands Antilles", value: "AN" }, 
    { text: "New Caledonia", value: "NC" }, 
    { text: "New Zealand", value: "NZ" }, 
    { text: "Nicaragua", value: "NI" }, 
    { text: "Niger", value: "NE" }, 
    { text: "Nigeria", value: "NG" }, 
    { text: "Niue", value: "NU" }, 
    { text: "Norfolk Island", value: "NF" }, 
    { text: "Northern Mariana Islands", value: "MP" }, 
    { text: "Norway", value: "NO" }, 
    { text: "Oman", value: "OM" }, 
    { text: "Pakistan", value: "PK" }, 
    { text: "Palau", value: "PW" }, 
    { text: "Palestinian Territory, Occupied", value: "PS" }, 
    { text: "Panama", value: "PA" }, 
    { text: "Papua New Guinea", value: "PG" }, 
    { text: "Paraguay", value: "PY" }, 
    { text: "Peru", value: "PE" }, 
    { text: "Philippines", value: "PH" }, 
    { text: "Pitcairn", value: "PN" }, 
    { text: "Poland", value: "PL" }, 
    { text: "Portugal", value: "PT" }, 
    { text: "Puerto Rico", value: "PR" }, 
    { text: "Qatar", value: "QA" }, 
    { text: "Reunion", value: "RE" }, 
    { text: "Romania", value: "RO" }, 
    { text: "Russian Federation", value: "RU" }, 
    { text: "Rwanda", value: "RW" }, 
    { text: "Saint Helena", value: "SH" }, 
    { text: "Saint Kitts and Nevis", value: "KN" }, 
    { text: "Saint Lucia", value: "LC" }, 
    { text: "Saint Pierre and Miquelon", value: "PM" }, 
    { text: "Saint Vincent and the Grenadines", value: "VC" }, 
    { text: "Samoa", value: "WS" }, 
    { text: "San Marino", value: "SM" }, 
    { text: "Sao Tome and Principe", value: "ST" }, 
    { text: "Saudi Arabia", value: "SA" }, 
    { text: "Senegal", value: "SN" }, 
    { text: "Serbia and Montenegro", value: "CS" }, 
    { text: "Seychelles", value: "SC" }, 
    { text: "Sierra Leone", value: "SL" }, 
    { text: "Singapore", value: "SG" }, 
    { text: "Slovakia", value: "SK" }, 
    { text: "Slovenia", value: "SI" }, 
    { text: "Solomon Islands", value: "SB" }, 
    { text: "Somalia", value: "SO" }, 
    { text: "South Africa", value: "ZA" }, 
    { text: "South Georgia and the South Sandwich Islands", value: "GS" }, 
    { text: "Spain", value: "ES" }, 
    { text: "Sri Lanka", value: "LK" }, 
    { text: "Sudan", value: "SD" }, 
    { text: "Suriname", value: "SR" }, 
    { text: "Svalbard and Jan Mayen", value: "SJ" }, 
    { text: "Swaziland", value: "SZ" }, 
    { text: "Sweden", value: "SE" }, 
    { text: "Switzerland", value: "CH" }, 
    { text: "Syrian Arab Republic", value: "SY" }, 
    { text: "Taiwan, Province of China", value: "TW" }, 
    { text: "Tajikistan", value: "TJ" }, 
    { text: "Tanzania, United Republic of", value: "TZ" }, 
    { text: "Thailand", value: "TH" }, 
    { text: "Timor-Leste", value: "TL" }, 
    { text: "Togo", value: "TG" }, 
    { text: "Tokelau", value: "TK" }, 
    { text: "Tonga", value: "TO" }, 
    { text: "Trinidad and Tobago", value: "TT" }, 
    { text: "Tunisia", value: "TN" }, 
    { text: "Turkey", value: "TR" }, 
    { text: "Turkmenistan", value: "TM" }, 
    { text: "Turks and Caicos Islands", value: "TC" }, 
    { text: "Tuvalu", value: "TV" }, 
    { text: "Uganda", value: "UG" }, 
    { text: "Ukraine", value: "UA" }, 
    { text: "United Arab Emirates", value: "AE" }, 
    { text: "United Kingdom", value: "GB" }, 
    { text: "United States Minor Outlying Islands", value: "UM" }, 
    { text: "United States of America", value: "US" }, 
    { text: "Uruguay", value: "UY" }, 
    { text: "Uzbekistan", value: "UZ" }, 
    { text: "Vanuatu", value: "VU" }, 
    { text: "Venezuela", value: "VE" }, 
    { text: "Viet Nam", value: "VN" }, 
    { text: "Virgin Islands, British", value: "VG" }, 
    { text: "Virgin Islands, U.S.", value: "VI" }, 
    { text: "Wallis and Futuna", value: "WF" }, 
    { text: "Western Sahara", value: "EH" }, 
    { text: "Yemen", value: "YE" }, 
    { text: "Zambia", value: "ZM" }, 
    { text: "Zimbabwe", value: "ZW"} 
  ];

  @Action
  public getCountryListData(removeCountries: string[] | null): SelectData[] {
    if (!removeCountries) {
      return this.countryListData;
    }
    let filteredCountries = this.countryListData;
    removeCountries.filter(function(countryCode) {
      filteredCountries = filteredCountries.filter(function(countryObj) {
          return countryObj.value !== countryCode;
      });
    });
    return filteredCountries;
  }

  public disaOrgData: SelectData[] = [
    { text: "Assistant to the Director (DD)", value: "DD",},
    { text: "Chaplain Program Management Office (DDCH)", value: "DDCH",},
    { text: "Chief Financial Officer / Comptroller (CP)", value: "CP",},
    { text: "Chief of Staff (DDC)", value: "DDC",},
    { text: "Combined Action Group (DDCG)", value: "DDCG",},
    { text: "Component Acquisition Executive (CAE)", value: "CAE",},
    { text: "DCSC Cyber Security & Analytics (ID)", value: "ID",},
    { text: "DCSC Defense Spectrum Organization (DSO)", value: "DSO",},
    { text: "DCSC Joint Enterprise Services (SD)", value: "SD",},
    { text: "DCSC Joint Enterprise Services DoD Enterprise Mobility (SD5)", value: "SD5",},
    { text: "DCSC Joint Interop Test Command (JITC)", value: "JITC",},
    { text: "DCSC National Background Investigative System Directorate (NBIS)", value: "NBIS",},
    { text: "DCSC Resource Management (BD)", value: "BD",},
    { text: "DISA Director Group (DD)", value: "DD",},
    { text: "EC Chief Data Officer (OD)", value: "OD",},
    { text: "EC Chief Information Officer (IO)", value: "IO",},
    { text: "EC Emerging Technology (EM)", value: "EM",},
    { text: "EC Enterprise Engineering & Governance (OE)", value: "OE",},
    { text: "EC Resource Management (EC)", value: "EC",},
    { text: "EC Rick Management (RE)", value: "RE",},
    { text: "Executive Deputy Director (DDE)", value: "DDE",},
    { text: "General Counsel (GC)", value: "GC",},
    { text: "HC Compute Operations Office (HC3)", value: "HC3",},
    { text: "HC Product Management Office (HC2)", value: "HC2",},
    { text: "HC Operations Support Office (HC1)", value: "HC1",},
    { text: "Inspector General (IG)", value: "IG",},
    { text: "Joint Artificial Intelligence Center (JAIC)", value: "JAIC",},
    { text: "Joint Forces Headquarters (JFHQ)", value: "JFHQ",},
    { text: "Joint Support Group (JSG)", value: "JSG",},
    { text: "Joint Services Provider (JSP)", value: "JSP",},
    { text: "OC Cyberspace-Operations (CE)", value: "CE",},
    { text: "OC Cyberspace-Operations Joint Staff Support Center (JC)", value: "JC",},
    { text: "OC Cyberspace-Operations DISA Pacific (PC)", value: "PC",},
    { text: "OC Endpoint Services & Customer Support (FE)", value: "FE",},
    { text: "OC Transport Services (IE)", value: "IE",},
    { text: "OC Resource Management (OC)", value: "OC",},
    { text: "Office of Equality, Diversity & Inclusion (OEDI)", value: "OEDI",},
    { text: "Office of Strategic Communications & Public Affairs (DDCP)", value: "DDCP",},
    { text: "Pentagon Liaison Officer / Congressional Affairs Coordinator (DDC)", value: "DDC",},
    { text: "Procurement Services (PSD)", value: "PSD",},
    { text: "Procurement Services DITCO EUR (PL5)", value: "PL5",},
    { text: "Procurement Services DITCO EUR (PL6)", value: "PL6",},
    { text: "Procurement Services DITCO PAC (PL7)", value: "PL7",},
    { text: "Procurement Services DITCO Scott (PL8)", value: "PL8",},
    {
      text: "Program Director for Culture & Employee Engagement",
      value: "Program Director for Culture & Employee Engagement",
    },
    { text: "Protocol (DDCA)", value: "DDCA",},
    {
      text: "Secretary of Defense Communications",
      value: "Secretary of Defense Communications",
    },
    { text: "Senior Enlisted Advisor (DDS)", value: "DDS",},
    { text: "Small Business Programs (DDC4)", value: "DDC4",},
    { text: "White House Communications Agency (WHCA)", value: "WHCA",},
    { text: "White House Situation Support Staff (WHSSS)", value: "WHSSS ",},
    { text: "Workforce Services and Development Directorate (WSD)", value: "WSD",},
  ];

}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;