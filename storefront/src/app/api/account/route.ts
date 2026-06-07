import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://medusa-server:9000"

const MEDUSA_PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  ""

const CUSTOMER_TOKEN_COOKIE = "endmarket_customer_token"

type Json = Record<string, unknown>

async function medusaFetch<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "DELETE"
    body?: Json
    token?: string
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
  }

  if (options.token) {
    headers.authorization = `Bearer ${options.token}`
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    return Promise.reject({
      status: res.status,
      message: data?.message || data?.error || text || "Medusa request failed",
      data,
    })
  }

  return data as T
}

function errorResponse(error: unknown) {
  const err = error as {
    status?: number
    message?: string
  }

  return NextResponse.json(
    {
      error: err?.message || "Request failed",
    },
    {
      status: err?.status || 500,
    }
  )
}

function getToken(req: NextRequest) {
  return req.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value || ""
}

function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action")
  const token = getToken(req)

  try {
    if (action === "me") {
      if (!token) {
        return NextResponse.json({ customer: null }, { status: 200 })
      }

      const data = await medusaFetch("/store/customers/me", {
        token,
      })

      return NextResponse.json(data)
    }

    if (action === "orders") {
      if (!token) {
        return NextResponse.json({ orders: [] }, { status: 200 })
      }

      // Medusa v2 commonly exposes authenticated customer order access through
      // customer-protected store routes. If your backend doesn't expose this,
      // this safely returns an empty order list instead of breaking the UI.
      try {
        const data = await medusaFetch(
          "/store/customers/me/orders?fields=id,display_id,status,fulfillment_status,total,currency_code,created_at,*items",
          {
            token,
          }
        )

        return NextResponse.json(data)
      } catch {
        return NextResponse.json({ orders: [] }, { status: 200 })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const action = body.action

  try {
    if (action === "login") {
      const { email, password } = body

      const auth = await medusaFetch<{ token: string }>(
        "/auth/customer/emailpass",
        {
          method: "POST",
          body: {
            email,
            password,
          },
        }
      )

      const customerData = await medusaFetch("/store/customers/me", {
        token: auth.token,
      })

      const res = NextResponse.json(customerData)
      setTokenCookie(res, auth.token)

      return res
    }

    if (action === "register") {
      const { email, password, first_name, last_name, phone } = body

      let token = ""

      try {
        const auth = await medusaFetch<{ token: string }>(
          "/auth/customer/emailpass/register",
          {
            method: "POST",
            body: {
              email,
              password,
            },
          }
        )

        token = auth.token
      } catch {
        const auth = await medusaFetch<{ token: string }>(
          "/auth/customer/emailpass",
          {
            method: "POST",
            body: {
              email,
              password,
            },
          }
        )

        token = auth.token
      }

      let customerData: unknown

      try {
        customerData = await medusaFetch("/store/customers", {
          method: "POST",
          token,
          body: {
            email,
            first_name,
            last_name,
            phone: phone || undefined,
          },
        })
      } catch {
        customerData = await medusaFetch("/store/customers/me", {
          token,
        })
      }

      const res = NextResponse.json(customerData)
      setTokenCookie(res, token)

      return res
    }

    if (action === "logout") {
      const res = NextResponse.json({ ok: true })

      res.cookies.delete(CUSTOMER_TOKEN_COOKIE)

      return res
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(req: NextRequest) {
  const token = getToken(req)
  const body = await req.json().catch(() => ({}))

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const data = await medusaFetch("/store/customers/me", {
      method: "POST",
      token,
      body: {
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone || undefined,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    return errorResponse(error)
  }
}
