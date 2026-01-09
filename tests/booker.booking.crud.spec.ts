import { test, expect, type APIRequestContext } from '@playwright/test';
import { requireBaseURL } from '../src/utils/requireBaseURL';
import { getHeader } from '../src/utils/getHeader';
import { BookingSchema } from '../src/schemas/booking.schema';
import { AuthSuccessSchema } from '../src/schemas/auth.schema';

// ==================== HELPERS ====================

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

// ===================== TESTS =====================

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

  test('can update a booking with token and verify via GET', async ({ request, baseURL }) => {
    const apiBaseURL = requireBaseURL(baseURL);

    const bookingId = await createBooking(request, apiBaseURL);
    const token = await getAuthToken(request, apiBaseURL);

    const currentRes = await request.get(`${apiBaseURL}/booking/${bookingId}`);
    expect(currentRes.status()).toBe(200);

    const currentContentType = getHeader(currentRes.headers(), 'content-type').toLowerCase();
    expect(currentContentType).toContain('application/json');

    const currentJson = await currentRes.json();
    const currentBooking = BookingSchema.parse(currentJson);

    const updatedAdditionalNeeds = `Updated-${Date.now()}`;
    const updatedPayload = { ...currentBooking, additionalneeds: updatedAdditionalNeeds };

    const updateRes = await request.put(`${apiBaseURL}/booking/${bookingId}`, {
      data: updatedPayload,
      headers: {
        Cookie: `token=${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    expect(updateRes.status()).toBe(200);

    const updateContentType = getHeader(updateRes.headers(), 'content-type').toLowerCase();
    expect(updateContentType).toContain('application/json');

    const updatedJson = await updateRes.json();
    const updatedBooking = BookingSchema.parse(updatedJson);
    expect(updatedBooking.additionalneeds).toBe(updatedAdditionalNeeds);

    const verifyRes = await request.get(`${apiBaseURL}/booking/${bookingId}`);
    expect(verifyRes.status()).toBe(200);

    const verifyContentType = getHeader(verifyRes.headers(), 'content-type').toLowerCase();
    expect(verifyContentType).toContain('application/json');

    const verifyJson = await verifyRes.json();
    const verified = BookingSchema.parse(verifyJson);
    expect(verified.additionalneeds).toBe(updatedAdditionalNeeds);
  });
});
