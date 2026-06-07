import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import {
  CUSTOMER_TOKEN_COOKIE,
  getCurrentCustomer,
} from "@/lib/medusa/account"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function logoutAction() {
  "use server"

  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE)

  redirect("/")
}

export default async function AccountPage() {
  const customer = await getCurrentCustomer()

  if (!customer) {
    redirect("/account/login")
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Personal area
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Личный кабинет
          </h1>

          <p className="mt-4 text-neutral-600">{customer.email}</p>
        </div>

        <form action={logoutAction}>
          <button className="rounded-xl border px-5 py-3 text-sm font-medium">
            Выйти
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <a href="/account/profile" className="rounded-2xl border p-6 hover:bg-neutral-50">
          <h2 className="font-semibold">Профиль</h2>
          <p className="mt-2 text-sm text-neutral-600">Имя, email, телефон.</p>
        </a>

        <a href="/account/orders" className="rounded-2xl border p-6 hover:bg-neutral-50">
          <h2 className="font-semibold">Заказы</h2>
          <p className="mt-2 text-sm text-neutral-600">История заказов.</p>
        </a>

        <a href="/catalog" className="rounded-2xl border p-6 hover:bg-neutral-50">
          <h2 className="font-semibold">Каталог</h2>
          <p className="mt-2 text-sm text-neutral-600">Вернуться к покупкам.</p>
        </a>
      </div>
    </main>
  )
}
