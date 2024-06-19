import type { AuthConfig } from "@auth/core";
import type { H3Event, RequestHeaders } from "h3";
import type { RuntimeConfig } from "@nuxt/schema";
export declare const configKey: "authJs";
/**
 * Get the AuthJS secret. For internal use only.
 * @returns The secret used to sign the JWT Token
 */
export declare function getAuthJsSecret(options: AuthConfig): string;
export declare function getServerOrigin(event: H3Event, runtimeConfig?: Partial<RuntimeConfig>): any;
export declare function checkOrigin(request: Request, runtimeConfig: Partial<RuntimeConfig>): void;
export declare function makeCookiesFromCookieString(cookieString: string | null): {
    [k: string]: string;
};
export declare function makeNativeHeadersFromCookieObject(headers: Record<string, string>): Headers;
/**
 * This should be a function in H3
 * @param headers RequestHeaders
 * @returns Headers
 */
export declare function makeNativeHeaders(headers: RequestHeaders): Headers;
/**
 * This should be a function in H3
 * @param event
 * @returns
 */
export declare function getRequestFromEvent(event: H3Event): Promise<Request>;
