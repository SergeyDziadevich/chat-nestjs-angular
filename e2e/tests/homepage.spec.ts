import { test, expect } from '@playwright/test';

test('homepage should have the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Frontend/);
});

test('user can navigate to login page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.mat-mdc-card-title')).toBeVisible();
    await expect(page).toHaveURL(/.*public\/login/);
});