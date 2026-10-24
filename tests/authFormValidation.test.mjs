import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

const loginSource = readSource("../src/app/(auth_layout)/login/page.tsx");
const registerSource = readSource("../src/app/(auth_layout)/register/page.tsx");
const registerApiSource = readSource("../src/services/api/register/index.ts");
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
