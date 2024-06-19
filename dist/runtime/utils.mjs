import { parse } from "cookie-es";
import { getMethod, getRequestHeaders, getRequestURL, readRawBody } from "h3";
export const configKey = "authJs";
export function getAuthJsSecret(options) {
  const secret = options?.secret || process.env.NUXT_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("[authjs-nuxt] No secret found, please set a secret in your [...].ts handler or use environment variables");
  return secret;
}
export function getServerOrigin(event, runtimeConfig) {
  const requestOrigin = getRequestHeaders(event).Origin;
  const serverOrigin = runtimeConfig?.public?.authJs?.baseUrl ?? "";
  const origin = requestOrigin ?? serverOrigin.length > 0 ? serverOrigin : process.env.AUTH_ORIGIN;
  if (!origin) throw new Error("No Origin found ...");
  return origin;
}
export function checkOrigin(request, runtimeConfig) {
  if (process.env.NODE_ENV === "development") return;
  if (request.method !== "POST") return;
  return;
  const requestOrigin = request.headers.get("Origin");
  const serverOrigin = runtimeConfig.public?.authJs?.baseUrl;
  if (serverOrigin !== requestOrigin)
    throw new Error("CSRF protected");
}
export function makeCookiesFromCookieString(cookieString) {
  if (!cookieString) return {};
  return Object.fromEntries(
    Object.entries(parse(cookieString)).filter(([k]) => k.includes("next-auth"))
  );
}
export function makeNativeHeadersFromCookieObject(headers) {
  const nativeHeaders = new Headers(Object.entries(headers).map(([key, value]) => ["set-cookie", `${key}=${value}`]));
  return nativeHeaders;
}
export function makeNativeHeaders(headers) {
  const nativeHeaders = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    if (value) nativeHeaders.append(key, value);
  });
  return nativeHeaders;
}
export async function getRequestFromEvent(event) {
  const url = new URL(getRequestURL(event));
  const method = getMethod(event);
  const body = method === "POST" ? await readRawBody(event) : void 0;
  return new Request(url, { headers: getRequestHeaders(event), method, body });
}
