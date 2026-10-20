import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const profileSettings = readFileSync(
  new URL("../src/components/profile/atoms/ProfileSettings.tsx", import.meta.url),
  "utf8",
);

test("profile admin contact opens the official WhatsApp channel instead of showing a placeholder toast", () => {
  assert.match(
    profileSettings,
    /<a[\s\S]*?href=\{buildOfficialAdminWhatsAppUrl\(PROFILE_ADMIN_SUPPORT_MESSAGE\)\}[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"[\s\S]*?Kontak Admin[\s\S]*?<\/a>/,
  );
  assert.doesNotMatch(profileSettings, /Kontak admin akan tersedia dari kanal resmi toko/);
});
