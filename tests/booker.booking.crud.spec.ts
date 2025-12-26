import { test, expect, type APIRequestContext } from '@playwright/test';
import { requireBaseURL } from '../src/utils/requireBaseURL';
import { getHeader } from '../src/utils/getHeader';
import { BookingSchema } from '../src/schemas/booking.schema';

const createBooking = async (request: APIRequestContext, baseURL: string): Promise<number> => {
  const payload = {
    firstname: 'Cezary',
    lastname: 'Sadowski',
    totalprice: 123,
    depositpaid: true,
    bookingdates: { checkin: '2020-01-01', checkout: '2020-01-02' },
    additionalneeds: `Breakfast-${Date.now()}`
  };

  const res = await request.post(`${baseURL}/booking`, {
    data: payload,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  });

  expect(res.status()).toBe(200);

  const contentType = getHeader(res.headers(), 'content-type').toLowerCase();
  expect(contentType).toContain('application/json');

  const json = (await res.json()) as { bookingid: number; booking?: unknown };
  expect(typeof json.bookingid).toBe('number');

  return json.bookingid;
};

test.describe('Restful-Booker booking CRUD', () => {
  test('can create a booking and fetch it by id (contract)', async ({ request, baseURL }) => {
    const apiBaseURL = requireBaseURL(baseURL);

    const bookingId = await createBooking(request, apiBaseURL);

    const getRes = await request.get(`${apiBaseURL}/booking/${bookingId}`);
    expect(getRes.status()).toBe(200);

    const getContentType = getHeader(getRes.headers(), 'content-type').toLowerCase();
    expect(getContentType).toContain('application/json');

    const bookingJson = await getRes.json();
    const booking = BookingSchema.parse(bookingJson);

    expect(booking.firstname.length).toBeGreaterThan(0);
    expect(booking.lastname.length).toBeGreaterThan(0);
  });
});
