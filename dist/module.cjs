'use strict';

const kit = require('@nuxt/kit');
const defu = require('defu');
require('cookie-es');
require('h3');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const configKey = "authJs";

const NAME = "@auth/nuxt";
const module$1 = kit.defineNuxtModule({
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
    const logger = kit.useLogger(NAME);
    const { resolve } = kit.createResolver((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('module.cjs', document.baseURI).href)));
    logger.info(`Adding ${NAME} module...`, userOptions);
    const options = defu.defu(nuxt.options.runtimeConfig.public[configKey], userOptions);
    nuxt.options.runtimeConfig.public[configKey] = options;
    kit.addImports([{ name: "useAuth", from: resolve("./runtime/composables/useAuth") }]);
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.alias["#auth"] = resolve("./runtime/lib/server");
    });
    nuxt.options.alias["#auth"] = resolve("./runtime/lib/client");
    kit.addTypeTemplate({
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
    kit.addPlugin(resolve("./runtime/plugin"));
    kit.addRouteMiddleware({ name: "auth", path: resolve("./runtime/middleware/auth") });
    kit.addRouteMiddleware({ name: "guest-only", path: resolve("./runtime/middleware/guest-only") });
    kit.addRouteMiddleware({ name: "client-auth", path: resolve("./runtime/middleware/client-auth"), global: options.verifyClientOnEveryRequest });
    logger.success(`Added ${NAME} module successfully.`);
  }
});

module.exports = module$1;
