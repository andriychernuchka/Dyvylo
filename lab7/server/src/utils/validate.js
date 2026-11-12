import { ApiError } from "./ApiError.js";

export function assert(condition, message, errors) {
  if (!condition) throw new ApiError(400, message, errors);
}

export function requiredString(value, field, { min = 1, max = 255 } = {}) {
  const str = typeof value === "string" ? value.trim() : "";
  assert(str.length >= min, `Поле "${field}" є обов'язковим`, {
    [field]: `Мінімум ${min} символ(ів)`,
  });
  assert(str.length <= max, `Поле "${field}" занадто довге`, {
    [field]: `Максимум ${max} символів`,
  });
  return str;
}

export function optionalString(value, field, { min = 1, max = 255 } = {}) {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredString(value, field, { min, max });
}

export function requiredEmail(value) {
  const email = requiredString(value, "email", { min: 5, max: 254 }).toLowerCase();
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Некоректна електронна пошта", {
    email: "Вкажіть адресу у форматі name@example.com",
  });
  return email;
}

export function requiredPassword(value, field = "password") {
  const password = typeof value === "string" ? value : "";
  assert(password.length >= 6, "Пароль занадто короткий", {
    [field]: "Мінімум 6 символів",
  });
  assert(Buffer.byteLength(password, "utf8") <= 72, "Пароль занадто довгий", {
    [field]: "Максимум 72 байти",
  });
  return password;
}

export function requiredNumber(value, field, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const num = Number(value);
  assert(Number.isFinite(num), `Поле "${field}" має бути числом`, {
    [field]: "Очікується число",
  });
  assert(num >= min && num <= max, `Некоректне значення поля "${field}"`, {
    [field]: `Діапазон: ${min}–${max}`,
  });
  return num;
}

export function assertObjectBody(body) {
  assert(
    body && typeof body === "object" && !Array.isArray(body),
    "Тіло запиту має бути JSON-об'єктом",
  );
}
