const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const DEFAULT_API_ORIGIN = normalizeOrigin("https://cmnw.me");
const API_ORIGIN = DEFAULT_API_ORIGIN;

module.exports = {
  API_ORIGIN,
  DEFAULT_API_ORIGIN,
  normalizeOrigin,
};
