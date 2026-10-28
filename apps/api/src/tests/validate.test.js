
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

describe("validate middleware", () => {
  const schema = z.object({
    username: z.string().min(3),
  });

  it("passes valid request data to the next middleware", () => {
    const req = {
      body: { username: "vishal" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.body).toEqual({ username: "vishal" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns a 400 response for invalid request data", () => {
    const req = {
      body: { username: "ab" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "VALIDATION_ERROR",
        }),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
