import { makeNativeHeadersFromCookieObject } from "../utils.mjs";
import { useAuth } from "../composables/useAuth.mjs";
import { navigateTo, reloadNuxtApp, useRouter } from "#imports";
async function postToInternal({
  url,
  options,
  csrfToken,
  callbackUrl
}) {
  const response = await $fetch.raw(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    // @ts-expect-error -- ignore
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl
    })
  });
  return response;
}
export async function signIn(providerId, options, authorizationParams) {
  const { status } = useAuth();
  try {
    status.value = "loading";
    const { callbackUrl = window.location.href, redirect = true } = options ?? {};
    const isCredentials = providerId === "credentials";
    const isEmail = providerId === "email";
    const isSupportingReturn = isCredentials || isEmail;
    const signInUrl = `/api/auth/${isCredentials ? "callback" : "signin"}/${providerId}`;
    const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`;
    const response = await postToInternal({ url: _signInUrl, options, callbackUrl });
    const url = response?._data?.url ?? null;
    const error = url ? new URL(url).searchParams.get("error") : null;
    if (error) throw new Error(error);
    if (isCredentials && !redirect) reloadNuxtApp({ persistState: true, force: true });
    if (redirect || !isSupportingReturn) {
      const to = url ?? callbackUrl;
      console.log(`Redirecting, navigating to ${to}`);
      await navigateTo(to, { external: true });
      if (to?.includes("#")) reloadNuxtApp({ persistState: true, force: true });
      return;
    }
    return response;
  } catch (error) {
    status.value = "error";
    throw error;
  }
}
export async function signOut(options) {
  const { status } = useAuth();
  try {
    status.value = "unauthenticated";
    const { callbackUrl = window.location.href } = options ?? {};
    const data = await $fetch("/api/auth/signout", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1"
      },
      body: new URLSearchParams({
        callbackUrl
      })
    });
    useAuth().removeSession();
    const url = data?.url ?? callbackUrl;
    await useRouter().push({ path: new URL(url).pathname, force: true });
    if (url.includes("#")) reloadNuxtApp({ persistState: true });
  } catch (error) {
    status.value = "error";
    throw error;
  }
}
export async function getProviders() {
  return $fetch("/api/auth/providers");
}
export async function verifyClientSession() {
  const { updateSession, cookies, removeSession } = useAuth();
  try {
    if (cookies.value === null)
      throw new Error("No session found");
    const data = await $fetch("/api/auth/session", {
      headers: makeNativeHeadersFromCookieObject(cookies.value)
    });
    const hasSession = data && Object.keys(data).length;
    if (hasSession) updateSession(data);
    if (!hasSession) throw new Error("No session found");
    return true;
  } catch (error) {
    removeSession();
    return false;
  }
}
