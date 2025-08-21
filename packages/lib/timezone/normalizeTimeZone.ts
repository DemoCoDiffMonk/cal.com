import dayjs from "@calcom/dayjs";

// Common alias map to canonical IANA TZIDs we frequently see
const COMMON_TZ_ALIASES: Record<string, string> = {
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
  "US/Arizona": "America/Phoenix",
  "US/Alaska": "America/Anchorage",
  "US/Hawaii": "Pacific/Honolulu",
  "Z": "UTC",
  "Etc/UTC": "UTC",
  "GMT": "UTC",
  "Etc/GMT": "UTC",
  // Historic/alternate spellings commonly encountered
  "Europe/Kiev": "Europe/Kyiv",
  "Asia/Calcutta": "Asia/Kolkata",
};

function capitalizeIanaPart(part: string) {
  if (!part) return part;
  return part
    .split("_")
    .map((word) => (word.length ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join("_");
}

function formatIanaCase(tz: string): string {
  // Normalize case for region/city style IDs like "america/new_york"
  const parts = tz.split("/");
  if (parts.length === 1) {
    return capitalizeIanaPart(parts[0]);
  }
  return parts.map(capitalizeIanaPart).join("/");
}

/**
 * Best-effort normalization to a canonical IANA TZID string.
 * - Trims, fixes case/underscores
 * - Maps a small set of common aliases
 * - Returns "UTC" for empty/unknown inputs
 * - If the resulting zone is not recognized by dayjs.tz, falls back to the input as-is
 */
export function normalizeTimeZoneId(input?: string | null): string {
  if (!input || typeof input !== "string") return "UTC";
  const raw = input.trim();
  if (!raw) return "UTC";

  // Replace spaces with underscores, unify slashes casing
  const pre = raw.replace(/\s+/g, "_");

  // Apply alias mapping first (alias keys are case sensitive; try exact then case-normalized)
  if (COMMON_TZ_ALIASES[pre]) return COMMON_TZ_ALIASES[pre];

  const cased = formatIanaCase(pre);
  if (COMMON_TZ_ALIASES[cased]) return COMMON_TZ_ALIASES[cased];

  // If dayjs knows the zone, accept it
  if (dayjs.tz.zone(cased)) return cased;

  // Try upper-case whole string for UTC-like tokens
  const upper = pre.toUpperCase();
  if (COMMON_TZ_ALIASES[upper]) return COMMON_TZ_ALIASES[upper];
  if (dayjs.tz.zone(upper)) return upper;

  // As a final resort, return original trimmed input; callers should handle failures
  return pre;
}

export default normalizeTimeZoneId;


