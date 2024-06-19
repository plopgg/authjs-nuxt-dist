import { produce } from "immer";
import { computed, readonly, watch } from "vue";
import { getProviders, signIn, signOut } from "../lib/client.mjs";
import { useState } from "#imports";
export function useAuth() {
  const session = useState("auth:session", () => null);
  const cookies = useState("auth:cookies", () => ({}));
  const status = useState("auth:session:status", () => "unauthenticated");
  const sessionToken = computed(() => cookies.value?.["next-auth.session-token"] ?? "");
  const user = computed(() => session.value?.user ?? null);
  watch(session, (newSession) => {
    if (newSession === null)
      return status.value = "unauthenticated";
    if (Object.keys(newSession).length)
      return status.value = "authenticated";
  });
  const updateSession = (u) => {
    session.value = typeof u === "function" ? produce(session.value, u) : u;
  };
  const removeSession = () => {
    cookies.value = null;
    updateSession(null);
  };
  return {
    session: readonly(session),
    user,
    updateSession,
    status,
    cookies,
    sessionToken,
    removeSession,
    signIn,
    signOut,
    getProviders
  };
}
