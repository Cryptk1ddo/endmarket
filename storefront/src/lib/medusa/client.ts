const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://medusa-server:9000"

const MEDUSA_PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  ""

type MedusaFetchOptions = {
  method?: "GET" | "POST" | "DELETE"
  body?: unknown
  cache?: RequestCache
}

export async function medusaFetch<T>(
  path: string,
  options: MedusaFetchOptions = {}
): Promise<T> {
  if (!MEDUSA_PUBLISHABLE_KEY) {
    throw new Error("MEDUSA_PUBLISHABLE_KEY is missing")
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache || "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Medusa request failed: ${res.status} ${text}`)
  }

  return res.json()
}
