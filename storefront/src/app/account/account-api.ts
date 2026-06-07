export type Customer = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
}

export type OrderItem = {
  title: string
  quantity: number
  unit_price: number
}

export type Order = {
  id: string
  display_id: number
  status: string
  fulfillment_status: string
  total: number
  currency_code: string
  created_at: string
  items: OrderItem[]
}

async function accountFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.error || "Request failed")
  }

  return data
}

export async function getMe() {
  return accountFetch<{ customer: Customer | null }>("/api/account?action=me")
}

export async function getOrders() {
  return accountFetch<{ orders: Order[] }>("/api/account?action=orders")
}

export async function loginCustomer(input: {
  email: string
  password: string
}) {
  return accountFetch<{ customer: Customer }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      ...input,
    }),
  })
}

export async function registerCustomer(input: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}) {
  return accountFetch<{ customer: Customer }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "register",
      ...input,
    }),
  })
}

export async function updateCustomer(input: {
  first_name: string
  last_name: string
  phone?: string
}) {
  return accountFetch<{ customer: Customer }>("/api/account", {
    method: "PATCH",
    body: JSON.stringify(input),
  })
}

export async function logoutCustomer() {
  return accountFetch<{ ok: true }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "logout",
    }),
  })
}

// Change password for the currently authenticated customer.
export async function updatePassword(password: string) {
  return accountFetch<{ ok: true }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "update-password",
      password,
    }),
  })
}

// Trigger Medusa's reset-password flow — emails a reset-token link.
export async function requestPasswordReset(email: string) {
  return accountFetch<{ ok: true }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "request-password-reset",
      email,
    }),
  })
}

// Complete the reset using the token from the emailed link.
export async function confirmPasswordReset(token: string, password: string) {
  return accountFetch<{ ok: true }>("/api/account", {
    method: "POST",
    body: JSON.stringify({
      action: "confirm-password-reset",
      token,
      password,
    }),
  })
}
