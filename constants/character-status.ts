export type EndpointName = (typeof STATUS_ENDPOINT_ORDER)[number];

export type EndpointState = "success" | "error" | "pending";

export interface EndpointStatusInfo {
  endpoint: EndpointName;
  state: EndpointState;
}

export const CHARACTER_STATUS_CODES = {
  STATUS: { success: "S", error: "s", pending: "-" },
  SUMMARY: { success: "U", error: "u", pending: "-" },
  MEDIA: { success: "V", error: "v", pending: "-" },
  PETS: { success: "P", error: "p", pending: "-" },
  MOUNTS: { success: "M", error: "m", pending: "-" },
  PROFESSIONS: { success: "R", error: "r", pending: "-" },
} as const;

export const STATUS_ENDPOINT_ORDER = [
  "STATUS",
  "SUMMARY",
  "MEDIA",
  "PETS",
  "MOUNTS",
  "PROFESSIONS",
] as const;

export const ENDPOINT_DICT_KEYS: Record<EndpointName, string> = {
  STATUS: "status",
  SUMMARY: "summary",
  MEDIA: "media",
  PETS: "pets",
  MOUNTS: "mounts",
  PROFESSIONS: "professions",
};

export function parseStatusString(status: string): EndpointStatusInfo[] {
  return STATUS_ENDPOINT_ORDER.map((endpoint, index) => {
    const char = status[index] ?? "-";
    const codes = CHARACTER_STATUS_CODES[endpoint];

    let state: EndpointState;

    if (char === codes.success) {
      state = "success";
    } else if (char === codes.error) {
      state = "error";
    } else {
      state = "pending";
    }

    return { endpoint, state };
  });
}
