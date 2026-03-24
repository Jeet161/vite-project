export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone);

export const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

// Unique ID format: STU-XXXX (student) or TCH-XXXX (teacher)
export const isValidUniqueId = (id, role) => {
  if (role === "student") return /^STU-[A-Z0-9]{4,8}$/.test(id);
  if (role === "teacher") return /^TCH-[A-Z0-9]{4,8}$/.test(id);
  return false;
};

export const isValidName = (name) =>
  name.trim().length >= 2 && /^[a-zA-Z\s.'-]+$/.test(name.trim());
