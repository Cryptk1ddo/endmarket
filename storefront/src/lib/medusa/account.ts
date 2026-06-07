import { cookies } from "next/headers"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://medusa-server:9000"

const MEDUSA_PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  ""

export const CUSTOMER_TOKEN_COOKIE = "endmarket_customer_token"

export class MedusaStoreError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(`Medusa request failed: ${status} ${body}`)
    this.status = status
    this.body = body
  }
}

export async function medusaStoreFetch<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "DELETE"
    body?: unknown
    token?: string
    cache?: RequestCache
  } = {}
): Promise<T> {
  if (!MEDUSA_PUBLISHABLE_KEY) {
    throw new Error("MEDUSA_PUBLISHABLE_KEY is missing")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache || "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new MedusaStoreError(res.status, text)
  }

  return res.json()
}

export async function getCustomerToken() {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value || null
}

export async function setCustomerToken(token: string) {
  const cookieStore = await cookies()

  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getCurrentCustomer() {
  const token = await getCustomerToken()

  if (!token) return null

  try {
    const data = await medusaStoreFetch<{
      customer: {
        id: string
        email: string
        first_name?: string | null
        last_name?: string | null
        phone?: string | null
      }
    }>("/store/customers/me", {
      token,
      cache: "no-store",
    })

    return data.customer
  } catch {
    return null
  }
}
