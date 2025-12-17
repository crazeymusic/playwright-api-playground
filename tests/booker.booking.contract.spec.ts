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

    const json = await res.json();
    const booking = BookingSchema.parse(json);

    const checkinMs = parseIsoDate(booking.bookingdates.checkin);
    const checkoutMs = parseIsoDate(booking.bookingdates.checkout);
    expect(Number.isNaN(checkinMs)).toBe(false);
    expect(Number.isNaN(checkoutMs)).toBe(false);
    expect(checkinMs).toBeLessThanOrEqual(checkoutMs);
  });
});
