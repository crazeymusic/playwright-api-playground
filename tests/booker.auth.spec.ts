import { test, expect } from '@playwright/test';
import { AuthBadCredentialsSchema, AuthSuccessSchema } from '../src/schemas/auth.schema';
import { BookingSchema } from '../src/schemas/booking.schema';

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

  test('token authorizes updating a booking (PUT)', async ({ request, baseURL }) => {
    const username = process.env.BOOKER_USERNAME ?? 'admin';
    const password = process.env.BOOKER_PASSWORD ?? 'password123';

    const authRes = await request.post(`${baseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });
    expect(authRes.status()).toBe(200);
    const { token } = (await authRes.json()) as { token: string };
    expect(token.length).toBeGreaterThan(0);

    const listRes = await request.get(`${baseURL}/booking`);
    expect(listRes.status()).toBe(200);
    const bookingIds = (await listRes.json()) as Array<{ bookingid: number }>;
    expect(bookingIds.length).toBeGreaterThan(0);
    const bookingId = bookingIds[0].bookingid;

    const currentRes = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(currentRes.status()).toBe(200);

    const currentContentType = (currentRes.headers()['content-type'] ?? '').toLowerCase();
    expect(currentContentType).toContain('application/json');

    const currentJson = await currentRes.json();
    const currentBooking = BookingSchema.parse(currentJson);

    const updatedAdditionalNeeds = `Breakfast-${Date.now()}`;
    const updatedPayload = { ...currentBooking, additionalneeds: updatedAdditionalNeeds };

    const updateRes = await request.put(`${baseURL}/booking/${bookingId}`, {
      data: updatedPayload,
      headers: {
        Cookie: `token=${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    expect(updateRes.status()).toBe(200);

    const updateContentType = (updateRes.headers()['content-type'] ?? '').toLowerCase();
    expect(updateContentType).toContain('application/json');

    const updatedJson = await updateRes.json();
    const updatedBooking = BookingSchema.parse(updatedJson);
    expect(updatedBooking.additionalneeds).toBe(updatedAdditionalNeeds);
  });
});
