
import { describe, expect, it } from "vitest";
import { signupSchema } from "../validators/auth.validator.js";
import {  loginSchema } from "../validators/auth.validator.js";

describe("signupSchema", () => {
  const validSignup = {
    username: "vishal_123",
    email: "Vishal@Example.com",
    password: "StrongPassword123",
  };

  it("accepts valid signup data and normalizes email", () => {
    const result = signupSchema.safeParse(validSignup);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("vishal@example.com");
      expect(result.data.username).toBe("vishal_123");
      expect(result.data.password).toBe("StrongPassword123");
    }
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid username", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      username: "bad username!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      isAdmin: true,
    });

    expect(result.success).toBe(false);
  });
});


describe("loginSchema", () => {
  const validLogin = {
    email: "Vishal@example.com",
    password: "StrongPassword123",
  };

  it("accepts valid login data and normalizes email", () => {
    const result = loginSchema.safeParse(validLogin);

    expect(result.success).toBe(true);
    expect(result.data.email).toBe("vishal@example.com");
    expect(result.data.password).toBe(validLogin.password);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      isAdmin: true,
    });

    expect(result.success).toBe(false);
  });
});
