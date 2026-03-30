import { test as base, expect } from '@playwright/test';
import { requireBaseURL } from '../src/utils/requireBaseURL';
import { getHeader } from '../src/utils/getHeader';
import { AuthSuccessSchema } from '../src/schemas/auth.schema';

type BookerFixtures = {
  authToken: string;
};

export const test = base.extend<BookerFixtures>({
  authToken: async ({ request, baseURL }, use) => {
    const apiBaseURL = requireBaseURL(baseURL);

    const username = process.env.BOOKER_USERNAME ?? 'admin';
    const password = process.env.BOOKER_PASSWORD ?? 'password123';

    const res = await request.post(`${apiBaseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });

    expect(res.status()).toBe(200);

    const contentType = getHeader(res.headers(), 'content-type').toLowerCase();
    expect(contentType).toContain('application/json');

    const json = await res.json();
    const parsed = AuthSuccessSchema.parse(json);

    await use(parsed.token);
  }
});

export { expect } from '@playwright/test';
