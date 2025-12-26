import { test, expect, type APIRequestContext } from '@playwright/test';
import { AuthSuccessSchema } from '../src/schemas/auth.schema';
import { requireBaseURL } from '../src/utils/requireBaseURL';
import { getHeader } from '../src/utils/getHeader';

const getAuthToken = async (request: APIRequestContext, baseURL: string): Promise<string> => {
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
  return parsed.token;
};

test.describe('Restful-Booker booking CRUD', () => {
  test('can obtain auth token', async ({ request, baseURL }) => {
    const apiBaseURL = requireBaseURL(baseURL);
    const token = await getAuthToken(request, apiBaseURL);
    expect(token.length).toBeGreaterThan(0);
  });
});
