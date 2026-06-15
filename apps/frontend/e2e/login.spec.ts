import { expect, test } from '@playwright/test';
import { TEST_USER, TEST_USER_FIRST_NAME } from './test-user';

test.describe('Login flow', () => {
  test('logs in and lands on the session-driven dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#login-email', TEST_USER.email);
    await page.fill('#login-senha', TEST_USER.password);
    // Submit stays disabled until the privacy policy is accepted.
    await page.check('#login-policy');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Redirected to the protected dashboard.
    await expect(page).toHaveURL(/\/inicio$/);

    // Dashboard shows data derived from the session (the JWT name claim),
    // not the old hardcoded mock.
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: `Olá, ${TEST_USER_FIRST_NAME}! :)` }),
    ).toBeVisible();
    await expect(page.getByText('R$ 0,00')).toBeVisible();
    await expect(page.getByText('Sem lançamentos')).toBeVisible();

    // Session tokens were persisted.
    const accessToken = await page.evaluate(() =>
      localStorage.getItem('anybank.accessToken'),
    );
    expect(accessToken).toBeTruthy();

    // Pausa para inspecionar o resultado no navegador (abre o Playwright
    // Inspector; clique em "Resume" para finalizar o teste).
    await page.pause();
  });

  test('keeps the user on the login page when credentials are invalid', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.fill('#login-email', TEST_USER.email);
    await page.fill('#login-senha', 'wrong-password');
    await page.check('#login-policy');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
