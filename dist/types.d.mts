
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['authJs']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['authJs']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['authJs']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['authJs']?: ModuleOptions }
}


export type { ModuleOptions, default } from './module.js'
