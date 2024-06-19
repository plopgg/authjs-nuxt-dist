import { useAuth } from "../composables/useAuth.mjs";
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports";
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth();
  if (status.value === "authenticated") {
    return navigateTo(to?.meta?.auth?.authenticatedRedirectTo ?? useRuntimeConfig()?.public?.authJs?.authenticatedRedirectTo ?? "/");
  }
});
