import type { DumpOptions } from 'js-yaml'
// eslint-disable-next-line no-restricted-imports
import { load, dump } from 'js-yaml'
import { memoize } from 'lodash'

export const yamlStringify = (obj: unknown, options: Omit<DumpOptions, 'noRefs'> = {}): string => {
  return dump(obj, { noRefs: true, lineWidth: -1, quotingType: '"', ...options })
}

export function yamlParse<T = unknown>(input: string): T {
  return load(input) as T
}

export const memoizedParse = memoize(yamlParse)

/* re-export to maintain API with yaml package */
export const parse = yamlParse
export const stringify = yamlStringify