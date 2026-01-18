/**
 * Application constants
 */
const CONSTANTS = {
  PLOS_API_BASE_URL: 'https://api.plos.org/search',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  DEFAULT_QUERY: 'title:university',
  PORT: process.env.PORT || 3000
};

module.exports = CONSTANTS;
