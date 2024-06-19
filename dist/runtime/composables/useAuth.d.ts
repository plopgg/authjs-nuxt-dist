import type { Session, User } from "@auth/core/types";
import { type ComputedRef, type Ref } from "vue";
import { getProviders, signIn, signOut } from "../lib/client";
export declare function useAuth(): {
    session: Readonly<Ref<Session | null>>;
    user: ComputedRef<User | null>;
    updateSession: (u: (() => unknown) | Session | null) => void;
    status: Ref<"loading" | "authenticated" | "unauthenticated" | "error">;
    cookies: Ref<Record<string, string> | null>;
    sessionToken: ComputedRef<string>;
    removeSession: () => void;
    signIn: typeof signIn;
    signOut: typeof signOut;
    getProviders: typeof getProviders;
};
