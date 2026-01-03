const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const API_ORIGIN = normalizeOrigin(process.env.NEXT_PUBLIC_API_URL);

module.exports = {
  API_ORIGIN,
  normalizeOrigin,
};
