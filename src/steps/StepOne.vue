<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="col-12">
          <h2>Let’s start with basic info about your new acquisition</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span
            >In this section, we will gather some overarching details about your
            project requirements, organization, and points of contact. This
            information will be used to complete your required acquisition forms
            and will also help us to guide you through the JWCC procurement
            process.</span
          >
          <div class="mt-10">
            <ATATTextField
              label="Project/Requirements Title"
              class="input-max-width"
              helpText="Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms."
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 content-max-width">
            <span class="font-weight-bold"> What is the scope of your requirement? </span>
            <span
              >Briefly describe the type of resources and services to be
              acquired, and what is necessary to achieve mission specific
              outcomes for this particluar task (e.g., move DITCO’s contract
              writing system to a cloud environment).</span
            >
             <ATATTextArea
              label=""
              width="width-100"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ATATAutoComplete from "../components/ATATAutoComplete.vue";
import ATATTextField from "../components/ATATTextField.vue";
import ATATTextArea from "../components/ATATTextArea.vue";

import Vue from "vue";

import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATTextField,
    ATATTextArea
  },
})
export default class StepOne extends Vue {
  private show = true;

  private select = null;
  private items = ["Programming", "Design", "Vue", "Vuetify"];
  private selectedContact = {};
  private customTextValue = "";
  private tooltipTxt = "hello from tooltip";
  private radioValue = "";

  get contactIsSelected(): boolean {
    return (
      this.selectedContact &&
      Object.prototype.hasOwnProperty.call(this.selectedContact, "FullName")
    );
  }

  private noAutoCompleteResultsAction(): void {
    alert("do something");
  }

  private searchData = [
    {
      Id: 1,
      FirstName: "Selia",
      LastName: "Wentzel",
      FullName: "Selia Wentzel",
      Email: "sel.wentz@acusage.net",
    },
    {
      Id: 2,
      FirstName: "Mekia",
      LastName: "McPeak",
      FullName: "Mekia McPeak",
      Email: "mek_mcpeak@consolidated-farm-research.net",
    },
    {
      Id: 3,
      FirstName: "Galvin",
      LastName: "Sands",
      FullName: "Galvin Sands",
      Email: "gal_san@egl-inc.info",
    },
    {
      Id: 4,
      FirstName: "Carl",
      LastName: "Tittle",
      FullName: "Carl Tittle",
      Email: "carltittl@diaperstack.com",
    },
    {
      Id: 5,
      FirstName: "Stoyan",
      LastName: "Barre",
      FullName: "Stoyan Barre",
      Email: "stoya.barr@autozone-inc.info",
    },
    {
      Id: 6,
      FirstName: "Deva",
      LastName: "Ainsworth",
      FullName: "Deva Ainsworth",
      Email: "de_ainswo@careful-organics.org",
    },
    {
      Id: 7,
      FirstName: "Tim",
      LastName: "Hurtado",
      FullName: "Tim Hurtado",
      Email: "tihurt@egl-inc.info",
    },
    {
      Id: 8,
      FirstName: "Neerja",
      LastName: "Gioia",
      FullName: "Neerja Gioia",
      Email: "neerja-gioi@egl-inc.info",
    },
    {
      Id: 9,
      FirstName: "Stacia",
      LastName: "Mock",
      FullName: "Stacia Mock",
      Email: "staci_mo@acusage.net",
    },
    {
      Id: 10,
      FirstName: "Ujjwala",
      LastName: "Hawkinson",
      FullName: "Ujjwala Hawkinson",
      Email: "ujj.hawkinso@careful-organics.org",
    },
    {
      Id: 11,
      FirstName: "Odessa",
      LastName: "Dahlin",
      FullName: "Odessa Dahlin",
      Email: "odes.dahl@consolidated-farm-research.net",
    },
    {
      Id: 12,
      FirstName: "Beathan",
      LastName: "Lydon",
      FullName: "Beathan Lydon",
      Email: "beatha_lydon@arvinmeritor.info",
    },
    {
      Id: 13,
      FirstName: "Ashby",
      LastName: "Carraway",
      FullName: "Ashby Carraway",
      Email: "ashby.carr@egl-inc.info",
    },
    {
      Id: 14,
      FirstName: "Vivian",
      LastName: "Gresham",
      FullName: "Vivian Gresham",
      Email: "vivia-gres@autozone-inc.info",
    },
    {
      Id: 15,
      FirstName: "Elnora",
      LastName: "Rojas",
      FullName: "Elnora Rojas",
      Email: "elnorro@acusage.net",
    },
    {
      Id: 16,
      FirstName: "Devnet",
      LastName: "Severino",
      FullName: "Devnet Severino",
      Email: "devn-sever@arketmay.com",
    },
    {
      Id: 17,
      FirstName: "Halima",
      LastName: "Plumley",
      FullName: "Halima Plumley",
      Email: "hali_pluml@egl-inc.info",
    },
    {
      Id: 18,
      FirstName: "Narkeasha",
      LastName: "Wheeler",
      FullName: "Narkeasha Wheeler",
      Email: "narkwheeler@arketmay.com",
    },
    {
      Id: 19,
      FirstName: "Emlen",
      LastName: "Cheung",
      FullName: "Emlen Cheung",
      Email: "emlen_cheun@autozone-inc.info",
    },
    {
      Id: 20,
      FirstName: "Ishi",
      LastName: "Barre",
      FullName: "Ishi Barre",
      Email: "ishi.bar@autozone-inc.info",
    },
    {
      Id: 21,
      FirstName: "Riba",
      LastName: "Smithey",
      FullName: "Riba Smithey",
      Email: "riba.smi@diaperstack.com",
    },
    {
      Id: 22,
      FirstName: "Griselda",
      LastName: "Holder",
      FullName: "Griselda Holder",
      Email: "griseld.holde@egl-inc.info",
    },
    {
      Id: 23,
      FirstName: "Branko",
      LastName: "Schuler",
      FullName: "Branko Schuler",
      Email: "brank.sc@progressenergyinc.info",
    },
    {
      Id: 24,
      FirstName: "Maria",
      LastName: "Odum",
      FullName: "Maria Odum",
      Email: "marodum@egl-inc.info",
    },
    {
      Id: 25,
      FirstName: "Tyack",
      LastName: "Buda",
      FullName: "Tyack Buda",
      Email: "tyacbuda@arvinmeritor.info",
    },
    {
      Id: 26,
      FirstName: "Grania",
      LastName: "Butcher",
      FullName: "Grania Butcher",
      Email: "gran.butc@arketmay.com",
    },
    {
      Id: 27,
      FirstName: "Carl",
      LastName: "Flock",
      FullName: "Carl Flock",
      Email: "carlfloc@consolidated-farm-research.net",
    },
    {
      Id: 28,
      FirstName: "Klavdia",
      LastName: "Raabe",
      FullName: "Klavdia Raabe",
      Email: "klavdia-raa@diaperstack.com",
    },
    {
      Id: 29,
      FirstName: "Bronya",
      LastName: "Pixley",
      FullName: "Bronya Pixley",
      Email: "brony.pixley@autozone-inc.info",
    },
    {
      Id: 30,
      FirstName: "Timoleon",
      LastName: "Holder",
      FullName: "Timoleon Holder",
      Email: "timoleo.hold@acusage.net",
    },
    {
      Id: 31,
      FirstName: "Yashovarman",
      LastName: "Brubaker",
      FullName: "Yashovarman Brubaker",
      Email: "yasho-bruba@careful-organics.org",
    },
    {
      Id: 32,
      FirstName: "Marcell",
      LastName: "Turbeville",
      FullName: "Marcell Turbeville",
      Email: "marc.tu@acusage.net",
    },
    {
      Id: 33,
      FirstName: "Diego",
      LastName: "Plumley",
      FullName: "Diego Plumley",
      Email: "diego_plu@arketmay.com",
    },
    {
      Id: 34,
      FirstName: "Sugriva",
      LastName: "Haugen",
      FullName: "Sugriva Haugen",
      Email: "sugriva-hauge@egl-inc.info",
    },
    {
      Id: 35,
      FirstName: "Ashby",
      LastName: "Petro",
      FullName: "Ashby Petro",
      Email: "ashbpe@careful-organics.org",
    },
    {
      Id: 36,
      FirstName: "Snout",
      LastName: "Shell",
      FullName: "Snout Shell",
      Email: "snoutshe@diaperstack.com",
    },
    {
      Id: 37,
      FirstName: "Stina",
      LastName: "Lammers",
      FullName: "Stina Lammers",
      Email: "sti.lam@consolidated-farm-research.net",
    },
    {
      Id: 38,
      FirstName: "Feodora",
      LastName: "Mullinax",
      FullName: "Feodora Mullinax",
      Email: "fe_mullinax@consolidated-farm-research.net",
    },
    {
      Id: 39,
      FirstName: "Beyers",
      LastName: "Featherstone",
      FullName: "Beyers Featherstone",
      Email: "beyers-feathers@careful-organics.org",
    },
    {
      Id: 40,
      FirstName: "Chin",
      LastName: "Woodberry",
      FullName: "Chin Woodberry",
      Email: "chi.woodb@diaperstack.com",
    },
    {
      Id: 41,
      FirstName: "Louie",
      LastName: "Rector",
      FullName: "Louie Rector",
      Email: "loui.rector@diaperstack.com",
    },
    {
      Id: 42,
      FirstName: "Zelman",
      LastName: "Sullins",
      FullName: "Zelman Sullins",
      Email: "zelman-su@consolidated-farm-research.net",
    },
    {
      Id: 43,
      FirstName: "Rosemary",
      LastName: "Fell",
      FullName: "Rosemary Fell",
      Email: "ro-fell@consolidated-farm-research.net",
    },
    {
      Id: 44,
      FirstName: "Hewett",
      LastName: "York",
      FullName: "Hewett York",
      Email: "hewyork@arketmay.com",
    },
    {
      Id: 45,
      FirstName: "Bronya",
      LastName: "Brinson",
      FullName: "Bronya Brinson",
      Email: "brony-brinson@progressenergyinc.info",
    },
    {
      Id: 46,
      FirstName: "Ricky",
      LastName: "Hitchcock",
      FullName: "Ricky Hitchcock",
      Email: "rickhitc@arvinmeritor.info",
    },
    {
      Id: 47,
      FirstName: "Zoello",
      LastName: "Balch",
      FullName: "Zoello Balch",
      Email: "zoe_ba@egl-inc.info",
    },
    {
      Id: 48,
      FirstName: "Odessa",
      LastName: "Moura",
      FullName: "Odessa Moura",
      Email: "od.mou@arketmay.com",
    },
    {
      Id: 49,
      FirstName: "Agape",
      LastName: "Seaton",
      FullName: "Agape Seaton",
      Email: "aga.seato@progressenergyinc.info",
    },
    {
      Id: 50,
      FirstName: "Saxona",
      LastName: "Mapes",
      FullName: "Saxona Mapes",
      Email: "sax_map@autozone-inc.info",
    },
  ];
}
</script>

