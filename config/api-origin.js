const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const envApiUrl = normalizeOrigin(process.env.API_URL);

const INTERNAL_API_ORIGIN = normalizeOrigin("http://128.0.0.255:8080");
const PUBLIC_API_ORIGIN = normalizeOrigin("https://cmnw.me");

const isServerRuntime = () => typeof window === "undefined";

const API_ORIGIN = envApiUrl
  ? envApiUrl
  : isServerRuntime()
    ? INTERNAL_API_ORIGIN
    : PUBLIC_API_ORIGIN;

module.exports = {
  API_ORIGIN,
  INTERNAL_API_ORIGIN,
  PUBLIC_API_ORIGIN,
  normalizeOrigin,
};
