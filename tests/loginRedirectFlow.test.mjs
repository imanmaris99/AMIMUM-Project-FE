import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const loginSource = readFileSync(
  new URL("../src/app/(auth_layout)/login/page.tsx", import.meta.url),
  "utf8",
);
const googleLoginSource = readFileSync(
  new URL("../src/hooks/useGoogleLogin.ts", import.meta.url),
  "utf8",
);
const authFlow = await import("../src/lib/authFlow.ts");

const sessionRedirectEffect = loginSource.match(
  /useEffect\(\(\) => \{\s*if \(SessionManager\.isAuthenticated\(\)\) \{[\s\S]*?\n  \}, \[([^\]]*)\]\);/,
);

test("login success has one redirect owner instead of racing the session effect", () => {
  assert.ok(sessionRedirectEffect, "expected the session redirect effect to exist");
  assert.equal(
    sessionRedirectEffect[1].replaceAll(" ", ""),
    "router",
    "the mount-time authenticated-session redirect must not rerun when login succeeds",
  );
});

test("post-login destination is consumed once and preserves the full internal path", () => {
  const { takePostLoginRedirect } = authFlow;
  assert.equal(typeof takePostLoginRedirect, "function");

  const values = new Map([
    ["redirectAfterLogin", "/saved-addresses?tab=delivery&sort=recent#saved"],
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
  };

  assert.equal(
    takePostLoginRedirect(storage, "https://shop.example"),
    "/saved-addresses?tab=delivery&sort=recent#saved",
  );
  assert.equal(values.has("redirectAfterLogin"), false);
  assert.equal(takePostLoginRedirect(storage, "https://shop.example"), "/");
});

test("post-login destination rejects external and script URLs", () => {
  const { takePostLoginRedirect } = authFlow;
  assert.equal(typeof takePostLoginRedirect, "function");

  for (const destination of [
    "https://evil.example/path",
    "//evil.example/path",
    "javascript:alert(1)",
  ]) {
    const values = new Map([["redirectAfterLogin", destination]]);
    const storage = {
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
    };

    assert.equal(takePostLoginRedirect(storage, "https://shop.example"), "/");
    assert.equal(values.has("redirectAfterLogin"), false);
  }
});

test("password and Google login flows share the safe redirect consumer", () => {
  const safeConsumer = /takePostLoginRedirect\(sessionStorage, window\.location\.origin\)/g;
  assert.equal((loginSource.match(safeConsumer) ?? []).length, 3);
  assert.equal((googleLoginSource.match(safeConsumer) ?? []).length, 1);
});
