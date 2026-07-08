import { createHash } from "node:crypto";

const unsignedParams = new Set([
    "api_key",
    "cloud_name",
    "file",
    "resource_type",
    "signature",
]);

export function signCloudinaryUploadParams(paramsToSign: Record<string, unknown>) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
        throw new Error("CLOUDINARY_API_SECRET is not configured.");
    }

    const payload = Object.entries(paramsToSign)
        .filter(([key, value]) => !unsignedParams.has(key) && hasSignableValue(value))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${normalizeSignatureValue(value)}`)
        .join("&");

    return createHash("sha1")
        .update(`${payload}${apiSecret}`)
        .digest("hex");
}

function hasSignableValue(value: unknown) {
    if (value === null || typeof value === "undefined") return false;
    if (typeof value === "string") return value.length > 0;

    return true;
}

function normalizeSignatureValue(value: unknown) {
    if (Array.isArray(value)) {
        return value.join(",");
    }

    return String(value);
}
