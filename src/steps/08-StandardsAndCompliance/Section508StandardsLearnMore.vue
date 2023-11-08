<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Understanding Section 508 Compliance</h2>
    <p> 
      In 1998, Congress amended the Rehabilitation Act to require Federal agencies to make 
      their electronic and information technology accessible to people with disabilities. 
      Inaccessible technology interferes with an individual’s ability to obtain and use 
      information quickly and easily. 
    </p>
    <p>
      Section 508 was enacted to eliminate barriers in information technology, to make 
      available new opportunities for people with disabilities, and to encourage development 
      of technologies that will help achieve these goals. As a result, an organization’s 
      requirements official must complete a Section 508 assessment and include accessibility 
      requirements in all procurement request packages.
    </p>
    <p>
      For more information, visit:
      <ul class="mt-4 _atat-ul">
        <li>
          <a 
            href="https://www.section508.gov"
            target="_blank"
            class="_text-link"
          >
            <span class="_external-link">Section508.gov</span>
          </a>
        </li>
        <li>
          <a 
            href="https://www.section508.gov/art/" 
            target="_blank"
            class="_text-link"
          >
            Accessibility Requirements Tool <span class="_external-link">(ART)</span>
          </a>
        </li>
        <li>
          <a 
            href="https://www.access-board.gov/ict/" 
            target="_blank"
            class="_text-link"
          >
            Information and Communication Technology 
            (ICT)–Revised 508 Standards and 255 <span class="_external-link">Guidelines</span>
          </a>
        </li>
      </ul>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";

@Component({})
class Section508StandardsLearnMore extends Vue {
}
export default toNative(Section508StandardsLearnMore)
</script>
