import { ValidationPlugin } from "@/plugins/validation";

export {}

declare module 'vue' {
    interface ComponentCustomProperties {
        $sanitize: (content: string) => string;
        $validators: ValidationPlugin
    }
}

// webstorm IDE bug causes issues with module vue, @vue/runtime-core fixes
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $sanitize: (content: string) => string;
        $validators: ValidationPlugin
    }
}