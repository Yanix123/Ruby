import { test, expect } from '@playwright/test'

// Covers DoD #1, #2, #4, #5 (via logout), #6 end to end.
test('register → favorite a movie → persists → logout protects /favorites', async ({ page }) => {
  const email = `e2e_${Date.now()}@test.com`

  // #6 register → redirected to /movies
  await page.goto('/register')
  await page.getByLabel('Name').fill('E2E User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/movies$/)

  // #1 list renders → #2 open first movie's details
  const firstCard = page.locator('ul li a').first()
  const title = ((await firstCard.locator('h3').textContent()) ?? '').trim()
  expect(title.length).toBeGreaterThan(0)
  await firstCard.click()
  await expect(page).toHaveURL(/\/movies\/[0-9a-f-]{36}$/)

  // #4 add to favorites (optimistic → aria-pressed)
  const toggle = page.getByRole('button', {
    name: /add to favorites|in favorites/i,
  })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')

  // #4 appears on /favorites and survives a reload
  await page.goto('/favorites')
  await expect(page.getByRole('heading', { name: 'Your favorites' })).toBeVisible()
  await expect(page.getByText(title)).toBeVisible()
  await page.reload()
  await expect(page.getByText(title)).toBeVisible()

  // #5/#6 sign out → /favorites is protected again
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto('/favorites')
  await expect(page).toHaveURL(/\/login$/)
})
