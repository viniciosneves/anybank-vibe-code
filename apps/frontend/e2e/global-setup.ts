import { API_BASE_URL, TEST_USER } from './test-user';

/**
 * Ensures the e2e test user exists before the suite runs. The backend's
 * /auth/register is public; a duplicate email returns 409, which we treat as
 * success so the setup is idempotent across runs.
 */
async function globalSetup(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  });

  if (response.ok || response.status === 409) {
    return;
  }

  const body = await response.text();
  throw new Error(
    `Failed to seed e2e test user (HTTP ${response.status}): ${body}`,
  );
}

export default globalSetup;
