export const generateUniqueId = (role, count) => {
  const year = new Date().getFullYear();
  const number = String(count).padStart(4, "0");

  if (role === "STUDENT") return `STU-${year}-${number}`;
  if (role === "TEACHER") return `TCH-${year}-${number}`;

  return `ADMIN-001`;
};