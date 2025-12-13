import { test, expect } from "@playwright/test";

test("Restful-Booker /ping responds", async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/ping`);
  expect([200, 201]).toContain(res.status());
});
