/** Edge-safe (middleware). Do not import Node fs/path modules here. */

export const DCHOST_COOKIE = "ru_dchost_session";
export const DCHOST_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getDchostSessionSecret() {
  return (
    process.env.DCHOST_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "recep-usta-dchost-dev-secret-change-me"
  );
}
