/**
 * Security utility functions
 */

/**
 * Validates that a redirect path is safe (internal only).
 * Prevents open redirect vulnerabilities by ensuring:
 * - Path starts with a single forward slash
 * - Path doesn't contain protocol indicators
 * - Path doesn't use protocol-relative URLs (//)
 *
 * @param path - The redirect path to validate
 * @returns The validated path, or "/" if invalid
 */
export function getSafeRedirectPath(path: string | null | undefined): string {
  // Default to home if no path provided
  if (!path) {
    return "/";
  }

  // Must start with exactly one forward slash (not //)
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  // Check for protocol indicators that could bypass the check
  // e.g., /\evil.com or javascript: schemes
  if (
    path.includes("://") ||
    path.includes("\\") ||
    path.toLowerCase().startsWith("/javascript:") ||
    path.toLowerCase().startsWith("/data:")
  ) {
    return "/";
  }

  // Additional check: ensure no encoded protocol patterns
  const decodedPath = decodeURIComponent(path);
  if (decodedPath.includes("://") || decodedPath.startsWith("//")) {
    return "/";
  }

  return path;
}

/**
 * List of allowed internal redirect paths.
 * Used for stricter validation when needed.
 */
export const ALLOWED_REDIRECT_PREFIXES = [
  "/",
  "/brands",
  "/tags",
  "/profile",
  "/settings",
  "/submit",
  "/search",
  "/about",
];

/**
 * Strictly validates redirect against allowed prefixes.
 * Use this for high-security scenarios.
 */
export function isAllowedRedirectPath(path: string): boolean {
  const safePath = getSafeRedirectPath(path);
  return ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => safePath === prefix || safePath.startsWith(prefix + "/") || safePath.startsWith(prefix + "?")
  );
}
