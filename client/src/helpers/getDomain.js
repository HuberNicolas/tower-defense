/**
 * This helper function returns the current domain of the API.
 * The URL is read from REACT_APP_API_URL at build time.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};
