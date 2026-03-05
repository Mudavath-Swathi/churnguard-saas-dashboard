// utils/validator.js

export const validateRequiredFields = (data, fields = []) => {
  for (let field of fields) {
    if (!data[field] || data[field].toString().trim() === "") {
      return `${field} is required`;
    }
  }
  return null;
};
