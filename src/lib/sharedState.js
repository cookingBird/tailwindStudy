import pkg from '../../package.json'
let OXIDE_DEFAULT_ENABLED = pkg.tailwindcss.engine === 'oxide'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  DEBUG: resolveDebug(process.env.DEBUG),
  ENGINE: pkg.tailwindcss.engine,
  OXIDE: resolveBoolean(process.env.OXIDE, OXIDE_DEFAULT_ENABLED),
}
/**
 * !sourcePathContextMap，key值为sourcePath,value值为文件的context
 */
export const contextMap = new Map()
/**
 * !tailwind.config.js文件对应的context,key值为配置文件的object-hash，value为对应的context
 */
export const configContextMap = new Map()
/**
 * !tailwind.config.js文件对应的sourceMap
 * !key值为tailwind.config.js文件对应的context，value为对应的sourceMap
 */
export const contextSourcesMap = new Map()
/**
 * !sourceHashMap,key值为sourcePath，value为文件的hash值
 */
export const sourceHashMap = new Map()
export const NOT_ON_DEMAND = new String('*')

export const NONE = Symbol('__NONE__')

function resolveBoolean (value, defaultValue) {
  if (value === undefined) {
    return defaultValue
  }

  if (value === '0' || value === 'false') {
    return false
  }

  return true
}

export function resolveDebug (debug) {
  if (debug === undefined) {
    return false
  }

  // Environment variables are strings, so convert to boolean
  if (debug === 'true' || debug === '1') {
    return true
  }

  if (debug === 'false' || debug === '0') {
    return false
  }

  // Keep the debug convention into account:
  // DEBUG=* -> This enables all debug modes
  // DEBUG=projectA,projectB,projectC -> This enables debug for projectA, projectB and projectC
  // DEBUG=projectA:* -> This enables all debug modes for projectA (if you have sub-types)
  // DEBUG=projectA,-projectB -> This enables debug for projectA and explicitly disables it for projectB

  if (debug === '*') {
    return true
  }

  let debuggers = debug.split(',').map(d => d.split(':')[0])

  // Ignoring tailwindcss
  if (debuggers.includes('-tailwindcss')) {
    return false
  }

  // Including tailwindcss
  if (debuggers.includes('tailwindcss')) {
    return true
  }

  return false
}
