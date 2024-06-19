import { useAuth } from "../composables/useAuth.mjs";
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports";
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth();
  if (status.value === "authenticated") return;
  const route = to?.meta?.auth?.guestRedirectTo ?? useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/";
  return navigateTo(route);
});
