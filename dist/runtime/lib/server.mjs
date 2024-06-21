import { Auth, skipCSRFCheck } from "@auth/core";
import { eventHandler, getRequestHeaders, getRequestURL } from "h3";
import { getToken } from "@auth/core/jwt";
import { checkOrigin, getAuthJsSecret, getRequestFromEvent, getServerOrigin, makeCookiesFromCookieString } from "../utils.mjs";
import cloneDeep from "lodash.clonedeep";
if (!globalThis.crypto) {
  console.log("Polyfilling crypto...");
  import("node:crypto").then((crypto) => {
    Object.defineProperty(globalThis, "crypto", {
      value: crypto.webcrypto,
      writable: false,
      configurable: true
    });
  });
}
export function NuxtAuthHandler(options, runtimeConfig) {
  return eventHandler(async (event) => {
    options.trustHost ??= true;
    options.skipCSRFCheck = skipCSRFCheck;
    const request = await getRequestFromEvent(event);
    if (request.url.includes(".js.map")) return;
    checkOrigin(request, runtimeConfig);
    const newOptions = cloneDeep(options);
    for (const provider of event.context.providers) {
      newOptions.providers = newOptions.providers.map((p) => p.id === provider.provider ? { ...p, options: provider.options } : p);
    }
    const response = await Auth(request, newOptions);
    return response;
  });
}
export async function getServerSession(event, options) {
  const response = await getServerSessionResponse(event, options);
  const { status = 200 } = response;
  const data = await response.json();
  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}
export async function getServerToken(event, options, runtimeConfig) {
  const response = await getServerSessionResponse(event, options);
  const cookies = Object.fromEntries(response.headers.entries());
  const parsedCookies = makeCookiesFromCookieString(cookies["set-cookie"]);
  const parameters = {
    req: {
      cookies: parsedCookies,
      headers: response.headers
    },
    // see https://github.com/nextauthjs/next-auth/blob/a79774f6e890b492ae30201f24b3f7024d0d7c9d/packages/core/src/jwt.ts
    secureCookie: getServerOrigin(event, runtimeConfig).startsWith("https://"),
    secret: getAuthJsSecret(options)
  };
  return getToken(parameters);
}
async function getServerSessionResponse(event, options) {
  options.trustHost ??= true;
  const url = new URL("/api/auth/session", getRequestURL(event));
  return Auth(
    new Request(url, { headers: getRequestHeaders(event) }),
    options
  );
}
