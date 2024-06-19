import type { RuntimeConfig } from "nuxt/schema";
import type { H3Event } from "h3";
import type { AuthConfig, Session } from "@auth/core/types";
/**
 * This is the event handler for the catch-all route.
 * Everything can be customized by adding a custom route that takes priority over the handler.
 * @param options AuthConfig
 * @param runtimeConfig RuntimeConfig
 * @returns EventHandler
 */
export declare function NuxtAuthHandler(options: AuthConfig, runtimeConfig: RuntimeConfig): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<Response | undefined>>;
/**
 * Get and returns the session.
 * @param event H3Event
 * @param options AuthConfig
 * @returns Session
 */
export declare function getServerSession(event: H3Event, options: AuthConfig): Promise<Session | null>;
/**
 * Returns the JWT Token.
 * @param event H3Event
 * @param options AuthConfig
 * @returns JWT Token
 */
export declare function getServerToken(event: H3Event, options: AuthConfig, runtimeConfig?: Partial<RuntimeConfig>): Promise<import("@auth/core/jwt").JWT | null>;
