import { test, expect } from '@playwright/test';
import { PingResponseSchema } from '../src/schemas/ping.schema';

const MAX_PING_MS = Number(process.env.BOOKER_PING_MAX_MS ?? 1500);

const getHeader = (headers: Record<string, string>, name: string): string => {
  const key = Object.keys(headers).find((h) => h.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : '';
};

test.describe('Restful-Booker /ping', () => {
  test('responds with success status', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/ping`);
    expect([200, 201]).toContain(res.status());
  });

  test('returns quickly and as plain text', async ({ request, baseURL }) => {
    const startedAt = Date.now();
    const res = await request.get(`${baseURL}/ping`);
    const durationMs = Date.now() - startedAt;

    expect([200, 201]).toContain(res.status());
    expect(durationMs).toBeLessThan(MAX_PING_MS);

    const headers = res.headers();
    const contentType = getHeader(headers, 'content-type');
    expect(contentType.toLowerCase()).toContain('text/plain');

    const body = await res.text();
    PingResponseSchema.parse(body);
  });
});
