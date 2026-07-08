import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = {
    N: 16384,
    p: 1,
    r: 8,
} as const;

export type PasswordValidationResult =
    | { ok: true }
    | {
          code: "PASSWORD_MISMATCH" | "PASSWORD_TOO_WEAK";
          ok: false;
      };

export async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("base64url");
    const key = scryptSync(
        password,
        salt,
        KEY_LENGTH,
        SCRYPT_OPTIONS,
    );

    return [
        HASH_PREFIX,
        SCRYPT_OPTIONS.N,
        SCRYPT_OPTIONS.r,
        SCRYPT_OPTIONS.p,
        salt,
        key.toString("base64url"),
    ].join("$");
}

export async function verifyPassword({
    password,
    passwordHash,
}: {
    password: string;
    passwordHash: string | null;
}) {
    if (!passwordHash) return false;

    const parts = passwordHash.split("$");
    if (parts.length !== 6 || parts[0] !== HASH_PREFIX) return false;

    const [, n, r, p, salt, expectedHash] = parts;
    const expected = Buffer.from(expectedHash, "base64url");
    const actual = scryptSync(password, salt, expected.length, {
        N: Number(n),
        p: Number(p),
        r: Number(r),
    });

    return (
        actual.length === expected.length && timingSafeEqual(actual, expected)
    );
}

export function validateNewPassword({
    confirmPassword,
    password,
}: {
    confirmPassword: string;
    password: string;
}): PasswordValidationResult {
    if (password !== confirmPassword) {
        return {
            code: "PASSWORD_MISMATCH",
            ok: false,
        };
    }

    const hasLetter = /[A-Za-zÀ-ÿ]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 12 || !hasLetter || !hasNumber) {
        return {
            code: "PASSWORD_TOO_WEAK",
            ok: false,
        };
    }

    return { ok: true };
}
