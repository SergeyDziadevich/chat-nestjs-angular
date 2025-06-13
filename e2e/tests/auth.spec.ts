import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('user should be able to login', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('email').fill('usernew@gmail.com');
        await page.getByPlaceholder('password').fill('usernew');
        await page.locator('button[type="submit"]').click();

        // Verify redirect to dashboard or successful login state
        await expect(page).toHaveURL(/.*dashboard/);
    })
});