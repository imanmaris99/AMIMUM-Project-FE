import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildAdminSupportMessage,
  buildOfficialAdminWhatsAppUrl,
  CREATIVE_CUSTOM_SUPPORT_MESSAGE,
  PROFILE_ADMIN_SUPPORT_MESSAGE,
} from "../src/lib/whatsapp.ts";

const profileSettings = readFileSync(
  new URL("../src/components/profile/atoms/ProfileSettings.tsx", import.meta.url),
  "utf8",
);
const trustPageShell = readFileSync(
  new URL("../src/components/trust/TrustPageShell.tsx", import.meta.url),
  "utf8",
);
const creativeCraftSection = readFileSync(
  new URL("../src/components/homepage/CreativeCraft_Section/index.tsx", import.meta.url),
  "utf8",
);

const getPrefilledMessage = (href) => new URL(href).searchParams.get("text");

test("each WhatsApp action builds a distinct, correctly encoded contextual message", () => {
  const messages = [
    PROFILE_ADMIN_SUPPORT_MESSAGE,
    buildAdminSupportMessage("Kebijakan Pembayaran"),
    buildAdminSupportMessage("Kebijakan Pengiriman dan Pickup"),
    CREATIVE_CUSTOM_SUPPORT_MESSAGE,
  ];
  const links = messages.map(buildOfficialAdminWhatsAppUrl);

  assert.equal(new Set(messages).size, messages.length);
  for (const [index, link] of links.entries()) {
    assert.equal(new URL(link).host, "wa.me");
    assert.equal(new URL(link).pathname, "/6281298742102");
    assert.equal(getPrefilledMessage(link), messages[index]);
  }
});

test("each trust page prefills a message containing that page's displayed title", () => {
  const trustPagePaths = [
    "../src/app/(navbar_layout)/cara-belanja/page.tsx",
    "../src/app/(navbar_layout)/kebijakan-pembayaran/page.tsx",
    "../src/app/(navbar_layout)/pengiriman-pickup/page.tsx",
    "../src/app/(navbar_layout)/retur-komplain/page.tsx",
    "../src/app/(navbar_layout)/kebijakan-privasi/page.tsx",
    "../src/app/(navbar_layout)/syarat-ketentuan/page.tsx",
  ];

  const messages = trustPagePaths.map((path) => {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    const title = source.match(/<TrustPageShell[\s\S]*?\btitle="([^"]+)"/)?.[1];
    assert.ok(title, `Trust page at ${path} should provide a visible title`);

    const message = buildAdminSupportMessage(title);
    const href = buildOfficialAdminWhatsAppUrl(message);
    assert.equal(getPrefilledMessage(href), message);
    assert.ok(message.includes(title));
    return message;
  });

  assert.equal(new Set(messages).size, trustPagePaths.length);
});

test("all visible WhatsApp entry points use their own contextual prefilled message", () => {
  assert.ok(profileSettings.includes("href={buildOfficialAdminWhatsAppUrl(PROFILE_ADMIN_SUPPORT_MESSAGE)}"));
  assert.ok(trustPageShell.includes("href={buildOfficialAdminWhatsAppUrl(buildAdminSupportMessage(title))}"));
  assert.ok(creativeCraftSection.includes("href={buildOfficialAdminWhatsAppUrl(CREATIVE_CUSTOM_SUPPORT_MESSAGE)}"));
  assert.doesNotMatch(profileSettings, /Kontak admin akan tersedia dari kanal resmi toko/);
});
