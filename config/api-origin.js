const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const DEFAULT_API_ORIGIN = normalizeOrigin("http://128.0.0.255:8080");
const API_ORIGIN = DEFAULT_API_ORIGIN;

module.exports = {
  API_ORIGIN,
  DEFAULT_API_ORIGIN,
  normalizeOrigin,
};
