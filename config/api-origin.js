const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

const DEFAULT_API_ORIGIN = normalizeOrigin("https://cmnw.me");

const resolveOrigin = () => {
  const normalizedEnvOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_API_URL);

  if (!normalizedEnvOrigin) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn(
        `[config/api-origin] NEXT_PUBLIC_API_URL is not defined. Falling back to ${DEFAULT_API_ORIGIN} (same-origin /api routing).`
      );
    }

    return DEFAULT_API_ORIGIN;
  }

  try {
    // Ensures the URL is absolute and well-formed
    const { origin } = new URL(normalizedEnvOrigin);

    return normalizeOrigin(origin);
  } catch (error) {
    throw new Error(
      `[config/api-origin] NEXT_PUBLIC_API_URL must be an absolute URL. Received "${process.env.NEXT_PUBLIC_API_URL}".\n${error.message}`
    );
  }
};

const API_ORIGIN = resolveOrigin();

module.exports = {
  API_ORIGIN,
  DEFAULT_API_ORIGIN,
  normalizeOrigin,
};
