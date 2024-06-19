import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    verifyClientOnEveryRequest?: boolean;
    guestRedirectTo?: string;
    authenticatedRedirectTo?: string;
    baseUrl: string;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleOptions, _default as default };
