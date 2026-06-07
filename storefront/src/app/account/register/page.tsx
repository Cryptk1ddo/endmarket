import { redirect } from "next/navigation"
import {
  MedusaStoreError,
  medusaStoreFetch,
  setCustomerToken,
} from "@/lib/medusa/account"

export const dynamic = "force-dynamic"
export const revalidate = 0

function safeError(error: unknown) {
  if (error instanceof MedusaStoreError) {
    if (error.body.includes("already") || error.body.includes("exists")) {
      return "Аккаунт с таким email уже существует. Попробуйте войти."
    }

    if (error.status === 401) {
      return "Неверный email или пароль."
    }

    if (error.status === 400) {
      return "Проверьте данные формы. Email может уже использоваться."
    }

    return `Ошибка регистрации: ${error.status}`
  }

  if (error instanceof Error) return error.message

  return "Неизвестная ошибка регистрации"
}

async function registerAction(formData: FormData) {
  "use server"

  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const first_name = String(formData.get("first_name") || "").trim()
  const last_name = String(formData.get("last_name") || "").trim()
  const phone = String(formData.get("phone") || "").trim()

  let errorMessage: string | null = null

  try {
    let token: string

    try {
      const auth = await medusaStoreFetch<{ token: string }>(
        "/auth/customer/emailpass/register",
        {
          method: "POST",
          body: { email, password },
        }
      )

      token = auth.token
    } catch {
      const login = await medusaStoreFetch<{ token: string }>(
        "/auth/customer/emailpass",
        {
          method: "POST",
          body: { email, password },
        }
      )

      token = login.token
    }

    await medusaStoreFetch("/store/customers", {
      method: "POST",
      token,
      body: {
        email,
        first_name,
        last_name,
        phone,
      },
    })

    await setCustomerToken(token)
  } catch (error) {
    errorMessage = safeError(error)
  }

  if (errorMessage) {
    redirect(`/account/register?error=${encodeURIComponent(errorMessage)}`)
  }

  redirect("/account")
}

type Props = {
  searchParams?: Promise<{ error?: string }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {}
  const error = params.error ? decodeURIComponent(params.error) : null

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
        Endmarket / Личный кабинет
      </p>

      <h1 className="mt-8 text-center text-6xl font-semibold tracking-tight">
        ВХОД
      </h1>

      <div className="mt-8 flex justify-center gap-8 border-b text-xs uppercase tracking-[0.2em]">
        <a href="/account/login" className="pb-4 text-neutral-400">
          Войти
        </a>
        <a href="/account/register" className="border-b border-black pb-4">
          Регистрация
        </a>
      </div>

      {error && (
        <div className="mt-8 border-l-2 border-red-600 bg-red-50 px-4 py-4 text-xs uppercase tracking-[0.15em] text-red-700">
          {error}
        </div>
      )}

      <form action={registerAction} className="mt-8 grid gap-6">
        <div className="grid grid-cols-2 gap-5">
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
            Имя
            <input name="first_name" className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none" />
          </label>

          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
            Фамилия
            <input name="last_name" className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none" />
          </label>
        </div>

        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
          Телефон
          <input name="phone" placeholder="+79991234567" className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none" />
        </label>

        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
          Email
          <input name="email" type="email" required className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none" />
        </label>

        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
          Пароль
          <input name="password" type="password" required minLength={8} className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none" />
        </label>

        <button className="mt-2 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
          Создать аккаунт
        </button>
      </form>
    </main>
  )
}
