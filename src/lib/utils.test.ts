import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4");
  });

  it("should handle conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("px-2", isTrue && "py-2", isFalse && "m-2")).toBe("px-2 py-2");
  });

  it("should handle undefined and null", () => {
    expect(cn("px-2", undefined, null)).toBe("px-2");
  });
});
