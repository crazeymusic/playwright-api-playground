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

  test('is stable across multiple calls', async ({ request, baseURL }) => {
    const results: Array<{ status: number; body: string }> = [];

    for (let i = 0; i < 3; i++) {
      const res = await request.get(`${baseURL}/ping`);
      const body = await res.text();
      results.push({ status: res.status(), body });
    }

    for (const r of results) {
      expect([200, 201]).toContain(r.status);
      PingResponseSchema.parse(r.body);
    }

    const firstBody = results[0].body;
    expect(results.every((r) => r.body === firstBody)).toBe(true);
  });

  test('does not redirect and does not return HTML', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/ping`, { maxRedirects: 0 });

    expect([200, 201]).toContain(res.status());

    const headers = res.headers();
    const location = getHeader(headers, 'location');
    expect(location).toBe('');

    const contentType = getHeader(headers, 'content-type').toLowerCase();
    expect(contentType).toContain('text/plain');
    expect(contentType).not.toContain('text/html');

    const body = await res.text();
    PingResponseSchema.parse(body);
  });
});
