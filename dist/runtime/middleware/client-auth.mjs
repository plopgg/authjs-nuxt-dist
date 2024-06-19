import { verifyClientSession } from "../lib/index.mjs";
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports";
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  const valid = await verifyClientSession();
  if (valid) return;
  if (["client-auth", "auth"].includes(to.meta.middleware) || to.meta.auth === true)
    return navigateTo(to?.meta?.auth?.guestRedirectTo ?? useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/");
});
