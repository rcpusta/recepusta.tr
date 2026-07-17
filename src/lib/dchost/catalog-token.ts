import { getCatalogCredentials } from "./config";
import { dchostLogin, DchostApiError } from "./client";

type Cache = {
  token: string;
  refresh: string;
  expiresAt: number;
};

let cache: Cache | null = null;

const TTL_MS = 1000 * 60 * 45;

export async function getCatalogToken(force = false): Promise<string> {
  const now = Date.now();
  if (!force && cache && cache.expiresAt > now) {
    return cache.token;
  }

  const { username, password } = await getCatalogCredentials();
  if (!username || !password) {
    throw new DchostApiError(
      "Mağaza vitrini henüz yapılandırılmamış. Lütfen daha sonra tekrar deneyin.",
      503
    );
  }

  const tokens = await dchostLogin(username, password);
  cache = {
    token: tokens.token,
    refresh: tokens.refresh,
    expiresAt: now + TTL_MS,
  };
  return cache.token;
}

export function clearCatalogToken() {
  cache = null;
}
