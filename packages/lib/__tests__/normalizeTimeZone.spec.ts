import { normalizeTimeZoneId } from "@calcom/lib/timezone/normalizeTimeZone";

describe("normalizeTimeZoneId", () => {
  it("returns UTC for empty/invalid inputs", () => {
    expect(normalizeTimeZoneId(null as unknown as string)).toBe("UTC");
    expect(normalizeTimeZoneId(undefined as unknown as string)).toBe("UTC");
    expect(normalizeTimeZoneId(" ")).toBe("UTC");
  });

  it("maps common aliases and fixes casing", () => {
    expect(normalizeTimeZoneId("us/eastern")).toBe("America/New_York");
    expect(normalizeTimeZoneId("US/Eastern")).toBe("America/New_York");
    expect(normalizeTimeZoneId("europe/kyiv")).toBe("Europe/Kyiv");
    expect(normalizeTimeZoneId("Asia/Calcutta")).toBe("Asia/Kolkata");
  });

  it("returns known IANA zone unchanged when valid", () => {
    expect(normalizeTimeZoneId("America/Los_Angeles")).toBe("America/Los_Angeles");
  });
});


