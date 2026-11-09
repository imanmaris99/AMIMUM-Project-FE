import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

const loginSource = readSource("../src/app/(auth_layout)/login/page.tsx");
const registerSource = readSource("../src/app/(auth_layout)/register/page.tsx");
const registerApiSource = readSource("../src/services/api/register/index.ts");
const loginApiSource = readSource("../src/services/api/login/index.ts");
const googleLoginApiSource = readSource("../src/services/api/google-login/index.ts");
const googleAuthSource = readSource("../src/lib/googleAuth.ts");
const nextConfigSource = readSource("../next.config.mjs");
const validation = await import("../src/lib/authFormValidation.ts").catch(() => ({}));

test("login payload preserves the exact password and normalizes only email", () => {
  assert.equal(typeof validation.buildLoginPayload, "function");
  const password = "Te'st&<Pass123!";
  assert.deepEqual(validation.buildLoginPayload(" User@Example.COM ", password), {
    email: "user@example.com",
    password,
  });
  assert.ok(/buildLoginPayload\(formData\.email, formData\.password\)/.test(loginSource),
    "login form should use the credential-preserving payload builder");
  assert.doesNotMatch(loginSource, /sanitizeUserInput\(formData\.password\)/);
  assert.doesNotMatch(loginSource, /validatePassword\(sanitizedPassword\)/);
});

test("registration password validation matches the backend policy", () => {
  assert.equal(typeof validation.getRegistrationPasswordError, "function");
  assert.equal(validation.getRegistrationPasswordError("Abcdef123!"), null);
  assert.equal(validation.getRegistrationPasswordError("Abc1234"),
    "Password minimal 8 karakter.");
  assert.equal(validation.getRegistrationPasswordError("abcdefgh1!"),
    "Password harus mengandung huruf besar.");
  assert.equal(validation.getRegistrationPasswordError("Abcdefgh12"),
    "Password harus mengandung karakter spesial.");
  assert.ok(/getRegistrationPasswordError\(formData\.password\)/.test(registerSource),
    "registration form should use the backend-matching password validator");
});

test("registration password hint remains concise and explains the full rule", () => {
  assert.ok(registerSource.includes('placeholder="Min. 8 karakter"'));
  assert.ok(registerSource.includes(
    "Gunakan huruf besar, huruf kecil, angka, dan simbol.",
  ));
});

test("registration phone is normalized and validated in the backend format", () => {
  assert.equal(typeof validation.normalizeRegistrationPhoneNumber, "function");
  assert.equal(typeof validation.isValidRegistrationPhone, "function");
  const normalized = validation.normalizeRegistrationPhoneNumber("0812-3456-7890");
  assert.equal(normalized, "+6281234567890");
  assert.equal(validation.isValidRegistrationPhone(normalized), true);
  assert.equal(validation.isValidRegistrationPhone(
    validation.normalizeRegistrationPhoneNumber("0812-3456")), false);
  assert.equal(validation.normalizeRegistrationPhoneNumber("+1 212-555-0100"), "");
  assert.equal(validation.normalizeRegistrationPhoneNumber("Phone 0812-3456-7890"), "");
  assert.equal(validation.normalizeRegistrationPhoneNumber("812-3456-7890"), "");
  assert.ok(/normalizeRegistrationPhoneNumber\(formData\.nomorHp\)/.test(registerSource),
    "registration form should submit a normalized Indonesian phone number");
});

test("login errors keep account state generic while offering verification help", () => {
  assert.ok(/status === 401/.test(loginApiSource));
  assert.ok(/mayNeedVerification = true/.test(loginApiSource));
  assert.ok(/setIsAccountInactive\(true\)/.test(loginSource));
  assert.ok(loginSource.includes("Jika akun Anda belum diverifikasi"));
  assert.doesNotMatch(loginSource, /Akun Anda belum terverifikasi/);
});

test("registration API errors distinguish password-policy failures from duplicates", () => {
  assert.equal(typeof validation.getRegisterErrorMessage, "function");
  assert.equal(
    validation.getRegisterErrorMessage(400, {
      detail: { message: "Password must be at least 8 characters long." },
    }),
    "Password minimal 8 karakter dan wajib memuat huruf besar, huruf kecil, angka, serta karakter spesial.",
  );
  assert.equal(
    validation.getRegisterErrorMessage(400, {
      detail: { message: "The email address is already in use by another account." },
    }),
    "Email atau nomor HP sudah terdaftar.",
  );
  assert.equal(
    validation.getRegisterErrorMessage(400, {
      detail: { message: "Failed to create user in Firebase." },
    }),
    "Registrasi belum bisa diproses. Silakan coba lagi nanti.",
  );
  assert.ok(/getRegisterErrorMessage\(status, error\.response\.data\)/.test(registerApiSource),
    "registration API errors should be mapped by their actual backend reason");
});

test("Google login errors stay generic and consume the backend-issued token only through the BFF", () => {
  assert.doesNotMatch(googleLoginApiSource, /Akun Google belum terdaftar/);
  assert.match(googleLoginApiSource, /\/api\/auth\/google-login/);
  assert.doesNotMatch(googleAuthSource, /response\.data\.(?:access_token|token|jwt|auth_token)/);
  assert.doesNotMatch(googleAuthSource, /isJwtToken/);
});

test("verification and reset routes disable referrer headers for legacy code links", () => {
  for (const route of ["reset-password", "verify-account"]) {
    assert.match(
      nextConfigSource,
      new RegExp(`source: '/${route}',\\s*headers:\\s*\\[\\s*\\{ key: 'Referrer-Policy', value: 'no-referrer' \\}`),
    );
  }
});
