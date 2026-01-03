const DEFAULT_API_ORIGIN = "https://cmnw.me";

const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const API_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_ORIGIN
);

module.exports = {
  API_ORIGIN,
  DEFAULT_API_ORIGIN,
  normalizeOrigin,
};
