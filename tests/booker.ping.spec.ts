import { test, expect } from '@playwright/test';
import { PingResponseSchema } from '../src/schemas/ping.schema';

test('Restful-Booker /ping responds', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/ping`);
  expect([200, 201]).toContain(res.status());
});

test('Restful-Booker /ping returns quickly and as plain text', async ({ request, baseURL }) => {
  const startedAt = Date.now();
  const res = await request.get(`${baseURL}/ping`);
  const durationMs = Date.now() - startedAt;

  expect([200, 201]).toContain(res.status());

  const contentType = res.headers()['content-type'] ?? '';
  expect(contentType.toLowerCase()).toContain('text/plain');

  const body = await res.text();
  PingResponseSchema.parse(body);

  expect(durationMs).toBeLessThan(1500);
});
