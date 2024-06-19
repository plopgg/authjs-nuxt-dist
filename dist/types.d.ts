
import type { ModuleOptions } from './module'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['authJs']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['authJs']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['authJs']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['authJs']?: ModuleOptions }
}


export type { ModuleOptions, default } from './module'
