import Vue from "vue";
import sanitizeHtml from 'sanitize-html';

export const sanitize = (content: string ): string => {
  return sanitizeHtml(content);
}

declare module 'vue/types/vue' {
    interface Vue {
      $sanitize: (content: string)=> string;
    }
  }
  
export default {
  install(): void {
    Vue.prototype.$sanitize = sanitize;
  },
};