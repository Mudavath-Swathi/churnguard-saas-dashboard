// utils/logger.js

export const logger = {
  info: (message) => {
    console.log(`ℹ️ INFO: ${message}`);
  },

  warn: (message) => {
    console.warn(`⚠️ WARN: ${message}`);
  },

  error: (message) => {
    console.error(`❌ ERROR: ${message}`);
  },
};
