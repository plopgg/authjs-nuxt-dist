import { useAuth } from "./composables/useAuth.mjs";
import { makeCookiesFromCookieString } from "./utils.mjs";
import { defineNuxtPlugin, useRequestHeaders } from "#app";
export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    const { updateSession, removeSession, cookies } = useAuth();
    const headers = useRequestHeaders();
    const data = await $fetch("/api/auth/session", {
      headers
    });
    const hasSession = data && Object.keys(data).length;
    if (hasSession) {
      updateSession(data);
      cookies.value = makeCookiesFromCookieString(headers.cookie);
    }
    if (!hasSession) removeSession();
  }
});
