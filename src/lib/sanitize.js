import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return sanitizeInput(obj);
  const sanitized = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : typeof item === "object" ? sanitizeObject(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

export const sanitizeEmail = (email) => {
  if (typeof email !== "string") return email;
  return email.trim().toLowerCase();
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== "string") return phone;
  return phone.replace(/[^0-9+]/g, "").trim();
};

export const sanitizeName = (name) => {
  if (typeof name !== "string") return name;
  return sanitizeHtml(name, {
    allowedTags: [],
    allowedAttributes: {},
  }).replace(/[<>{}]/g, "").trim();
};
