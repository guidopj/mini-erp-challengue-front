import { describe, it, expect } from "vitest";

import { round } from "./round";

describe("round", () => {
  it("redondea a dos decimales", () => {
    expect(round(10.456)).toBe(10.46);
  });

  it("mantiene dos decimales cuando corresponde", () => {
    expect(round(10.45)).toBe(10.45);
  });

  it("redondea correctamente valores pequeños", () => {
    expect(round(0.004)).toBe(0);
    expect(round(0.005)).toBe(0.01);
  });

  it("maneja números enteros", () => {
    expect(round(100)).toBe(100);
  });
});
