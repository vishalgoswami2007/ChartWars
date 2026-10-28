
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("ChartWars API", () => {
  it("returns a healthy response", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.timestamp).toBeTypeOf("string");
  });

  
it("allows the configured frontend origin", async () => {
  const response = await request(app)
    .get("/api/v1/health")
    .set("Origin", "http://localhost:5173");

  expect(response.status).toBe(200);
  expect(response.headers["access-control-allow-origin"])
    .toBe("http://localhost:5173");
  expect(response.headers["access-control-allow-credentials"])
    .toBe("true");
});

it("does not allow an unconfigured origin", async () => {
  const response = await request(app)
    .get("/api/v1/health")
    .set("Origin", "https://untrusted.example");

  expect(response.status).toBe(200);
  expect(response.headers["access-control-allow-origin"])
    .toBeUndefined();
});


  it("returns a standard JSON error for malformed JSON", async () => {
  const response = await request(app)
    .post("/api/v1/test-json")
    .set("Content-Type", "application/json")
    .send('{"invalid":');

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("INVALID_JSON");
});

  it("returns a standard 404 response for an unknown route", async () => {
    const response = await request(app).get("/api/v1/unknown");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("includes security headers", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});
