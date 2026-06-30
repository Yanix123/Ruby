import { describe, it, expect } from 'vitest'
import { isUuid } from '@/pkg/lib'

describe('isUuid', () => {
  it('accepts a valid uuid', () => {
    expect(isUuid('7141bea4-7d29-4276-b22d-2210cfe7174d')).toBe(true)
  })

  it('rejects malformed ids', () => {
    expect(isUuid('zzz')).toBe(false)
    expect(isUuid('abc-123')).toBe(false)
    expect(isUuid('')).toBe(false)
    expect(isUuid('7141bea4-7d29-4276-b22d')).toBe(false)
  })
})
