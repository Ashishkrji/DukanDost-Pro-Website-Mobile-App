import { test, expect } from '@playwright/test';

test('User can login successfully', async ({ page }) => {
  await page.goto('/login');

  // Fill login form
  await page.fill('input[placeholder*="Phone Number"]', '9876543210');
  await page.fill('input[type="password"]', 'password123');
  
  // Click login button
  await page.click('button:has-text("Login")');

  // Should be redirected to dashboard
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');
});
