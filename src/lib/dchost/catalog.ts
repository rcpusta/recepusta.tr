import { dchostRequest, DchostApiError } from "./client";
import { clearCatalogToken, getCatalogToken } from "./catalog-token";
import type { DchostCategory, DchostProduct } from "./types";

async function withCatalogToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
  try {
    return await fn(await getCatalogToken());
  } catch (err) {
    if (err instanceof DchostApiError && (err.status === 401 || err.status === 403)) {
      clearCatalogToken();
      return fn(await getCatalogToken(true));
    }
    throw err;
  }
}

export async function listCategories(): Promise<DchostCategory[]> {
  const data = await withCatalogToken((token) =>
    dchostRequest<{ categories?: DchostCategory[] }>("category", { token })
  );
  return data.categories || [];
}

export async function listProducts(categoryId: string): Promise<DchostProduct[]> {
  const data = await withCatalogToken((token) =>
    dchostRequest<{ products?: DchostProduct[] }>(`category/${categoryId}/product`, { token })
  );
  return data.products || [];
}

export async function getProductConfig(productId: string) {
  return withCatalogToken((token) =>
    dchostRequest<{ product?: Record<string, unknown> }>(`order/${productId}`, { token })
  );
}

export async function getCatalogBundle() {
  const categories = await listCategories();
  const productsByCategory = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      products: await listProducts(cat.id).catch(() => [] as DchostProduct[]),
    }))
  );
  return productsByCategory;
}

export { formatPrice, periodLabel } from "./format";
