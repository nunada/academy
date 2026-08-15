import { hasSupabaseConfig, type Backend } from '../db'
import { createLocalBackend } from './local'
import { createSupabaseBackend } from './supabase'

let instance: Backend | null = null

/** One backend per page load, chosen by whether Supabase keys are present. */
export function getBackend(): Backend {
  if (!instance) {
    instance = hasSupabaseConfig ? createSupabaseBackend() : createLocalBackend()
  }
  return instance
}
