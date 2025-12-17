import { test, expect } from '@playwright/test';
import { AuthBadCredentialsSchema, AuthSuccessSchema } from '../src/schemas/auth.schema';

const getHeader = (headers: Record<string, string>, name: string): string => {
  const key = Object.keys(headers).find((h) => h.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : '';
};

test.describe('Restful-Booker /auth', () => {
  test('returns token for valid credentials', async ({ request, baseURL }) => {
    const username = process.env.BOOKER_USERNAME ?? 'admin';
    const password = process.env.BOOKER_PASSWORD ?? 'password123';

    const res = await request.post(`${baseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });

    expect(res.status()).toBe(200);

    const contentType = getHeader(res.headers(), 'content-type').toLowerCase();
    expect(contentType).toContain('application/json');

    const json = await res.json();
    const parsed = AuthSuccessSchema.parse(json);
    expect(parsed.token.length).toBeGreaterThan(0);
  });

  test('returns reason for invalid credentials', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/auth`, {
      data: { username: 'admin', password: 'wrong-password' },
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });

    expect(res.status()).toBe(200);

    const contentType = getHeader(res.headers(), 'content-type').toLowerCase();
    expect(contentType).toContain('application/json');

    const json = await res.json();
    const parsed = AuthBadCredentialsSchema.parse(json);
    expect(parsed.reason.toLowerCase()).toContain('bad');
  });
});
