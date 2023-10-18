import sanitizeHtml from 'sanitize-html';
import { App } from "vue";

export const sanitize = (content: string ): string => {
  return sanitizeHtml(content);
}
export default {
  install(app: App<any>): void {
    app.config.globalProperties.$sanitize = sanitize;
  },
};