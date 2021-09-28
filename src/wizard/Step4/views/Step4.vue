<template>
  <div>

    <h2>Step 4 View</h2>

    <!-- EJY create this in code -->
    <div id="widthFaker" ref="widthFaker"></div>

    <div
      id="EmailInputWrapper"
      class="pa-2 email-wrapper"
      @click="addEmail"
    >
        <v-text-field
          v-for="email in emailList"
          :key="email.id"
          :id="'emailPill_' + email.id"
          :ref="'e_' + email.id"
          class="pill"
          :data-email-id="email.id"
          v-model="email.value"
          append-icon="close"
          @click="emailEdit"
          @blur="emailBlurred"
          @click:append="removeEmail"
        />

    </div>


    <div style="height:300px"></div>

  </div>

</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_4 extends Vue {

  private select = [];
  private chips = [];
  private search = ""; //sync search

  private emailList: { value: string, id: number }[] = [
    { value: 'mail1@mail.mil', id: 1 },
    { value: 'mail222@mail222.mil', id: 2 },
    { value: 'me@my.mil', id: 3 },
    { value: 'this.is.a.very.long.email@address.mil', id: 4 },
  ];

  get widthFaker() {
    return this.$refs.widthFaker as HTMLElement;
  }

  public async mounted(): Promise<void> {
    this.$store.dispatch("saveStepModel", [{}, 4, true]);

    // set width of email inputs
    const self = this;
    await this.$nextTick(function () {
      self.emailList.forEach((email, index) => {
        self.widthFaker.innerHTML = email.value;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    });

  }

  public addEmail(e: Event): void {
    let len = this.emailList.length;
    if (len === 0 || this.emailList[len - 1].value !== "") {
      const emailId = Date.now();
      this.emailList.push({value: "", id: emailId });
      const self = this;
      Vue.nextTick(function () {
        let newInput = document.querySelector("[data-email-id='" + emailId + "']")  as HTMLInputElement;
        newInput.style.width = "40px"
        newInput?.focus();
        newInput.addEventListener('input', () => {
          self.widthFaker.innerHTML = newInput.value;
          const w = self.widthFaker.offsetWidth + "px"
          newInput.style.width = w;
        });

      });
    }
  }

  public doPaste(e: Event): void {
    // see below for plain text pasting
    // https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand

    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text");
    let emailAddresses = pastedData.split(", ");
    this.emailList.push.apply(this.emailList, emailAddresses);
    //debugger;
  }

  public onInput(e: Event): void {
    console.log(e.target.innerText);
  }

    public meowInput(e1: any) {
      console.log(this.search);
      if (this.search && this.search.split(",").length > 1) {
        this.chips = this.chips.concat(
          this.search.split(",").filter((term) => !this.chips.includes(term))
        );
        this.search = "";
      }
    };
    public remove(item: any) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    };

  public removeEmail(e: Event) {
    const thisButton = e.target as HTMLButtonElement;
    var closestElement = thisButton.closest('.v-input__slot') as HTMLElement;
    var thisInput = closestElement.querySelector('input[type=text]') as HTMLInputElement;
    const emailId = thisInput.dataset.emailId;
    // already have this in emailBlurred if value is empty
    // make this DRY!
    debugger;
    if (emailId) {
      const vTextFieldRef = "e_" + emailId;
      const vTextField = this.$refs[vTextFieldRef];

      const id: number  = parseInt(emailId);
      this.emailList = this.emailList.filter(function( obj ) {
        return obj.id !== id;
      });
      // need to reset input widths now... 
      // make this DRY - also in mounted
      const self = this;
      this.emailList.forEach((email, index) => {
        self.widthFaker.innerHTML = email.value;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    }

  }

  public emailEdit(e: Event) {
    let foo = this.$vnode.key;
debugger;
    e.preventDefault();
    e.cancelBubble = true;
    const input = e.currentTarget as HTMLInputElement;
    input.addEventListener('input', () => {
      this.widthFaker.innerHTML = input.value;
      const w = this.widthFaker.offsetWidth + "px"
      input.style.width = w;
    });
  }

  public emailBlurred(e: Event) {
    // debugger;
    const input = e.target as HTMLInputElement;
    
    if (!input.value.length) {
      const emailId = input.dataset.emailId;
      if (emailId) {
        const vTextFieldRef = "e_" + emailId;
        const vTextField = this.$refs[vTextFieldRef];

        const id: number  = parseInt(emailId);
        this.emailList = this.emailList.filter(function( obj ) {
          return obj.id !== id;
        });
        // need to reset input widths now... 
        // make this DRY - also in mounted
        const self = this;
        this.emailList.forEach((email, index) => {
          self.widthFaker.innerHTML = email.value;
          const w = self.widthFaker.offsetWidth + "px";
          const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
          emailInput.style.width = w;
        });
      }
    } else {
      this.widthFaker.innerHTML = input.value;
      const w = this.widthFaker.offsetWidth + "px";
      input.style.width = w;
    }
  }


}
</script>

<style lang="scss">
  div#widthFaker {
    outline: 1px solid green;
    display: inline-block;
    font-size: 16px;
    position: absolute;
    left: -10000px;
    top: -10000px;
  }

  .email-wrapper {
    border:2px solid #005EA2;
    height: 150px;
    margin-bottom: 20px;
    width: 100%;
    max-width:550px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .v-input__append-inner {
    // margin-top: 0 !important;
  }

  .pill.v-text-field {
    display: inline-block;
    height: 32px;
    border: 1px solid transparent;
    border-radius: 15px;
    background-color: #D9E8F6;
    padding: 0 4px 0 12px;
    line-height: 22px;
    margin: 3px;
    position: relative;
    z-index: 2;
    
    input {
      height: 32px;
      max-height: 32px;
      line-height: 32px;
      padding: 0;
    }

    &.v-input--is-focused {
      background-color: transparent;
      // background-color: rgb(231, 255, 192);
      .v-input__append-inner {
        // display: none !important;
        opacity: 0;
      }
    }
    .v-input__slot {
      &:before, &:after {
        display: none;
      }
    }

  }

</style>
