import { ValidationPlugin } from "@/plugins/validation";

export {}

declare module 'vue' {
    interface ComponentCustomProperties {
        $sanitize: (content: string) => string;
        $validators: ValidationPlugin
    }
}