import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('user should be able to login', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('email').fill('usernew@gmail.com');
        await page.getByPlaceholder('password').fill('usernew');
        await page.locator('button[type="submit"]:text-is("Login")').click();

        // Verify redirect to dashboard or successful login state
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('shows error with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('email').fill('invalid@example.com');
        await page.getByPlaceholder('password').fill('wrongpassword');
        await page.locator('button[type="submit"]:text-is("Login")').click();

        // Check for error message
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });
});