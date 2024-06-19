import { defineNuxtModule, useLogger, createResolver, addImports, addTypeTemplate, addPlugin, addRouteMiddleware } from '@nuxt/kit';
import { defu } from 'defu';
import 'cookie-es';
import 'h3';

const configKey = "authJs";

const NAME = "@auth/nuxt";
const module = defineNuxtModule({
  meta: {
    name: NAME,
    configKey
  },
  defaults: {
    verifyClientOnEveryRequest: true,
    guestRedirectTo: "/",
    authenticatedRedirectTo: "/",
    baseUrl: ""
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(NAME);
    const { resolve } = createResolver(import.meta.url);
    logger.info(`Adding ${NAME} module...`, userOptions);
    const options = defu(nuxt.options.runtimeConfig.public[configKey], userOptions);
    nuxt.options.runtimeConfig.public[configKey] = options;
    addImports([{ name: "useAuth", from: resolve("./runtime/composables/useAuth") }]);
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.alias["#auth"] = resolve("./runtime/lib/server");
    });
    nuxt.options.alias["#auth"] = resolve("./runtime/lib/client");
    addTypeTemplate({
      filename: "types/auth.d.ts",
      write: true,
      getContents: () => [
        "declare module '#auth' {",
        `  const verifyClientSession: typeof import('${resolve("./runtime/lib/client")}').verifyClientSession`,
        `  const signIn: typeof import('${resolve("./runtime/lib/client")}').signIn`,
        `  const signOut: typeof import('${resolve("./runtime/lib/client")}').signOut`,
        `  const getServerSession: typeof import('${resolve("./runtime/lib/server")}').getServerSession`,
        `  const NuxtAuthHandler: typeof import('${resolve("./runtime/lib/server")}').NuxtAuthHandler`,
        `  const getServerToken: typeof import('${resolve("./runtime/lib/server")}').getServerToken`,
        "}"
      ].join("\n")
    });
    addPlugin(resolve("./runtime/plugin"));
    addRouteMiddleware({ name: "auth", path: resolve("./runtime/middleware/auth") });
    addRouteMiddleware({ name: "guest-only", path: resolve("./runtime/middleware/guest-only") });
    addRouteMiddleware({ name: "client-auth", path: resolve("./runtime/middleware/client-auth"), global: options.verifyClientOnEveryRequest });
    logger.success(`Added ${NAME} module successfully.`);
  }
});

export { module as default };
