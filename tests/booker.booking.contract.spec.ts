import { test, expect } from '@playwright/test';
import { BookingSchema } from '../src/schemas/booking.schema';

const parseIsoDate = (value: string): number => {
  // value is already validated as YYYY-MM-DD by Zod, so Date.parse is safe enough here
  return Date.parse(`${value}T00:00:00Z`);
};

test.describe('Restful-Booker /booking/:id contract', () => {
  test('returns a booking with expected shape and ISO dates', async ({ request, baseURL }) => {
    const listRes = await request.get(`${baseURL}/booking`);
    expect(listRes.status()).toBe(200);

    const bookingIds = (await listRes.json()) as Array<{ bookingid: number }>;
    expect(Array.isArray(bookingIds)).toBe(true);
    expect(bookingIds.length).toBeGreaterThan(0);

    const bookingId = bookingIds[0].bookingid;
    expect(typeof bookingId).toBe('number');

    const res = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(res.status()).toBe(200);

    const contentType = (res.headers()['content-type'] ?? '').toLowerCase();
    expect(contentType).toContain('application/json');
    const json = await res.json();
    const booking = BookingSchema.parse(json);

    const checkinMs = parseIsoDate(booking.bookingdates.checkin);
    const checkoutMs = parseIsoDate(booking.bookingdates.checkout);
    expect(Number.isNaN(checkinMs)).toBe(false);
    expect(Number.isNaN(checkoutMs)).toBe(false);
    expect(checkinMs).toBeLessThanOrEqual(checkoutMs);
  });

  test('returns 404 for non-existing booking id', async ({ request, baseURL }) => {
    const nonExistingId = 99999999;
    const res = await request.get(`${baseURL}/booking/${nonExistingId}`);
    expect(res.status()).toBe(404);

    const contentType = (res.headers()['content-type'] ?? '').toLowerCase();
    expect(contentType).toContain('text');

    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('includes ETag header for caching/conditional requests', async ({ request, baseURL }) => {
    const listRes = await request.get(`${baseURL}/booking`);
    expect(listRes.status()).toBe(200);

    const bookingIds = (await listRes.json()) as Array<{ bookingid: number }>;
    expect(bookingIds.length).toBeGreaterThan(0);

    const bookingId = bookingIds[0].bookingid;
    const res = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(res.status()).toBe(200);

    const etag = res.headers()['etag'] ?? '';
    expect(etag).not.toBe('');
  });
});
