import { describe, it, expect } from 'vitest'
import { posterUrl } from '@/shared/ui/movie-card'

describe('posterUrl', () => {
  it('returns the stored image url when present', () => {
    expect(posterUrl('https://example.com/p.png', 'Dune')).toBe('https://example.com/p.png')
  })

  it('falls back to a placeholder with the encoded title', () => {
    const url = posterUrl(null, 'Blade Runner 2049')
    expect(url).toContain('placehold.co')
    expect(url).toContain(encodeURIComponent('Blade Runner 2049'))
  })
})
