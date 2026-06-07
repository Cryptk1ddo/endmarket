import { redirect } from "next/navigation"
import {
  MedusaStoreError,
  medusaStoreFetch,
  setCustomerToken,
} from "@/lib/medusa/account"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getSafeError(error: unknown) {
  if (error instanceof MedusaStoreError) {
    if (error.status === 401) {
      return "Неверный email или пароль."
    }

    if (error.status === 400) {
      return "Проверьте email и пароль."
    }

    return `Ошибка входа: ${error.status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Неизвестная ошибка входа"
}

async function loginAction(formData: FormData) {
  "use server"

  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")

  let errorMessage: string | null = null

  try {
    const data = await medusaStoreFetch<{ token: string }>(
      "/auth/customer/emailpass",
      {
        method: "POST",
        body: { email, password },
      }
    )

    await setCustomerToken(data.token)
  } catch (error) {
    errorMessage = getSafeError(error)
  }

  if (errorMessage) {
    redirect(`/account/login?error=${encodeURIComponent(errorMessage)}`)
  }

  redirect("/account")
}

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
        <a href="/account/login" className="border-b border-black pb-4">
          Войти
        </a>
        <a href="/account/register" className="pb-4 text-neutral-400">
          Регистрация
        </a>
      </div>

      {error && (
        <div className="mt-8 border-l-2 border-red-600 bg-red-50 px-4 py-4 text-xs uppercase tracking-[0.15em] text-red-700">
          {error}
        </div>
      )}

      <form action={loginAction} className="mt-8 grid gap-6">
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
          Email
          <input
            name="email"
            type="email"
            required
            className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none"
          />
        </label>

        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
          Пароль
          <input
            name="password"
            type="password"
            required
            className="border-b border-neutral-300 py-3 text-base normal-case tracking-normal text-black outline-none"
          />
        </label>

        <button className="mt-2 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
          Войти
        </button>

        <a href="/account/register" className="text-sm underline">
          Создать аккаунт
        </a>
      </form>
    </main>
  )
}
