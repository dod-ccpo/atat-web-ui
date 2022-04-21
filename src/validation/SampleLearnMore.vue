<template>
  <div>
    <h2 class="mb-4">Sample for Testing</h2>
    <p>
      Bacon ipsum dolor amet meatloaf chislic tongue biltong, venison sausage strip steak cupim 
      salami ground round porchetta pork belly turkey rump jowl. Beef ribs leberkas doner, 
      turducken tongue filet mignon chislic ham ground round bresaola fatback short ribs. Pork 
      belly ham hock biltong ball tip. Pork tenderloin pork loin buffalo, short loin chislic 
      pork belly biltong t-bone fatback alcatra sausage bresaola tail.
    </p>
    <p>
      Meatball capicola beef, fatback kevin chuck ball tip andouille cow cupim kielbasa. Jerky 
      andouille ribeye doner tongue, biltong pig. Biltong t-bone jerky ribeye, pastrami burgdoggen 
      fatback kielbasa pork belly. Pork turkey jowl andouille hamburger.
    </p>
    <ATATExpandableLink aria-id="ContactFAQ2">
      <template v-slot:header>
        Why can’t I update my profile in ATAT?
      </template>
      <template v-slot:content>
        <p>
          ATAT uses Global Directory for CAC authentication. GD is an
          enterprise identity solution that provides a trusted single source
          of truth for digital authentication for every DoD employee.
        </p>
        <p>
          When you update your contact information on the
          <a href="https://idco.dmdc.osd.mil/idco/" target="_blank"
            >ID Card Office Online (IDCO)
            <span class="_external-link">website</span></a
          >, it is automatically updated anywhere you use your CAC, saving you
          the time and hassle of updating your information on multiple DoD
          websites.
        </p>
      </template>
    </ATATExpandableLink>
    <p>
      Burgdoggen beef sirloin shank doner leberkas biltong ball tip pork belly bresaola ham cupim 
      andouille beef ribs picanha. Cupim biltong t-bone, jerky filet mignon meatball cow buffalo 
      turkey ham hock doner tongue. Shankle bresaola pork belly beef. Swine prosciutto turducken 
      pork chop chicken meatloaf kielbasa alcatra brisket. Swine pancetta chuck meatloaf beef ribs 
      ball tip. Cupim bresaola swine flank landjaeger ball tip.
    </p>
    <p>
      Bacon swine filet mignon shankle leberkas cupim fatback spare ribs. Burgdoggen pastrami ham
      swine shank pork loin fatback strip steak bresaola. Pork chop tri-tip tenderloin boudin
      sirloin jowl t-bone shank chislic salami meatball capicola hamburger ball tip short ribs. 
      Andouille fatback tail sausage, venison pork chop brisket biltong pig strip steak cow 
      shankle. Landjaeger andouille meatball venison pig. Pork sirloin biltong ham hock flank 
      ham alcatra jowl fatback short ribs ball tip corned beef brisket leberkas. Spare ribs 
      swine ham flank t-bone meatball.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

@Component({
  components: {
    ATATExpandableLink,
  }
})

export default class SampleLearnMore extends Vue {}
</script>
